const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      questionText: String,
      options: [String],
      correctAnswer: String
    }
  ]
});

module.exports = mongoose.model("Exam", ExamSchema);
