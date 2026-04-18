const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await Student.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Provide default dummy data for eligibility fields so DB schema passes if we didn't update it yet
    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      gender: 'Other',
      date_of_birth: new Date(),
      state: 'Unknown',
      religion: 'Unknown',
      community: 'General',
      disabled: false,
      parent_income: 0,
      parent_profession: 'Unknown',
      hosteler: false,
      education_level: 'Unknown',
      course_name: 'Unknown',
      mode_of_study: 'Unknown',
      institute_name: 'Unknown',
      percentage_10: 0,
      previous_percentage: 0
    });

    if (student) {
      res.status(201).json({
        _id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        token: generateToken(student._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- PERFECT ADMIN LOGIN INTERCEPT ---
    // Instead of forcing the user to create an admin via DB or CLI,
    // this instantly logs them in as Admin with the master email and password.
    if (email === 'admin@scholarshipfinder.com' && password === 'admin123') {
      let admin = await Student.findOne({ email });
      if (!admin) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        admin = await Student.create({
          name: 'Master Admin',
          email,
          password: hashedPassword,
          role: 'admin',
          // Default required fields for Student Schema
          gender: 'Other',
          date_of_birth: new Date(),
          state: 'All',
          religion: 'All',
          community: 'All',
          parent_income: 0,
          parent_profession: 'Unknown',
          education_level: 'Admin',
          course_name: 'Admin',
          mode_of_study: 'Admin',
          institute_name: 'Admin',
          percentage_10: 100,
          previous_percentage: 100
        });
      } else if (admin.role !== 'admin') {
        admin.role = 'admin';
        await admin.save();
      }

      return res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      });
    }
    // -------------------------------------

    const student = await Student.findOne({ email });

    if (student && (await bcrypt.compare(password, student.password))) {
      res.json({
        _id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        token: generateToken(student._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
