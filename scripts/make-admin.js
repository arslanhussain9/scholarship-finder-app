const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Student = require('../models/Student');
dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'scholarship-finder'
    });
    console.log("Connected to MongoDB Cloud Database");

    const adminEmail = 'admin@admin.com';
    const adminPassword = 'admin';

    // Check if admin already exists
    const exists = await Student.findOne({ email: adminEmail });
    if (exists) {
      console.log(`Admin account ${adminEmail} already exists!`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await Student.create({
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
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

    console.log(`✅ EXCELLENT! Admin account created!`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit(0);

  } catch (error) {
    console.error("Error creating Admin account:", error);
    process.exit(1);
  }
};

createAdmin();
