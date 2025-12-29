const express = require("express");
const app = express();
const authMiddleware = require("./middleware/authMiddleware");

const db = require("./config/db");
const authRoute = require("./routes/authRoute");
const questionRoute = require("./routes/questionRoute");
const answerRoute = require("./routes/answerRoute");

app.use(express.json());

app.use("/api", authRoute);
app.use("/api", authMiddleware, questionRoute);
app.use("/api", authMiddleware, answerRoute);

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
