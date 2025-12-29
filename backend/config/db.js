const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  multipleStatements: true, // To run multiple CREATE TABLE commands at once
});

const sql = `
CREATE TABLE IF NOT EXISTS userTable (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questionTable (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES userTable(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answerTable (
    answer_id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    user_id INT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questionTable(question_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES userTable(user_id) ON DELETE CASCADE
);
`;

// Use "db.query" because that is what you named your pool
db.query(sql, (err, results) => {
  if (err) {
    console.error("Error creating tables:", err.message);
  } else {
    console.log("Database tables checked/created successfully");
  }
});

module.exports = db.promise();
