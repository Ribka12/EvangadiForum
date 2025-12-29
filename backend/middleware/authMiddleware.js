const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : req.headers.authorization;

  if (!authHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Unauthorized: Missing or invalid Authorization header" });
  }

  try {
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Unauthorized",
      message: "Authentication invalid",
    });
  }
}

module.exports = authMiddleware;
