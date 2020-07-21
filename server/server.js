const express = require("express");
const mysql = require("mysql");
const formatter = require("../util/Formatter.js");

const app = express();

// コネクションの作成
const connection = mysql.createConnection({
  host: "localhost",
  user: "username",
  password: "password",
  database: "db_bulletin_board"
});

// 設定
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// 投稿データ取得
app.get("/posts", (req, res) => {
  connection.query(
    "select" +
      " t_post.id as id," +
      " t_post.updated_date as updated_date," +
      " body_text," +
      " m_user.id as user_id," +
      " user_name," +
      " user_email" +
      " from t_post" +
      " left join m_user" +
      " on t_post.user_id = m_user.id" +
      " where t_post.deleted = 0",
    (err, rows, fields) => {
      if (err) throw err;
      res.send(rows);
    }
  );
});

// 参照データ取得
app.get("/reference", (req, res) => {
  connection.query(
    "select * from t_reference where deleted = 0",
    (err, rows, fields) => {
      if (err) throw err;
      res.send(rows);
    }
  );
});

// 投稿一時保存
app.post("/temp", (req, res) => {
  const [name, email, body_text, now, message] = validate(req);
  // 問い合わせテーブルへの挿入データ準備
  const data_inquiry = {
    host: req.hostname,
    name: name,
    email: email,
    body_text: body_text,
    message: message,
    created_date: now,
    updated_date: now
  };
  // 問い合わせテーブルへ挿入
  connection.query(
    "insert into t_inquiry set ?",
    data_inquiry,
    (err, rows, fields) => {
      if (err) throw err;
      res.json({ id: rows.insertId, message: data_inquiry.message });
    }
  );
});

// 投稿更新
app.post("/temp/update", (req, res) => {
  const [name, email, body_text, now, message] = validate(req);

  // アップデートテーブルへの挿入データ準備
  const data_inquiry = {
    post_id: req.body.post_id,
    user_id: req.body.user_id,
    host: req.hostname,
    name: name,
    email: email,
    body_text: body_text,
    message: message,
    created_date: now,
    updated_date: now
  };
  // アップデートテーブルへ挿入
  connection.query(
    "insert into t_update set ?",
    data_inquiry,
    (err, rows, fields) => {
      if (err) throw err;
      res.json({ id: rows.insertId, message: data_inquiry.message });
    }
  );
});

// 一時保存中書き込み投稿内容取得
app.get("/confirm", (req, res) => {
  if (typeof req.query.postid !== "undefined") {
    connection.query(
      "select * from t_update" + " where id = ?",
      req.query.id,
      (err, rows, fields) => {
        if (err) throw err;
        res.send(rows);
      }
    );
  } else {
    connection.query(
      "select * from t_inquiry" + " where id = ?",
      req.query.id,
      (err, rows, fields) => {
        if (err) throw err;
        res.send(rows);
      }
    );
  }
});

// 投稿IDに紐づく投稿取得
app.get("/detail", (req, res) => {
  connection.query(
    "select" +
      " t_post.id as id," +
      " t_post.updated_date as updated_date," +
      " body_text," +
      " m_user.id as user_id," +
      " user_name," +
      " user_email" +
      " from t_post" +
      " left join m_user" +
      " on t_post.user_id = m_user.id" +
      " where t_post.id = ?",
    req.query.id,
    (err, rows, fields) => {
      if (err) throw err;
      res.send(rows);
    }
  );
});

// 投稿IDに紐づく投稿の参照情報取得
app.get("/detail/reference", (req, res) => {
  connection.query(
    "select * " + " from t_reference" + " where t_reference.refer_to = ?",
    req.query.id,
    (err, rows, fields) => {
      if (err) throw err;
      res.send(rows);
    }
  );
});

// 投稿登録
app.post("/register", (req, res) => {
  // ユーザマスタへの挿入データ準備
  const name = req.body.name ? req.body.name : "匿名";
  const email = req.body.email;
  const body_text = req.body.body_text;
  const now = formatter.dateSlice(req.body.created_date);

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
          const regex_anchor = />>(\d+)/gi;
          const anchor_match = [...body_text.matchAll(regex_anchor)];
          if (
            !(
              anchor_match &&
              anchor_match.length > 0 &&
              anchor_match[0].length > 0
            )
          ) {
            return;
          }
          // 参照テーブルへの挿入データ準備
          anchor_match.forEach(anchor => {
            const data_reference = {
              referred_from: rows.insertId,
              refer_to: anchor[1],
              created_date: now,
              updated_date: now
            };
            // 参照テーブルへ挿入
            connection.query(
              "insert into t_reference set ?",
              data_reference,
              (err, rows, fields) => {
                if (err) throw err;
              }
            );
          });
        }
      );
    }
  );

  res.send({ message: "ok" });
});

// 投稿更新
app.post("/update", (req, res) => {
  const name = req.body.name ? req.body.name : "匿名";
  const email = req.body.email;
  const body_text = req.body.body_text;
  const now = formatter.dateSlice(req.body.created_date);
  const user_id = req.body.user_id;
  const post_id = req.body.post_id;

  // ユーザマスタの変更データ準備
  const data_user = {
    user_name: name,
    user_email: email,
    created_date: now,
    updated_date: now
  };

  // ユーザマスタアップデート
  connection.query(
    "update m_user set ? where id = ?",
    [data_user, user_id],
    (err, rows, fields) => {
      if (err) throw err;

      // 投稿テーブルのアップデートデータ準備
      const data_post = {
        thread_id: 1,
        user_id: user_id,
        body_text: body_text,
        created_date: now,
        updated_date: now
      };

      // 投稿テーブルのアップデート
      connection.query(
        "update t_post set ? where id = ?",
        [data_post, post_id],
        (err, rows, fields) => {
          if (err) throw err;
          // 対象参照テーブル行を削除
          connection.query(
            "delete from t_reference where referred_from = ?",
            post_id,
            (err, rows, fields) => {
              if (err) throw err;

              const regex_anchor = />>(\d+)/gi;
              const anchor_match = [...body_text.matchAll(regex_anchor)];
              if (
                !(
                  anchor_match &&
                  anchor_match.length > 0 &&
                  anchor_match[0].length > 0
                )
              ) {
                return;
              }
              // 参照テーブルの挿入データ準備
              anchor_match.forEach(anchor => {
                const data_reference = {
                  referred_from: post_id,
                  refer_to: anchor[1],
                  created_date: now,
                  updated_date: now
                };
                // 参照テーブルへ挿入
                connection.query(
                  "insert into t_reference set ?",
                  data_reference,
                  (err, rows, fields) => {
                    if (err) throw err;
                  }
                );
              });
            }
          );
        }
      );
    }
  );

  res.send({ message: "ok" });
});

// 投稿削除
app.post("/delete", (req, res) => {
  const date_now = new Date();
  const now = formatter.dateFormat(date_now);
  const user_id = req.body.user_id;
  const post_id = req.body.id;

  // ユーザマスタの変更データ準備
  const data_user = {
    updated_date: now,
    deleted: 1
  };

  // ユーザマスタアップデート
  connection.query(
    "update m_user set ? where id = ?",
    [data_user, user_id],
    (err, rows, fields) => {
      if (err) throw err;

      // 投稿テーブルのアップデートデータ準備
      const data_post = {
        updated_date: now,
        deleted: 1
      };

      // 投稿テーブルのアップデート
      connection.query(
        "update t_post set ? where id = ?",
        [data_post, post_id],
        (err, rows, fields) => {
          if (err) throw err;
          // 対象参照テーブル行を削除

          const data_reference = {
            updated_date: now,
            deleted: 1
          };
          connection.query(
            "update t_reference set ? where referred_from = ?",
            [data_reference, post_id],
            (err, rows, fields) => {
              if (err) throw err;
            }
          );
        }
      );
    }
  );

  res.send({ message: "ok" });
});

app.listen(8888, () =>
  console.log("Bulletin Board app listening on port 8888!!")
);

// 投稿内容妥当性チェック
const validate = req => {
  const date_now = new Date();
  const now = formatter.dateFormat(date_now);

  let name = req.body.val_name;
  let email = req.body.val_email;
  const body_text = req.body.val_body;

  // 入力チェック
  const regex_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*\.\w+$/;
  let message = "ok";
  if (!body_text) {
    message = "本文がありません！";
  } else if (email && !regex_email.test(email)) {
    message = "メールアドレスを正しく入力して下さい";
  }
  return [name, email, body_text, now, message];
};
