const express = require('express');
const mysql = require('mysql');
const formatter = require('../util/Formatter.js');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
//
//
//
});

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.get('/', (req, res) => {
  console.log('req:-root ');
  connection.query('SELECT * FROM t_board', (err, rows, fields) => {
    if (err) throw err;
    res.send(rows[0]);
  });
  next();
});

app.get('/all', (req, res) => {
  connection.query(
    'select'
      + ' t_post.id as id,'
      + ' t_post.updated_date as updated_date,'
      + ' body_text,'
      + ' m_user.id as user_id,'
      + ' user_name'
      + ' from t_post'
      + ' left join m_user'
      + ' on t_post.user_id = m_user.id',
    (err, rows, fields) => {
      if (err) throw err;
      res.send(rows);
    },
  );
});

app.post('/', (req, res) => {
  const date_now = new Date();
  const now = formatter.dateFormat(date_now);
  const data_post = {
    board_id: 1,
    thread_id: 1,
    user_id: 1,
    body_text: req.body.val_body,
    created_date: now,
    updated_date: now,
  };
  const data_user = {
    user_name: req.body.val_name,
    user_email: req.body.val_email,
    created_date: now,
    updated_date: now,
  };

  connection.query(
    'insert into t_post set ?',
    data_post,
    (err, rows, fields) => {
      if (err) throw err;
    },
  );
  connection.query(
    'insert into m_user set ?',
    data_user,
    (err, rows, fields) => {
      if (err) throw err;
    },
  );
  res.send('ok');
});

app.listen(8888, () => console.log('Bulletin Board app listening on port 8888!!'));
