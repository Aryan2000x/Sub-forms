const mysql = require('mysql2')

// Create MySQL local connection
// const db = mysql.createConnection({
//   user: process.env.DATABASE_USER,
//   host: process.env.HOST,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE,
//   port: process.env.DATABASE_PORT,
// });

// Create a Mysql cloud server connection
const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL server:", err);
    return;
  }
  console.log("Connected to MySQL server!");
});

module.exports = db;

