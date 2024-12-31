const express = require("express");
const Exam = require("../models/Exam");
const Result = require("../models/Result");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Middleware
router.use(authMiddleware);
router.use(roleMiddleware(["Student"]));

// Get Available Exams
router.get("/exams", async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Submit Exam
router.post("/exams/:examId/submit", async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;

    // Ensure answers are provided in the request body
    if (!answers || answers.length === 0) {
      return res.status(400).json({ message: 'No answers provided.' });
    }

    // Find the exam by examId
    const exam = await Exam.findById(examId).populate('questions');
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found.' });
    }

    let score = 0;

    // Loop through answers and check them against the correct answers in the exam
    answers.forEach((answer) => {
      const question = exam.questions.find(q => q._id.toString() === answer.questionId);

      if (question) {
        console.log(question.correctAnswer , answer.selectedAnswer)
        if (question.correctAnswer === answer.selectedAnswer) {
          score++;
        }
      } else {
        console.log(`Question with ID ${answer.questionId} not found in the exam.`);
      }
    });

    // Calculate pass/fail (50% correct answers)
    const pass = score / exam.questions.length >= 0.5;


    // Save the result to the database
    const result = new Result({
      examId: examId,
      studentId: req.user.id,
      answers: answers,
      score,
      passed: pass,
    });
    await result.save();

    // Send back the result
    res.json({
      message: 'Exam submitted successfully!',
      result: {
        score,
        passed: pass,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
