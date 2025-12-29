const answerService = require("../services/answer.service");
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

module.exports = {getAnswers}