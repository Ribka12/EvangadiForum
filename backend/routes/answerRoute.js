const express = require("express");
const router = express.Router();

const { postAnswer, getAnswers } = require("../controllers/answerController");

router.get("/:question_id", getAnswers);

router.post("/", postAnswer);

module.exports = router;
