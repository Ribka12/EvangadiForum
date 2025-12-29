
const db = require("../config/db");
const { StatusCodes } = require("http-status-codes");

// GET ANSWERS FOR QUESTION
async function getAnswers(req, res) {
  try {
    const question_id = req.params.question_id;
    if (!question_id || isNaN(question_id)) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "The requested question could not be found." });
    }
    const sql =
      "SELECT a.*, u.username FROM answerTable a JOIN userTable u ON a.user_id = u.user_id WHERE a.question_id = ? ORDER BY a.created_at ASC";
    const result = await db.execute(sql, [question_id]);
    res.status(StatusCodes.OK).json(result[0]);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An unexpected error occurred." });
  }
}

async function postAnswer(req, res) {
  const { question_id, answer } = req.body;
  const { userid } = req.user;

  const cleanedAnswer = answer?.trim().replace(/\s+/g, " ");
  // 1️⃣ Validate input
  if (!question_id || !cleanedAnswer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide answer",
    });
  }

  try {
    // 2️⃣ Check if question exists
    const [question] = await dbConnection.execute(
      `SELECT question_id FROM questions WHERE question_id = ?`,
      [question_id]
    );

    if (question.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Question does not exist",
      });
    }

    // 2️⃣.5 Check for duplicate answer by same user
    const [existingAnswer] = await dbConnection.execute(
      `SELECT answer_id FROM answers 
   WHERE userid = ? AND question_id = ? AND answer = ?`,
      [userid, question_id, cleanedAnswer]
    );

    if (existingAnswer.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "You have already posted this answer",
      });
    }

    // 3️⃣ Insert answer
    await dbConnection.execute(
      `INSERT INTO answers (userid, question_id, answer)
       VALUES (?, ?, ?)`,
      [userid, question_id, cleanedAnswer]
    );

    // 4️⃣ Success response
    return res.status(StatusCodes.CREATED).json({
      message: "Answer posted successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

module.exports = { getAnswers, postAnswer };
