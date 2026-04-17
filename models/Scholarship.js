const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Central', 'State', 'Private'], required: true },
  scholarship_level: { type: String, required: true },
  eligible_classes: [{ type: String }],
  eligible_categories: [{ type: String }],
  eligible_gender: { type: String, enum: ['All', 'Male', 'Female'], default: 'All' },
  income_limit: { type: Number, required: true },
  states: [{ type: String }], // 'All' for central
  description: { type: String, required: true },
  benefits: { type: String, required: true },
  documents_required: [{ type: String }],
  deadline: { type: Date, required: true },
  apply_link: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  source: { type: String, default: 'manual' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
