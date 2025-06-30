import streamlit as st
import requests
from datetime import date

# 페이지 설정
st.set_page_config(page_title="운세 보는 챗도지", page_icon="🐶", layout="centered")

st.title("🐶 운세 보는 챗도지 🐶")
st.write("생년월일과 태어난 시간을 입력하고 오늘의 운세를 확인해보세요!")

# 세션 상태 초기화
if "threadId" not in st.session_state:
    st.session_state["threadId"] = ""

if "chat_history" not in st.session_state:
    st.session_state["chat_history"] = []

if "myDateTime" not in st.session_state:
    st.session_state["myDateTime"] = ""

if "prev_date_input" not in st.session_state:
    st.session_state["prev_date_input"] = None

if "prev_hour_input" not in st.session_state:
    st.session_state["prev_hour_input"] = None

# Sidebar 입력
with st.sidebar:
    st.header("🔮 개인정보 입력")
    birth_date = st.date_input(
        "생년월일",
        min_value=date(1900, 1, 1),
        max_value=date.today()
    )

    birth_hour = st.selectbox(
        "태어난 시간 (24시 기준)",
        options=["모름"] + [f"{i:02d}" for i in range(24)]
    )

    # 운세 보기 버튼
    if st.button("오늘의 운세 보기"):
        date_str = birth_date.strftime("%Y-%m-%d")
        hour_str = "모름" if birth_hour == "모름" else f"{birth_hour}시"
        my_datetime = f"{date_str} {hour_str}"

        # 날짜 변경 시 초기화
        if (birth_date != st.session_state["prev_date_input"]) or (birth_hour != st.session_state["prev_hour_input"]):
            st.session_state["chat_history"] = []
            st.session_state["threadId"] = ""
            st.session_state["prev_date_input"] = birth_date
            st.session_state["prev_hour_input"] = birth_hour
            st.info("✅ 새롭게 선택된 생년월일로 대화가 시작됩니다.")

        # myDateTime 저장
        st.session_state["myDateTime"] = my_datetime

        # 🚀 "오늘의 운세" 서버 요청 → 출력
        try:
            with st.spinner("오늘의 운세를 가져오는 중..."):
                response = requests.post(
                    "http://localhost:3000/fortuneTell",
                    json={
                        "myDateTime": st.session_state["myDateTime"],
                        "userMessage": "오늘의 운세가 뭐야?",
                        "threadId": st.session_state["threadId"]
                    }
                )
                response.raise_for_status()
                data = response.json()

                assistant_reply = data.get("assistant", "응답이 없습니다.")
                st.session_state["threadId"] = data.get("threadId", "")

                # "오늘의 운세" 첫 메시지 chat_history 에 저장
                st.session_state["chat_history"].append(
                    {"role": "assistant", "content": f"🐶 {assistant_reply}"}
                )

        except requests.exceptions.RequestException as e:
            st.error(f"🚫 서버 요청 중 오류 발생: {e}")

# 현재 myDateTime 표시
if st.session_state["myDateTime"]:
    st.success(f"현재 대화 중인 생년월일: {st.session_state['myDateTime']}")

# 채팅 UI
st.subheader("💬 챗도지와 대화하기")

# 기존 채팅 내용 표시
for msg in st.session_state["chat_history"]:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# 채팅 입력창
user_input = st.chat_input("메시지를 입력하세요")

if user_input:
    # myDateTime 없으면 채팅 금지
    if not st.session_state["myDateTime"]:
        st.warning("❗ 먼저 생년월일과 태어난 시간을 선택하고 '오늘의 운세 보기' 버튼을 눌러주세요.")
    else:
        # 사용자 입력 저장
        st.session_state["chat_history"].append({"role": "user", "content": user_input})

        # 🚀 채팅 내용 서버 요청 → 출력
        try:
            with st.spinner("답변 작성 중..."):
                response = requests.post(
                    "http://localhost:3000/fortuneTell",
                    json={
                        "myDateTime": st.session_state["myDateTime"],
                        "userMessage": user_input,  # ✅ 여기 수정!
                        "threadId": st.session_state["threadId"]
                    }
                )
                response.raise_for_status()
                data = response.json()

                assistant_reply = data.get("assistant", "응답이 없습니다.")
                st.session_state["threadId"] = data.get("threadId", "")

                # 응답 저장
                st.session_state["chat_history"].append(
                    {"role": "assistant", "content": f"🐶 {assistant_reply}"}
                )

        except requests.exceptions.RequestException as e:
            st.error(f"🚫 서버 요청 중 오류 발생: {e}")
