const express = require('express');
const mysql = require('mysql');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
//
//
//
});

app.get('/', (req, res) => {
  connection.query('SELECT * from t_board', (err, rows, fields) => {
    if (err) throw err;
    //    console.log(rows);
    //    res.send(rows[0])
    //    res.sendFile(__dirname + '/index.js');
    res.render('index');
  });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
