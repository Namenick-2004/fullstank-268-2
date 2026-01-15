require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 7000;    //  || คือ or คือ ถ้า process.env.PORT ไม่มีค่า จะใช้ 7000 แทน

app.get("/", (req, res) => {
     res.send("Hello World!"); });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});