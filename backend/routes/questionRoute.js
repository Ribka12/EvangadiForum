// test comment to enable first pull request

const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");



router.get("/", questionController.getAllQuestions);
router.get("/:question_id", questionController.getSingleQuestion);
router.post("/", questionController.postQuestion);

module.exports = router;
