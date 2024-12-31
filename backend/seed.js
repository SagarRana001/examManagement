require("dotenv").config();
const mongoose = require("./config/db");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Exam = require("./models/Exam");

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Exam.deleteMany({});

    console.log("Cleared existing data.");

    // Create Admin User
    const adminPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "Admin",
    });
    await adminUser.save();

    // Create Student Users
    const studentPassword = await bcrypt.hash("student123", 10);
    const student1 = new User({
      name: "Student One",
      email: "student1@example.com",
      password: studentPassword,
      role: "Student",
    });
    const student2 = new User({
      name: "Student Two",
      email: "student2@example.com",
      password: studentPassword,
      role: "Student",
    });
    await student1.save();
    await student2.save();

    console.log("Created Admin and Student users.");

    // Create Exams with Questions
    const exams = [];
    for (let i = 1; i <= 10; i++) {
      const questions = [];
      for (let j = 1; j <= 5; j++) {
        questions.push({
          questionText: `Question ${j} for Exam ${i}`,
          options: [`Option A`, `Option B`, `Option C`, `Option D`],
          correctAnswer: `Option A`,
        });
      }
      exams.push({ title: `Sample Exam ${i}`, questions });
    }
    await Exam.insertMany(exams);

    console.log("Created sample exams with questions.");

    // Close Database Connection
    mongoose.connection.close();
    console.log("Database seeded successfully.");
  } catch (err) {
    console.error("Error seeding database:", err);
    mongoose.connection.close();
  }
};

// Run the seed function
seedData();
