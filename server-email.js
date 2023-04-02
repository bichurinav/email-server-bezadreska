import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
const app = express();

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://127.0.0.1:8080",
      "http://127.0.0.1:",
    ],
  })
);

const { login, password, email } = dotenv.config().parsed;

const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: login,
    pass: password,
  },
});

app.use(express.json());

app.post("/feedback", (req, res) => {
  const { name, number, message } = req.body;
  const date = new Date();
  const currentMonth = date.getUTCMonth() + 1;
  const parsedMonth =
    currentMonth.toString().length > 1
      ? currentMonth
      : `0${currentMonth.toString()}`;
  const parsedFullDate = `${date.getUTCDate()}.${parsedMonth}.${date.getUTCFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  const mailOptions = {
    from: email,
    to: email,
    subject: `Заявка от клиента: ${name}`,
    text: `Имя клиента: ${name}. \nТелефон: ${number}.\n Комментарий: ${
      message.length > 0 ? message : "отсутствует"
    }\n Дата: ${parsedFullDate}`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(500).json({ status: "error" });
    } else {
      res.status(200).json({ status: "successful" });
    }
  });
});

app.listen(3003, () => {
  console.log("Server is started!");
});
