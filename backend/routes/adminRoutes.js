const express = require("express");
const Exam = require("../models/Exam");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Middleware
router.use(authMiddleware);
router.use(roleMiddleware(["Admin"]));

// Create Exam
router.post("/exams", async (req, res) => {
  const { title, questions } = req.body;
  try {
    const exam = new Exam({ title, questions });
    await exam.save();
    res.status(201).json({ message: "Exam created successfully!" });
  } catch (err) {
    res.status(400).json({ message: "Error creating exam", error: err.message });
  }
});

// Get Exams
router.get("/exams", async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
