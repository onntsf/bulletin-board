const express = require("express");
const mysql = require("mysql");
const formatter = require("../util/Formatter.js");

const app = express();

const connection = mysql.createConnection({
  host: "localhost"
  //
  //
  //
});

app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  console.log("req: ", req);
  connection.query("SELECT * from t_board", (err, rows, fields) => {
    if (err) throw err;
    res.send(rows[0]);
  });
});

app.post("/", (req, res) => {
  const date_now = new Date();
  const now = formatter.dateFormat(date_now);
  console.log(now);
  const data = {
    board_id: 1,
    thread_id: 1,
    author_id: 1,
    body_text: req.body.val_body,
    created_date: now,
    updated_date: now
  };

  connection.query("insert into t_post set ?", data, (err, rows, fields) => {
    if (err) throw err;
  });
  res.send({ data: "hoge" });
  console.log(req.body.value);
});

app.listen(8888, () => console.log("Example app listening on port 8888!!"));
