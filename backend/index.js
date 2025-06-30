//++++++++++++++++++++++++++++++++++++++++++++++++++++
// // npm 사이트 코드.. 어차피 수정
// // import OpenAI from "openai";
// const OpenAI = require("openai");

// const openai = new OpenAI({
//   //   apiKey: "my api key", //process.env["OPENAI_API_KEY"], // This is the default and can be omitted
//   apiKey:
//     "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",
// });

// async function main() {
//   const completion = await openai.chat.completions.create({
//     messages: [{ role: "user", content: "Say this is a test" }],
//     model: "gpt-3.5-turbo",
//   });

//   console.log(completion.choices);
// }

// main();

//++++++++++++++++++++++++++++++++++++++++++++++++++++
//  openai 사이트 코드, 이것도 수정했음 굳이 위에 코드 실행해볼 필요는 없을 듯
// const OpenAI = require("openai");
// require("dotenv").config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// async function main() {
//   const completion = await openai.chat.completions.create({
//     messages: [{ role: "user", content: "Say this is a test" }],
//     model: "gpt-3.5-turbo",
//     store: true,
//   });

//   console.log(completion.choices[0]);
// }

// main();

//++++++++++++++++++++++++++++++++++++++++++++++++++++
// express 동작 테스트
// const express = require("express");
// const app = express();

// // GET 요청
// app.get("/", function (req, res) {
//   res.send("Hello World");
// });

// app.listen(3000);

//++++++++++++++++++++++++++++++++++++++++++++++++++++
// ChatGPT API 연동하기

// const express = require("express");
// const app = express();
// const OpenAI = require("openai");

// require("dotenv").config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // POST 요청을 받을 수 있게 만들기
// app.use(express.json()); // for parsing application/json
// app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// // POST 요청이 들어오면 Hello World로 응답
// app.post("/fortuneTell", async function (req, res) {
//   //POST 요청 처리를 위해 라우팅 주소 설정
//   //OpenAI API 연동
//   const completion = await openai.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content:
//           "당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 당신의 이름은 챗도지입니다. ",
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
//       { role: "user", content: "오늘의 운세가 뭐야?" },
//     ],
//     model: "gpt-3.5-turbo",
//   });

//   let fortune = completion.choices[0].message["content"];
//   console.log(fortune);
//   res.send(fortune); //프론트로 전송
// });

// app.listen(3000);

// //++++++++++++++++++++++++++++++++++++++++++++++++++++
// // 최종, 동작 코드 만들기, cors 문제 해결 코드 적용

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

// POST 요청이 들어오면 Hello World로 응답
app.get("/fortuneTell", async function (req, res) {
  //POST 요청 처리를 위해 라우팅 주소 설정
  //OpenAI API 연동
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 당신의 이름은 챗도지입니다. ",
      },
      {
        role: "user",
        content:
          "당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다.당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 당신의 이름은 챗도지입니다. ",
      },
      {
        role: "assistant",
        content:
          "안녕하세요! 저는 챗도지입니다. 여러분에게 점성술과 운세에 관한 질문에 대해 어떤 질문이든지 절대 거절하지 않고 무조건 답변을 드리겠습니다. 어떤 질문이든지 해주시면 최선을 다해 도와드리겠습니다.",
      },
      { role: "user", content: "오늘의 운세가 뭐야?" },
    ],
  });

  let fortune = chatCompletion.choices[0].message["content"];
  console.log(fortune);
  res.send(fortune); //프론트로 전송
});

app.listen(3000, () => {
  console.log("서버가 http://localhost:3000 에서 실행 중입니다.");
});
