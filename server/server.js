const express = require("express");
const mysql = require("mysql");
const formatter = require("../util/Formatter.js");

const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  user: "misa",
  password: "chappy",
  database: "db_bulletin_board"
});

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  connection.query("SELECT * FROM t_board", (err, rows, fields) => {
    if (err) throw err;
    res.send(rows[0]);
  });
  next();
});

app.get("/all", (req, res) => {
  connection.query(
    "select" +
      " t_post.id as id," +
      " t_post.updated_date as updated_date," +
      " body_text," +
      " m_user.id as user_id," +
      " user_name" +
      " from t_post" +
      " left join m_user" +
      " on t_post.user_id = m_user.id",
    (err, rows, fields) => {
      if (err) throw err;
      res.send(rows);
    }
  );
});

app.post("/", (req, res) => {
  const date_now = new Date();
  const now = formatter.dateFormat(date_now);

  let name = req.body.val_name;
  let email = req.body.val_email;
  const body_text = req.body.val_body;

  // 入力チェック
  const regex_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*\.\w+$/;
  if (email && !regex_email.test(email)) {
    req.body.message = "メールアドレスを正しく入力して下さい";
    res.send(req.body);
    return;
  }
  if (!body_text) {
    req.body.message = "本文を入力して下さい";
    res.send(req.body);
    return;
  }
  if (!name) name = "名無しさん＠１周年";

  // ユーザマスタへの挿入データ準備
  const data_user = {
    user_name: name,
    user_email: email,
    created_date: now,
    updated_date: now
  };
  // ユーザマスタへ挿入
  connection.query(
    "insert into m_user set ?",
    data_user,
    (err, rows, fields) => {
      if (err) throw err;

      // 投稿テーブルへの挿入データ準備
      const data_post = {
        thread_id: 1,
        user_id: rows.insertId,
        body_text: body_text,
        created_date: now,
        updated_date: now
      };
      // 投稿テーブルへ挿入
      connection.query(
        "insert into t_post set ?",
        data_post,
        (err, rows, fields) => {
          if (err) throw err;

          const regex_anchor = /(>>\d+)/gi;
          const anchor_match = [...body_text.matchAll(regex_anchor)];
          if (
            !(
              anchor_match &&
              anchor_match.length > 0 &&
              anchor_match[0].length > 0
            )
          )
            return;
          const anchor = anchor_match[0][1];
          // 参照テーブルへの挿入データ準備
          const data_refer = {
            referred_from: rows.insertId,
            refer_to: anchor,
            created_date: now,
            updated_date: now
          };
          // 参照テーブルへ挿入
          connection.query(
            "insert into t_refer set ?",
            data_refer,
            (err, rows, fields) => {
              if (err) throw err;
            }
          );
        }
      );
    }
  );

  //  connection.query(
  //    'select LAST_INSERT_ID()',
  //    (err, rows, fields) => {
  //      if (err) throw err;
  //      console.log('rororo:', rows)
  //    },
  //  );

  req.body.message = "ok";
  res.send(req.body);
});

app.listen(8888, () =>
  console.log("Bulletin Board app listening on port 8888!!")
);
