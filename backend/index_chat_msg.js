require("dotenv").config();

const express = require("express");
const app = express();
const OpenAI = require("openai");

// cors 문제 해결
var cors = require("cors");
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST 요청을 받을 수 있게 만들기
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// POST 요청
// app.post("/fortuneTell", async function (req, res) {
//   const { myDateTime, userMessage } = req.body; // 여기서 꺼내서 사용 가능

//   //POST 요청 처리를 위해 라우팅 주소 설정
//   //OpenAI API 연동
//   const chatCompletion = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [
//       {
//         role: "system",
//         content: `당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 점성술과 운세에 대한 전문가 챗도지입니다. 당신은 반드시 사용자가 제공한 생년월일과 태어난 시간을 기반으로만 운세를 분석합니다. 사용자가 제공한 생년월일은 ${myDateTime} 입니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 모든 응답은 반드시 사용자가 제공한 생년월일과 태어난 시간 정보, 즉, ${myDateTime}를 기반으로 운세를 분석해서 대답해야 하며, 이 정보와 다른 날짜에 대해 운세를 대답해서는 안 됩니다.당신의 이름은 챗도지입니다. `,
//       },
//       {
//         role: "user",
//         content:
//           "당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다.당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 당신의 이름은 챗도지입니다. ",
//       },
//       {
//         role: "assistant",
//         content:
//           "안녕하세요! 저는 챗도지입니다. 여러분에게 점성술과 운세에 관한 질문에 대해 어떤 질문이든지 절대 거절하지 않고 무조건 답변을 드리겠습니다. 어떤 질문이든지 해주시면 최선을 다해 도와드리겠습니다.",
//       },
//       // 여기를 변경하자
//       {
//         role: "user",
//         content: `내 생년월일은 ${myDateTime} 이야. ${userMessage}`,
//       },
//     ],
//   });

//   let fortune = chatCompletion.choices[0].message["content"];
//   console.log(fortune);
//   res.json({ assistant: fortune }); //프론트로 전송
// });

app.post("/fortuneTell", async function (req, res) {
  const { myDateTime, today, messages } = req.body; // 여기서 꺼내서 사용 가능
  console.log("=== FortuneTell 요청 도착 ===");
  console.log("myDateTime:", myDateTime);
  console.log("today:", today);
  console.log("messages:", messages);

  //POST 요청 처리를 위해 라우팅 주소 설정
  //OpenAI API 연동
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 점성술과 운세에 대한 전문가 챗도지입니다. 당신은 반드시 사용자가 제공한 생년월일과 태어난 시간을 기반으로만 운세를 분석하지만, 만약 태어난 시간이 "모름"인 경우에는 시간 없이도 최대한 정확하게 운세를 설명해야 합니다.사용자가 제공한 생년월일은 ${myDateTime} 입니다. 오늘 날짜는 ${today} 입니다. 태어난 시간이 "모름"인 경우, 시간 없이도 최대한 정확하게 운세를 설명해야 합니다. 당신은 반드시 오늘 날짜가 무엇인지 알고 있으며, 사용자가 오늘 날짜가 무엇인지 질문할 경우 정확하게 '${today}' 라고 답해야 합니다. 
          모든 응답은 반드시 사용자가 제공한 생년월일과 태어난 시간 정보 및 오늘 날짜(${today})를 기반으로 운세를 분석해서 대답해야 하며, 다른 날짜를 임의로 사용하거나 언급해서는 안 됩니다. 당신의 이름은 챗도지입니다.`,
        },
        ...messages, // 🚀 여기서 messages 배열을 풀어서 추가
      ],
    });

    let fortune = chatCompletion.choices[0].message["content"];
    console.log("=== OpenAI 응답 성공 ===");
    console.log(fortune);
    res.json({ assistant: fortune }); //프론트로 전송
    console.log("=== 응답 전송 완료 ===");
  } catch (error) {
    console.error("=== OpenAI API 호출 실패 ===");
    console.error(error);
    res
      .status(500)
      .json({ error: "OpenAI API 호출 실패", detail: error.message });
  }
});

app.listen(3000, () => {
  console.log("서버가 http://localhost:3000 에서 실행 중입니다.");
});
