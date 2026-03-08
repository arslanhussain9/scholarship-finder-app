const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Student = require('../models/Student');

// Get student profile
router.get('/me', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select('-password');
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update student profile (Eligibility Form)
router.put('/profile', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);

    if (student) {
      student.name = req.body.name || student.name;
      student.gender = req.body.gender || student.gender;
      student.date_of_birth = req.body.date_of_birth || student.date_of_birth;
      student.state = req.body.state || student.state;
      student.religion = req.body.religion || student.religion;
      student.community = req.body.community || student.community;
      student.disabled = req.body.disabled !== undefined ? req.body.disabled : student.disabled;
      
      // Step 2
      student.parent_income = req.body.parent_income || student.parent_income;
      student.parent_profession = req.body.parent_profession || student.parent_profession;
      student.hosteler = req.body.hosteler !== undefined ? req.body.hosteler : student.hosteler;
      
      // Step 3
      student.education_level = req.body.education_level || student.education_level;
      student.course_name = req.body.course_name || student.course_name;
      student.mode_of_study = req.body.mode_of_study || student.mode_of_study;
      student.institute_name = req.body.institute_name || student.institute_name;
      student.percentage_10 = req.body.percentage_10 || student.percentage_10;
      student.percentage_12 = req.body.percentage_12 || student.percentage_12;
      student.previous_percentage = req.body.previous_percentage || student.previous_percentage;

      const updatedStudent = await student.save();
      res.json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
