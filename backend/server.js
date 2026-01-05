require("dotenv").config();
const express = require("express");
const cors = require("cors")
const app = express();
const authMiddleware = require("./middleware/authMiddleware");
const db = require("./config/db");
const authRoute = require("./routes/authRoute");
const questionRoute = require("./routes/questionRoute");
const answerRoute = require("./routes/answerRoute");

app.use(express.json());
app.use(cors);

app.use("/api/user", authRoute);
app.use("/api/question", authMiddleware, questionRoute);
app.use("/api/answer", authMiddleware, answerRoute);

const PORT = 5000;

async function start() {
  try {
    await db.execute("SELECT 1");
    app.listen(PORT, function () {
      console.log("Database connected successfully");
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

start();
