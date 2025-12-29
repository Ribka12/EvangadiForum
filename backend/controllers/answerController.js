// Import database connection
const dbConnection = require("../config/db");

// Import HTTP status codes for cleaner responses
const { StatusCodes } = require("http-status-codes");


async function postAnswer(req, res) {
  // Extract required data from request body and authenticated user
  const { questionid, answer } = req.body;
  const { userid } = req.user;

  // Clean and normalize the answer text (remove extra spaces)
  const cleanedAnswer = answer?.trim().replace(/\s+/g, " ");

  // Validate input
  // Ensure question ID and answer are provided
  if (!questionid || !cleanedAnswer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide answer",
    });
  }

  try {
    //  Check if the question exists in the database
    const [question] = await dbConnection.execute(
      `SELECT questionid FROM questions WHERE questionid = ?`,
      [questionid]
    );

    // If question does not exist, return error
    if (question.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Question does not exist",
      });
    }

    //Check for duplicate answer by the same user
    // Prevent users from posting the same answer multiple times
    const [existingAnswer] = await dbConnection.execute(
      `SELECT answerid 
       FROM answers 
       WHERE userid = ? AND questionid = ? AND answer = ?`,
      [userid, questionid, cleanedAnswer]
    );

    // If duplicate answer is found, return error
    if (existingAnswer.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "You have already posted this answer",
      });
    }

    // Insert the new answer into the database
    await dbConnection.execute(
      `INSERT INTO answers (userid, questionid, answer)
       VALUES (?, ?, ?)`,
      [userid, questionid, cleanedAnswer]
    );

    // Send success response
    return res.status(StatusCodes.CREATED).json({
      message: "Answer posted successfully",
    });
  } catch (error) {
    // Log server error for debugging
    console.error(error.message);

    // Return generic server error response
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// Export controller function
module.exports = {
  postAnswer,
};

