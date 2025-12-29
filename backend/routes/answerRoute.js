// Import the Express framework
const express = require("express");

// Create a router object to define routes
const router = express.Router();

// Import the controller function that will handle posting an answer
const { postAnswer } = require("../controllers/answerController");



// POST request on the root path 
// endpoint to submit a new answer
router.post("/", postAnswer);

// Export the router so it can be used in the main application
module.exports = router;
