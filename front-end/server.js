const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.use("/login", (req, res) => {
  res.send({
    email: "bilal.oguz@aviteng.com",
    id: "1",
    phone: "00905455277931",
    username: "bso",
    password: "987412365",
  });
});

app.listen(8080, () =>
  console.log("API is running on http://localhost:8080/login")
);
