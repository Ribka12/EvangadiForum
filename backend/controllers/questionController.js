const db = require("../config/db");
const { StatusCodes } = require("http-status-codes");

// Function to get all questions
async function getAllQuestions(req, res) {
  try {
    const sql =
      "SELECT q.*, u.username FROM questionTable q JOIN userTable u ON q.user_id = u.user_id ORDER BY q.created_at DESC";

    const [rows] = await db.execute(sql);

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "No questions found.",
      });
    }

    res.status(StatusCodes.OK).json({ questions: rows });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// Function to get single question
async function getSingleQuestion(req, res) {
  const question_id = req.params.question_id;

  try {
   const sql = `
  SELECT q.*, u.username
  FROM questionTable q
  JOIN userTable u ON q.user_id = u.user_id
  WHERE q.question_id = ?
`;

    const [rows] = await db.execute(sql, [question_id]);

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }

    res.status(StatusCodes.OK).json({ question: rows[0] });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// POST QUESTION FUNCTION
async function postQuestion(req, res) {
  const { title, description } = req.body;

  // Get user ID from auth middleware
  const user_id = req.user?.user_id 

  // Validation: Check for required fields
  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  // Validate title length
  if (title.trim().length < 5) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Title must be at least 5 characters long",
    });
  }

  // Validate description length
  if (description.trim().length < 10) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "description must be at least 10 characters long",
    });
  }

  try {
    // Insert the question into database
    const sql =
      "INSERT INTO questionTable (user_id, title, description) VALUES (?, ?, ?)";

    await db.execute(sql, [user_id, title, description]);

    // Success response as per API documentation
    res.status(StatusCodes.CREATED).json({
      message: "Question created successfully",
    });
  } catch (error) {
    console.error("Error posting question:", error);

    // Generic server error as per API documentation
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// Export functions
module.exports = {
  getAllQuestions,
  getSingleQuestion,
  postQuestion,
};
