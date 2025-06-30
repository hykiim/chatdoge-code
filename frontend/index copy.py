# ------------------------- 처음코드(운세만)

import streamlit as st
import requests
from datetime import date

# Streamlit 페이지 기본 설정
st.set_page_config(page_title="운세 보는 챗도지", page_icon="🐶", layout="centered")

st.title("🐶 운세 보는 챗도지 🐶")
st.write("생년월일과 태어난 시간을 입력하고 오늘의 운세를 확인해보세요!")

# Sidebar에 입력받기
with st.sidebar:
    st.header("🔮 개인정보 입력")
    birth_date = st.date_input(
        "생년월일",
        min_value=date(1900, 1, 1),  # 최소 1900년까지 가능
        max_value=date.today()       # 오늘까지 가능
    )
    birth_hour = st.selectbox("태어난 시간 (24시 기준)", options=["모름"] + [f"{i:02d}" for i in range(24)])
    st.markdown("---")
    if st.button("오늘의 운세 보기"):
        if not birth_date:
            st.error("❗ 생년월일을 입력해주세요.")
        else:
            # 입력값 준비
            date_str = birth_date.strftime("%Y-%m-%d")
            hour_str = "모름" if birth_hour == "모름" else f"{birth_hour}시"
            my_datetime = f"{date_str} {hour_str}"
            # Node.js 서버로 POST 요청
            try:
                with st.spinner("운세를 가져오는 중..."):
                    response = requests.post(
                        "http://localhost:3000/fortuneTell",
                        json={
                            "myDateTime": my_datetime,
                            "userMessage": "오늘의 운세가 뭐야?",
                            "threadId": ""  # 첫 요청이므로 빈 값
                        }
                    )
                    response.raise_for_status()
                    data = response.json()

                    # 결과 출력
                    st.success("✨ 오늘의 운세 ✨")
                    st.write(data.get("assistant", "응답이 없습니다.")) #서버로부터 받은 데이터 출력

                    # threadId 저장 가능 (state 사용)
                    st.session_state["threadId"] = data.get("threadId", "")

            except requests.exceptions.RequestException as e:
                st.error(f"🚫 서버 요청 중 오류 발생: {e}")

# 채팅 입력 영역
st.markdown("---")
st.subheader("💬 챗도지와 대화하기")
if "threadId" not in st.session_state:
    st.session_state["threadId"] = ""

user_input = st.text_input("메시지 입력", "")
if st.button("Send"):
    if user_input.strip() == "":
        st.warning("❗ 메시지를 입력하세요.")
    else:
        try:
            with st.spinner("답변 작성 중..."):
                response = requests.post(
                    "http://localhost:3000/fortuneTell",
                    json={
                        "myDateTime": my_datetime,
                        "userMessage": user_input,
                        "threadId": st.session_state["threadId"]
                    }
                )
                response.raise_for_status()
                data = response.json()

                # 응답 출력
                st.write(f"**🐶 챗도지:** {data.get('assistant', '응답이 없습니다.')}")
                st.session_state["threadId"] = data.get("threadId", "")

        except requests.exceptions.RequestException as e:
            st.error(f"🚫 서버 요청 중 오류 발생: {e}")
