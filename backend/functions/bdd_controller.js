const mysql = require('mysql');

var dbPool = mysql.createPool({
  connectionLimit : 10,
  acquireTimeout  : 10000,
  port            : process.env.BDD_PORT,
  host            : process.env.BDD_HOST,
  user            : process.env.BDD_USERNAME,
  password        : process.env.BDD_PASSWORD,
  database        : process.env.BDD_DATABASE
});

dbPool.on('connection', function (connection) {
  console.log('Connected to BDD');

  connection.on('error', function (err) {
    console.error(new Date(), 'MySQL error', err.code);
  });
  connection.on('close', function (err) {
    console.error(new Date(), 'MySQL close', err);
  });

});

module.exports = dbPool;