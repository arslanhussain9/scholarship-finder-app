const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  state: { type: String, required: true },
  religion: { type: String, required: true },
  community: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  parent_income: { type: Number, required: true },
  parent_profession: { type: String, required: true },
  hosteler: { type: Boolean, default: false },
  education_level: { type: String, required: true },
  course_name: { type: String, required: true },
  mode_of_study: { type: String, required: true },
  institute_name: { type: String, required: true },
  percentage_10: { type: Number, required: true },
  percentage_12: { type: Number },
  previous_percentage: { type: Number, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
