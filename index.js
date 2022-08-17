const express = require("express");
const morgan = require("morgan");
// morgan : 서버로 어떤 데이터들이 들어오나 확인하는 것(Beckend)
const axios = require("axios");
const cors = require("cors");

const app = express();

// *env : 환경변수
const dotenv = require("dotenv").config();
const NAVER_ID = process.env.NAVER_ID;
const NAVER_SECRET_ID = process.env.NAVER_SECRET_ID;

//setting
app.set("port", process.env.PORT || 8099);
// process.env.PORT : client 환경상에서 정해준 포트가 있을경우 이를 우선적으로 사용
const port = app.get("port");
// console.log(port);

app.use(morgan("dev"));
// morgan() >> 디테일하게 길게 보여줌
// morgan("dev") >> 축약해서 보여줌

app.use(cors());

// POST data >> body 할 때, 처리해줘야 하는 것
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("hello express");
});

// get >> post로 바꾸기
app.post("/papago", (req, res) => {
  // POST방식으로 보내는 데이터는 body로 보내야만 받을 수 있다.
  console.log(req.body.txt);
  const txt = req.body.txt;
  const language = req.body.language;
  axios({
    url: `https://openapi.naver.com/v1/papago/n2mt`,
    method: "POST",
    // method default는 get
    // 대문자로 작성
    // POST는 params로 보냄
    params: {
      source: "ko",
      target: language,
      text: txt,
    },
    headers: {
      "X-Naver-Client-Id": NAVER_ID,
      "X-Naver-Client-Secret": NAVER_SECRET_ID,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
    .then((response) => {
      // console.log(response.data.message.result.translatedText);
      res.json({
        result: response.data.message.result.translatedText,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

// app.listen(8099, () => {
//   console.log("8099에서 서버 대기중");
// });

app.listen(port, () => {
  console.log(`${port}에서 서버 대기중`);
});
