const next = require('next');
const express = require('express');
const mysql = require('mysql');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const connection = mysql.createConnection({
  host: 'localhost',
//
//
//
});

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('/', (req, res) => {
      connection.query('SELECT * from t_board', (err, rows, fields) => {
        if (err) throw err;
        //        res.send(rows[0])
        app.render(req, res, '/index');
      });
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
