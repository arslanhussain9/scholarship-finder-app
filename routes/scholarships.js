const express = require('express');
const router = express.Router();
const Scholarship = require('../models/Scholarship');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all scholarships (Public or Admin)
router.get('/', async (req, res) => {
  try {
    const scholarships = await Scholarship.find({});
    res.json(scholarships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Add Scholarship
router.post('/', protect, admin, async (req, res) => {
  try {
    const scholarship = new Scholarship(req.body);
    const createdScholarship = await scholarship.save();
    res.status(201).json(createdScholarship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Update Scholarship
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ message: 'Not found' });

    Object.assign(scholarship, req.body);
    const updated = await scholarship.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Delete Scholarship
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ message: 'Not found' });
    
    await scholarship.deleteOne();
    res.json({ message: 'Scholarship removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get matches for student
router.get('/matches', protect, async (req, res) => {
  try {
    const student = req.student;
    const scholarships = await Scholarship.find({});

    const eligible = [];
    const ineligible = [];

    scholarships.forEach(sch => {
      let isEligible = true;
      const reasons = [];
      let totalCriteria = 4; // State, Income, Category, Gender
      let matchedCriteria = 0;

      // 1. Check State Match
      const stateMatch = sch.states.includes('All') || sch.states.includes(student.state);
      if (!stateMatch) {
        isEligible = false;
        reasons.push(`State mismatch: Open for ${sch.states.join(', ')}`);
      } else {
        matchedCriteria++;
      }

      // 2. Check Income Limit
      if (student.parent_income > sch.income_limit) {
        isEligible = false;
        reasons.push(`Income exceeds limit of ₹${sch.income_limit}`);
      } else {
        matchedCriteria++;
      }

      // 3. Check Category Match
      const categoryMatch = sch.eligible_categories.includes('All') || sch.eligible_categories.includes(student.community);
      if (!categoryMatch) {
        isEligible = false;
        reasons.push(`Category mismatch: Open for ${sch.eligible_categories.join(', ')}`);
      } else {
        matchedCriteria++;
      }

      // 4. Check Gender Match
      const genderMatch = sch.eligible_gender === 'All' || sch.eligible_gender === student.gender;
      if (!genderMatch) {
        isEligible = false;
        reasons.push(`Gender mismatch: Only for ${sch.eligible_gender}`);
      } else {
        matchedCriteria++;
      }

      // 5. Check Education Match (if needed)
      // Here we assume "All" if empty, otherwise check
      if (sch.eligible_classes && sch.eligible_classes.length > 0 && sch.eligible_classes[0] !== 'All') {
        totalCriteria++;
        if (!sch.eligible_classes.includes(student.education_level)) {
           isEligible = false;
           reasons.push(`Education level mismatch`);
        } else {
           matchedCriteria++;
        }
      }

      const matchScore = Math.round((matchedCriteria / totalCriteria) * 100);

      if (isEligible) {
        eligible.push({ scholarship: sch, matchScore });
      } else {
        ineligible.push({ scholarship: sch, reasons, matchScore });
      }
    });

    // Sort eligible by highest match score, then by closest deadline
    eligible.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ eligible, ineligible });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
