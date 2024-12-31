const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: [
    {
      questionId: String,
      selectedAnswer: String
    }
  ],
  score: Number,
  passed: Boolean
});

module.exports = mongoose.model("Result", ResultSchema);
