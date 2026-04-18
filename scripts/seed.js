const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Scholarship = require('../models/Scholarship');

// Load .env relative to this file's location (project root)
dotenv.config({ path: path.join(__dirname, '../.env') });

const scholarshipsData = [

  // ─────────────────────────────────────────
  // CENTRAL GOVERNMENT SCHOLARSHIPS
  // ─────────────────────────────────────────
  {
    name: "Post Matric Scholarship for SC Students",
    type: "Central", scholarship_level: "UG",
    eligible_classes: ["UG", "PG", "Diploma"], eligible_categories: ["SC"],
    eligible_gender: "All", income_limit: 250000, states: ["All"],
    description: "Financial assistance to SC students studying at post matriculation or post-secondary stage.",
    benefits: "Tuition fee reimbursement and maintenance allowance",
    documents_required: ["Income Certificate", "Caste Certificate", "Aadhar Card"],
    deadline: new Date("2026-10-31"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Post Matric Scholarship for ST Students",
    type: "Central", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["ST"],
    eligible_gender: "All", income_limit: 250000, states: ["All"],
    description: "Financial assistance to ST students studying at post matriculation or post-secondary stage.",
    benefits: "Maintenance allowance and tuition support",
    documents_required: ["Income Certificate", "Caste Certificate", "Aadhar Card"],
    deadline: new Date("2026-10-31"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Post Matric Scholarship for OBC Students",
    type: "Central", scholarship_level: "UG",
    eligible_classes: ["UG", "PG", "Diploma"], eligible_categories: ["OBC"],
    eligible_gender: "All", income_limit: 100000, states: ["All"],
    description: "Financial aid to OBC students studying at post-matric level to continue their education.",
    benefits: "Maintenance allowance and fees",
    documents_required: ["OBC Certificate", "Income Certificate", "Aadhar Card"],
    deadline: new Date("2026-10-31"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "National Means Cum Merit Scholarship (NMMSS)",
    type: "Central", scholarship_level: "School",
    eligible_classes: ["8th", "9th", "10th", "11th", "12th"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 350000, states: ["All"],
    description: "Award scholarships to meritorious students of economically weaker sections to arrest drop out at class VIII.",
    benefits: "₹12,000 per year",
    documents_required: ["Income Certificate", "Mark Sheet", "Aadhar Card"],
    deadline: new Date("2026-09-30"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "AICTE Pragati Scholarship for Girls",
    type: "Central", scholarship_level: "UG",
    eligible_classes: ["Engineering", "Diploma"], eligible_categories: ["All"],
    eligible_gender: "Female", income_limit: 800000, states: ["All"],
    description: "AICTE scheme for Advancement of Girls pursuing Technical Education.",
    benefits: "₹50,000 per year + ₹2,000 contingency",
    documents_required: ["Income Certificate", "Admission Letter", "Aadhar Card"],
    deadline: new Date("2026-10-31"), apply_link: "https://aicte-india.org",
    status: "approved", source: "manual"
  },
  {
    name: "AICTE Saksham Scholarship for Specially-Abled",
    type: "Central", scholarship_level: "UG",
    eligible_classes: ["Engineering", "Diploma"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 800000, states: ["All"],
    description: "AICTE scheme to support specially-abled children pursuing Technical Education.",
    benefits: "₹50,000 per year",
    documents_required: ["Disability Certificate", "Income Certificate", "Admission Letter"],
    deadline: new Date("2026-10-31"), apply_link: "https://aicte-india.org",
    status: "approved", source: "manual"
  },
  {
    name: "INSPIRE Scholarship for Higher Education",
    type: "Central", scholarship_level: "UG",
    eligible_classes: ["BSc", "MSc"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 800000, states: ["All"],
    description: "Innovation in Science Pursuit for Inspired Research (INSPIRE) for Natural/Basic science students.",
    benefits: "₹80,000 per year + summer attachment ₹20,000",
    documents_required: ["12th Board Endorsement", "Admission Proof"],
    deadline: new Date("2026-09-15"), apply_link: "https://online-inspire.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Prime Minister's Scholarship Scheme (PMSS)",
    type: "Central", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["Defense"],
    eligible_gender: "All", income_limit: 800000, states: ["All"],
    description: "Encourages higher technical and professional education for dependents of Ex-Servicemen/Ex-Coast Guard.",
    benefits: "₹3,000/month (boys) ₹3,600/month (girls)",
    documents_required: ["Discharge Book", "PPO", "Bonafide Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://ksb.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Top Class Education Scholarship for SC",
    type: "Central", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["SC"],
    eligible_gender: "All", income_limit: 800000, states: ["All"],
    description: "Providing full financial support to SC students studying at premier institutions.",
    benefits: "Full tuition + ₹2,220/month stipend",
    documents_required: ["Caste Certificate", "Income Certificate", "Admission Proof"],
    deadline: new Date("2026-10-31"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Top Class Education Scholarship for ST",
    type: "Central", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["ST"],
    eligible_gender: "All", income_limit: 600000, states: ["All"],
    description: "Providing full financial support to ST students at premier institutions.",
    benefits: "Full tuition + stipend",
    documents_required: ["Caste Certificate", "Income Certificate", "Admission Proof"],
    deadline: new Date("2026-10-31"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Merit Cum Means Scholarship for Minorities",
    type: "Central", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["Minority"],
    eligible_gender: "All", income_limit: 250000, states: ["All"],
    description: "Financial assistance to poor and meritorious students belonging to minority communities.",
    benefits: "Course fee up to ₹30,000/year + ₹12,000/year maintenance",
    documents_required: ["Income Certificate", "Minority Certificate", "Mark Sheet"],
    deadline: new Date("2026-10-15"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Pre Matric Scholarship for Minorities",
    type: "Central", scholarship_level: "School",
    eligible_classes: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"],
    eligible_categories: ["Minority"], eligible_gender: "All",
    income_limit: 100000, states: ["All"],
    description: "Financial assistance for minority students studying at pre-matriculation level.",
    benefits: "₹1,000–₹10,000 per year",
    documents_required: ["Income Certificate", "Minority Certificate"],
    deadline: new Date("2026-09-15"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Post Matric Scholarship for Minorities",
    type: "Central", scholarship_level: "UG",
    eligible_classes: ["11th", "12th", "UG", "PG"], eligible_categories: ["Minority"],
    eligible_gender: "All", income_limit: 200000, states: ["All"],
    description: "Financial assistance to minority students at post-matriculation level.",
    benefits: "Course fee + ₹570–₹1,200/month",
    documents_required: ["Income Certificate", "Minority Certificate", "Aadhar Card"],
    deadline: new Date("2026-10-15"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Begum Hazrat Mahal National Scholarship",
    type: "Central", scholarship_level: "School",
    eligible_classes: ["9th", "10th", "11th", "12th"], eligible_categories: ["Minority"],
    eligible_gender: "Female", income_limit: 200000, states: ["All"],
    description: "Financial assistance for meritorious minority girl students.",
    benefits: "₹5,000–₹6,000 per year",
    documents_required: ["Income Certificate", "Minority Certificate", "Aadhar Card"],
    deadline: new Date("2026-09-30"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "ISHAN UDAY Scholarship for North East",
    type: "Central", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 450000,
    states: ["Assam", "Arunachal Pradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Tripura", "Sikkim"],
    description: "UGC Special Scholarship Scheme for students from North Eastern Region.",
    benefits: "₹5,400 per month (hosteler), ₹3,000 (day scholar)",
    documents_required: ["Domicile Certificate", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "National Fellowship and Scholarship for SC – Higher Education",
    type: "Central", scholarship_level: "Research",
    eligible_classes: ["PG"], eligible_categories: ["SC"],
    eligible_gender: "All", income_limit: 800000, states: ["All"],
    description: "Fellowship scheme for SC students pursuing M.Phil or Ph.D level research.",
    benefits: "₹25,000–₹28,000/month + HRA + contingency",
    documents_required: ["Caste Certificate", "Admission Proof", "NET Qualify"],
    deadline: new Date("2026-10-31"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "National Fellowship for ST Students",
    type: "Central", scholarship_level: "Research",
    eligible_classes: ["PG"], eligible_categories: ["ST"],
    eligible_gender: "All", income_limit: 800000, states: ["All"],
    description: "Fellowship for ST students pursuing M.Phil or Ph.D.",
    benefits: "₹28,000/month JRF, ₹33,000 SRF + HRA + contingency",
    documents_required: ["Caste Certificate", "Admission Proof"],
    deadline: new Date("2026-10-31"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "National Overseas Scholarship for SC / ST",
    type: "Central", scholarship_level: "PG",
    eligible_classes: ["PG"], eligible_categories: ["SC", "ST"],
    eligible_gender: "All", income_limit: 800000, states: ["All"],
    description: "Financial assistance for SC/ST students for Master's level studies abroad.",
    benefits: "Full living + tuition expenses abroad",
    documents_required: ["Caste Certificate", "Income Certificate", "Passport"],
    deadline: new Date("2026-09-30"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "NTSE – National Talent Search Examination",
    type: "Central", scholarship_level: "School",
    eligible_classes: ["10th", "11th", "12th"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 800000, states: ["All"],
    description: "National Talent Search Examination for meritorious students at class 10 level.",
    benefits: "₹1,250/month (Class 11-12), ₹2,000/month (UG/PG), ₹2,000/month (PhD)",
    documents_required: ["Mark Sheet", "Aadhar Card"],
    deadline: new Date("2026-08-30"), apply_link: "https://ncert.nic.in",
    status: "approved", source: "manual"
  },
  {
    name: "Central Sector Scheme of Scholarships for College Students",
    type: "Central", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 800000, states: ["All"],
    description: "Scholarship for students who scored above 80th percentile in Class 12 board exams.",
    benefits: "₹10,000/year (UG), ₹20,000/year (PG)",
    documents_required: ["12th Marksheet", "Income Certificate", "Admission Proof"],
    deadline: new Date("2026-10-31"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Maulana Azad National Fellowship",
    type: "Central", scholarship_level: "Research",
    eligible_classes: ["PG"], eligible_categories: ["Minority"],
    eligible_gender: "All", income_limit: 250000, states: ["All"],
    description: "Fellowship for minority students pursuing M.Phil/Ph.D research.",
    benefits: "₹28,000–₹33,000/month + HRA + contingency",
    documents_required: ["Minority Certificate", "Income Certificate", "Admission Proof"],
    deadline: new Date("2026-10-31"), apply_link: "https://maef.nic.in",
    status: "approved", source: "manual"
  },
  {
    name: "DR. Ambedkar Post Matric Scholarship for EBC",
    type: "Central", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["General"],
    eligible_gender: "All", income_limit: 100000, states: ["All"],
    description: "Financial aid for Economically Backward Class (EBC) students.",
    benefits: "Maintenance allowance + course fees",
    documents_required: ["Income Certificate", "Aadhar Card", "Admission Proof"],
    deadline: new Date("2026-10-31"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Scholarship for Top Class Students with Disability",
    type: "Central", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 800000, states: ["All"],
    description: "Scholarship for students with disability studying in select institutions.",
    benefits: "Full tuition + ₹3,000/month",
    documents_required: ["Disability Certificate", "Income Certificate", "Admission Proof"],
    deadline: new Date("2026-10-31"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Indira Gandhi PG Scholarship for Single Girl Child",
    type: "Central", scholarship_level: "PG",
    eligible_classes: ["PG"], eligible_categories: ["All"],
    eligible_gender: "Female", income_limit: 800000, states: ["All"],
    description: "UGC scholarship for single girl child pursuing post graduation.",
    benefits: "₹36,200 per year for 2 years",
    documents_required: ["Affidavit of Single Girl Child", "Admission Proof"],
    deadline: new Date("2026-10-31"), apply_link: "https://ugc.ac.in",
    status: "approved", source: "manual"
  },
  {
    name: "PG Indira Gandhi Scholarship for Single Girl Child",
    type: "Central", scholarship_level: "PG",
    eligible_classes: ["PG"], eligible_categories: ["All"],
    eligible_gender: "Female", income_limit: 800000, states: ["All"],
    description: "UGC scholarship encouraging Single Girl Child to pursue PG in non-professional/technical programs.",
    benefits: "₹36,200/year",
    documents_required: ["Affidavit", "Admission Proof", "Aadhar Card"],
    deadline: new Date("2026-10-31"), apply_link: "https://scholarships.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Govt of India Post Doctoral Fellowship for SC / ST",
    type: "Central", scholarship_level: "Research",
    eligible_classes: ["PG"], eligible_categories: ["SC", "ST"],
    eligible_gender: "All", income_limit: 800000, states: ["All"],
    description: "Post-doctoral fellowship for SC/ST candidates to pursue advanced research.",
    benefits: "₹35,000–₹40,000/month + research grant",
    documents_required: ["PhD Certificate", "Caste Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://ugc.ac.in",
    status: "approved", source: "manual"
  },

  // ─────────────────────────────────────────
  // MADHYA PRADESH
  // ─────────────────────────────────────────
  {
    name: "MP Medhavi Vidyarthi Yojana",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 600000, states: ["Madhya Pradesh"],
    description: "Full tuition fee scholarship for meritorious MP students in government and private colleges.",
    benefits: "Full tuition fee",
    documents_required: ["Domicile Certificate", "Income Certificate", "Aadhar Card"],
    deadline: new Date("2026-09-30"), apply_link: "https://medhavikalyan.mp.gov.in/MMVY.aspx",
    status: "approved", source: "manual"
  },
  {
    name: "MP Gaon Ki Beti Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "Female", income_limit: 600000, states: ["Madhya Pradesh"],
    description: "Encourages higher education among rural girls in Madhya Pradesh.",
    benefits: "₹5,000 per year",
    documents_required: ["Domicile Certificate", "Income Certificate", "Aadhar Card"],
    deadline: new Date("2026-09-30"), apply_link: "https://hescholarship.mp.gov.in/Index.aspx",
    status: "approved", source: "manual"
  },
  {
    name: "MP Vikramaditya Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["General"],
    eligible_gender: "All", income_limit: 120000, states: ["Madhya Pradesh"],
    description: "Financial assistance under Vikramaditya scheme for MP domicile General category students.",
    benefits: "₹2,500 per year",
    documents_required: ["Domicile Certificate", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://scholarshipportal.mp.nic.in",
    status: "approved", source: "manual"
  },
  {
    name: "MP Pratibha Kiran Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "Female", income_limit: 600000, states: ["Madhya Pradesh"],
    description: "Scholarship for urban girl students who scored above 60% in Class 12 in MP.",
    benefits: "₹5,000 per year",
    documents_required: ["Domicile Certificate", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://scholarshipportal.mp.nic.in",
    status: "approved", source: "manual"
  },
  {
    name: "MP Post Matric Scholarship for SC/ST/OBC",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["SC", "ST", "OBC"],
    eligible_gender: "All", income_limit: 300000, states: ["Madhya Pradesh"],
    description: "State-level post matric scholarship for backward class students of MP.",
    benefits: "Maintenance allowance + fee",
    documents_required: ["Domicile Certificate", "Caste Certificate", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://www.tribal.mp.gov.in/CMS",
    status: "approved", source: "manual"
  },

  // ─────────────────────────────────────────
  // UTTAR PRADESH
  // ─────────────────────────────────────────
  {
    name: "UP Post Matric Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["SC", "ST", "OBC", "General"],
    eligible_gender: "All", income_limit: 200000, states: ["Uttar Pradesh"],
    description: "State sponsored post matric scholarship for UP domicile students.",
    benefits: "Tuition fee reimbursement + maintenance allowance",
    documents_required: ["Domicile Certificate", "Income Certificate", "Aadhar Card"],
    deadline: new Date("2026-09-20"), apply_link: "https://scholarship.up.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "UP Pre Matric Scholarship",
    type: "State", scholarship_level: "School",
    eligible_classes: ["9th", "10th"], eligible_categories: ["SC", "ST", "OBC", "Minority"],
    eligible_gender: "All", income_limit: 100000, states: ["Uttar Pradesh"],
    description: "State sponsored pre matric scholarship for UP domicile students.",
    benefits: "Monthly stipend + school fee",
    documents_required: ["Domicile Certificate", "Income Certificate", "Aadhar Card"],
    deadline: new Date("2026-09-10"), apply_link: "https://scholarship.up.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "UP Dashmottar Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["SC", "ST", "OBC"],
    eligible_gender: "All", income_limit: 200000, states: ["Uttar Pradesh"],
    description: "UP state post matric scholarship scheme for backward class students.",
    benefits: "Maintenance allowance",
    documents_required: ["Domicile Certificate", "Income Certificate"],
    deadline: new Date("2026-09-20"), apply_link: "https://scholarship.up.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "UP Minority Scholarship",
    type: "State", scholarship_level: "School",
    eligible_classes: ["9th", "10th", "11th", "12th"], eligible_categories: ["Minority"],
    eligible_gender: "All", income_limit: 200000, states: ["Uttar Pradesh"],
    description: "UP state scholarship scheme for minority community students.",
    benefits: "Fee support + stipend",
    documents_required: ["Minority Certificate", "Income Certificate"],
    deadline: new Date("2026-09-20"), apply_link: "https://scholarship.up.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "UP Merit Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 250000, states: ["Uttar Pradesh"],
    description: "Merit based scholarship for UP students in higher education.",
    benefits: "₹10,000 per year",
    documents_required: ["Mark Sheet", "Domicile Certificate"],
    deadline: new Date("2026-09-25"), apply_link: "https://scholarship.up.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Rani Laxmibai Scholarship for Girls – UP",
    type: "State", scholarship_level: "School",
    eligible_classes: ["9th", "10th", "11th", "12th"], eligible_categories: ["All"],
    eligible_gender: "Female", income_limit: 250000, states: ["Uttar Pradesh"],
    description: "UP Government scholarship for girls to reduce dropout at secondary level.",
    benefits: "₹15,000–₹25,000 one time grant",
    documents_required: ["Domicile Certificate", "Income Certificate", "School Certificate"],
    deadline: new Date("2026-09-20"), apply_link: "https://scholarship.up.gov.in",
    status: "approved", source: "manual"
  },

  // ─────────────────────────────────────────
  // MAHARASHTRA
  // ─────────────────────────────────────────
  {
    name: "Maharashtra Rajarshi Shahu Scholarship (EBC)",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["OBC"],
    eligible_gender: "All", income_limit: 800000, states: ["Maharashtra"],
    description: "Scholarship for economically backward class OBC students in Maharashtra.",
    benefits: "₹10,000 per year",
    documents_required: ["Domicile Certificate", "Income Certificate", "Aadhar Card"],
    deadline: new Date("2026-09-25"), apply_link: "https://mahadbt.maharashtra.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Maharashtra EBC Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["General"],
    eligible_gender: "All", income_limit: 800000, states: ["Maharashtra"],
    description: "Economically backward class scholarship for General category students in Maharashtra.",
    benefits: "50% tuition fee",
    documents_required: ["Income Certificate", "Domicile Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://mahadbt.maharashtra.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Maharashtra Minority Scholarship",
    type: "State", scholarship_level: "School",
    eligible_classes: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"],
    eligible_categories: ["Minority"], eligible_gender: "All",
    income_limit: 200000, states: ["Maharashtra"],
    description: "Maharashtra state pre matric scholarship for minority students.",
    benefits: "₹2,600–₹5,600 per year",
    documents_required: ["Minority Certificate", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://mahadbt.maharashtra.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Maharashtra Swadhar Yojana",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["11th", "12th", "UG", "PG"], eligible_categories: ["SC", "NavaBuddha"],
    eligible_gender: "All", income_limit: 250000, states: ["Maharashtra"],
    description: "Provides accommodation and food expenses to SC and NB students in non-government hostels.",
    benefits: "₹51,000 per year for lodging + boarding",
    documents_required: ["Caste Certificate", "Income Certificate", "Domicile Certificate"],
    deadline: new Date("2026-09-25"), apply_link: "https://mahadbt.maharashtra.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Maharashtra Open University Scholarship for Women",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["All"],
    eligible_gender: "Female", income_limit: 600000, states: ["Maharashtra"],
    description: "Special scholarship for women pursuing distance education through YCMOU Maharashtra.",
    benefits: "50% fee concession",
    documents_required: ["Admission Proof", "Aadhar Card"],
    deadline: new Date("2026-09-30"), apply_link: "https://ycmou.digitaluniversity.ac",
    status: "approved", source: "manual"
  },

  // ─────────────────────────────────────────
  // KARNATAKA
  // ─────────────────────────────────────────
  {
    name: "Karnataka Vidyasiri Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["OBC", "SC", "ST"],
    eligible_gender: "All", income_limit: 200000, states: ["Karnataka"],
    description: "Scholarship for students studying in post-matric courses staying in government hostels.",
    benefits: "Hostel fee support + maintenance allowance",
    documents_required: ["Domicile Certificate", "Income Certificate", "Aadhar Card"],
    deadline: new Date("2026-09-30"), apply_link: "https://ssp.karnataka.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Karnataka Fee Reimbursement Scheme",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["SC", "ST", "OBC"],
    eligible_gender: "All", income_limit: 250000, states: ["Karnataka"],
    description: "State scheme for direct tuition fee reimbursement for backward class students.",
    benefits: "Full tuition reimbursement",
    documents_required: ["Domicile Certificate", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://ssp.karnataka.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Karnataka Minority Scholarship",
    type: "State", scholarship_level: "School",
    eligible_classes: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"],
    eligible_categories: ["Minority"], eligible_gender: "All",
    income_limit: 200000, states: ["Karnataka"],
    description: "Scholarship for minority students at pre-matric level in Karnataka.",
    benefits: "Educational allowance",
    documents_required: ["Minority Certificate", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://ssp.karnataka.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Karnataka Rajyotsava Scholarship",
    type: "State", scholarship_level: "School",
    eligible_classes: ["8th", "9th", "10th"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 400000, states: ["Karnataka"],
    description: "Awarded to Kannada medium students who scored highest marks in state exams.",
    benefits: "₹3,000–₹5,000 one time award",
    documents_required: ["Domicile Certificate", "Marks Card"],
    deadline: new Date("2026-09-30"), apply_link: "https://ssp.karnataka.gov.in",
    status: "approved", source: "manual"
  },

  // ─────────────────────────────────────────
  // RAJASTHAN
  // ─────────────────────────────────────────
  {
    name: "Rajasthan Post Matric Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["SC", "ST", "OBC"],
    eligible_gender: "All", income_limit: 250000, states: ["Rajasthan"],
    description: "Rajasthan scholarship for under-represented categories in higher education.",
    benefits: "Course fee reimbursement",
    documents_required: ["Domicile Certificate", "Caste Certificate", "Income Certificate"],
    deadline: new Date("2026-09-25"), apply_link: "https://sje.rajasthan.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Rajasthan Chief Minister Higher Education Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 250000, states: ["Rajasthan"],
    description: "Encourages higher education access across Rajasthan.",
    benefits: "₹5,000 per year",
    documents_required: ["Domicile Certificate", "Income Certificate"],
    deadline: new Date("2026-09-25"), apply_link: "https://hte.rajasthan.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Rajasthan Gargi Award Scholarship",
    type: "State", scholarship_level: "School",
    eligible_classes: ["11th", "12th"], eligible_categories: ["All"],
    eligible_gender: "Female", income_limit: 400000, states: ["Rajasthan"],
    description: "Award for girls who secured above 75% in Class 10 Board and are continuing studies.",
    benefits: "₹3,000–₹5,000 one time grant",
    documents_required: ["10th Marksheet", "Domicile Certificate"],
    deadline: new Date("2026-09-25"), apply_link: "https://rajshaladarpan.nic.in",
    status: "approved", source: "manual"
  },
  {
    name: "Rajasthan Devnarayan Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["OBC"],
    eligible_gender: "All", income_limit: 200000, states: ["Rajasthan"],
    description: "Scholarship for Relatively Backward Class (Gujjar) students in Rajasthan.",
    benefits: "₹10,000–₹15,000 per year",
    documents_required: ["Caste Certificate", "Income Certificate", "Domicile Certificate"],
    deadline: new Date("2026-09-25"), apply_link: "https://sje.rajasthan.gov.in",
    status: "approved", source: "manual"
  },

  // ─────────────────────────────────────────
  // WEST BENGAL
  // ─────────────────────────────────────────
  {
    name: "Swami Vivekananda Merit Cum Means Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 250000, states: ["West Bengal"],
    description: "Assists meritorious students from economically backward families in West Bengal.",
    benefits: "₹1,000–₹5,000 per month",
    documents_required: ["Domicile Certificate", "Income Certificate", "Aadhar Card"],
    deadline: new Date("2026-09-30"), apply_link: "https://svmcm.wb.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "West Bengal Kanyashree Scholarship",
    type: "State", scholarship_level: "School",
    eligible_classes: ["11th", "12th"], eligible_categories: ["All"],
    eligible_gender: "Female", income_limit: 200000, states: ["West Bengal"],
    description: "Initiative supporting continued education of female students in WB.",
    benefits: "K1: ₹1,000/year (Annual) + K2: ₹25,000 one time grant",
    documents_required: ["Domicile Certificate", "Birth Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://kanyashree.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Aikyashree Scholarship – West Bengal",
    type: "State", scholarship_level: "School",
    eligible_classes: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "UG", "PG"],
    eligible_categories: ["Minority"], eligible_gender: "All",
    income_limit: 250000, states: ["West Bengal"],
    description: "West Bengal Government scholarship scheme for minority community students.",
    benefits: "₹1,000–₹10,000 per year",
    documents_required: ["Minority Certificate", "Income Certificate", "Domicile Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://wbmdfcscholarship.in",
    status: "approved", source: "manual"
  },

  // ─────────────────────────────────────────
  // TAMIL NADU
  // ─────────────────────────────────────────
  {
    name: "Tamil Nadu First Graduate Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 500000, states: ["Tamil Nadu"],
    description: "Support for students who are the first graduates in their family in TN.",
    benefits: "Tuition fee concession + ₹1,000/month",
    documents_required: ["Domicile Certificate", "Income Certificate", "First Graduate Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://tnscholarship.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Tamil Nadu BC/MBC Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["OBC"],
    eligible_gender: "All", income_limit: 200000, states: ["Tamil Nadu"],
    description: "Tailored scholarship for Backward Class and Most Backward Class students in TN.",
    benefits: "Course fee + ₹1,000/month",
    documents_required: ["Caste Certificate", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://tnscholarship.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Tamil Nadu Post Matric Scholarship for SC/ST",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["SC", "ST"],
    eligible_gender: "All", income_limit: 250000, states: ["Tamil Nadu"],
    description: "State scholarship for TN SC/ST students post matriculation.",
    benefits: "Maintenance allowance + tuition",
    documents_required: ["Caste Certificate", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://tnscholarship.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Annadurai Scholarship for Girl Students – Tamil Nadu",
    type: "State", scholarship_level: "School",
    eligible_classes: ["11th", "12th"], eligible_categories: ["All"],
    eligible_gender: "Female", income_limit: 300000, states: ["Tamil Nadu"],
    description: "Encourages girls in rural areas to pursue higher secondary education.",
    benefits: "₹2,000 per year bicycle + ₹1,000 incentive",
    documents_required: ["Domicile Certificate", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://tnscholarship.gov.in",
    status: "approved", source: "manual"
  },

  // ─────────────────────────────────────────
  // ANDHRA PRADESH & TELANGANA
  // ─────────────────────────────────────────
  {
    name: "Andhra Pradesh Jagananna Vidya Deevena Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG", "Diploma"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 250000, states: ["Andhra Pradesh"],
    description: "Direct fee reimbursement for all categories of students in AP.",
    benefits: "Full tuition fee reimbursement",
    documents_required: ["Domicile Certificate", "Income Certificate", "Aadhar Card"],
    deadline: new Date("2026-09-30"), apply_link: "https://apepass.apcfss.in",
    status: "approved", source: "manual"
  },
  {
    name: "Andhra Pradesh Jagananna Vasathi Deevena",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG", "Diploma"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 250000, states: ["Andhra Pradesh"],
    description: "Hostel and accommodation support for students from economically weaker sections in AP.",
    benefits: "₹10,000–₹20,000 per year for living expenses",
    documents_required: ["Domicile Certificate", "Income Certificate", "Hostel Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://apepass.apcfss.in",
    status: "approved", source: "manual"
  },
  {
    name: "Telangana TS ePass Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG", "Diploma"], eligible_categories: ["SC", "ST", "OBC", "Minority"],
    eligible_gender: "All", income_limit: 200000, states: ["Telangana"],
    description: "Electronic Payment and Application System of Scholarships for Telangana students.",
    benefits: "Tuition fee + maintenance allowance",
    documents_required: ["Domicile Certificate", "Caste Certificate", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://telanganaepass.cgg.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Telangana Kaloji Narayana Rao University Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 300000, states: ["Telangana"],
    description: "Scholarship for meritorious students in Telangana universities.",
    benefits: "₹20,000 per year",
    documents_required: ["Domicile Certificate", "Income Certificate", "Mark Sheet"],
    deadline: new Date("2026-09-30"), apply_link: "https://bjrscholarships.telangana.gov.in",
    status: "approved", source: "manual"
  },

  // ─────────────────────────────────────────
  // GUJARAT
  // ─────────────────────────────────────────
  {
    name: "Digital Gujarat Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["SC", "ST", "OBC"],
    eligible_gender: "All", income_limit: 250000, states: ["Gujarat"],
    description: "Scholarship for backward class students studying in Gujarat colleges.",
    benefits: "Education fee allowance",
    documents_required: ["Domicile Certificate", "Income Certificate", "Aadhar Card"],
    deadline: new Date("2026-09-30"), apply_link: "https://digitalgujarat.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Gujarat Mukhyamantri Yuva Swavalamban Yojana",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 600000, states: ["Gujarat"],
    description: "Scheme to incentivize self-sustainable education among youth in Gujarat.",
    benefits: "50%–100% tuition fee support",
    documents_required: ["Domicile Certificate", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://mysy.guj.nic.in",
    status: "approved", source: "manual"
  },
  {
    name: "Gujarat SC/ST Post Matric Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["SC", "ST"],
    eligible_gender: "All", income_limit: 200000, states: ["Gujarat"],
    description: "Post matric scholarship for SC/ST students from Gujarat.",
    benefits: "Tuition fee + maintenance allowance",
    documents_required: ["Caste Certificate", "Income Certificate", "Domicile Certificate"],
    deadline: new Date("2026-09-25"), apply_link: "https://esamajkalyan.gujarat.gov.in",
    status: "approved", source: "manual"
  },

  // ─────────────────────────────────────────
  // OTHER STATES
  // ─────────────────────────────────────────
  {
    name: "Jharkhand E-Kalyan Post Matric Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["SC", "ST"],
    eligible_gender: "All", income_limit: 250000, states: ["Jharkhand"],
    description: "Jharkhand sponsored post matric scholarship for SC/ST students.",
    benefits: "Maintenance allowance + course fees",
    documents_required: ["Domicile Certificate", "Income Certificate", "Aadhar Card"],
    deadline: new Date("2026-09-20"), apply_link: "https://ekalyan.cgg.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Jharkhand Pre Matric Scholarship for SC/ST",
    type: "State", scholarship_level: "School",
    eligible_classes: ["9th", "10th"], eligible_categories: ["SC", "ST"],
    eligible_gender: "All", income_limit: 250000, states: ["Jharkhand"],
    description: "Jharkhand pre matric financial aid for SC/ST students.",
    benefits: "Monthly stipend",
    documents_required: ["Caste Certificate", "Income Certificate"],
    deadline: new Date("2026-09-20"), apply_link: "https://ekalyan.cgg.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Odisha Biju Yuva Sashaktikaran Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 250000, states: ["Odisha"],
    description: "Technical and material assistance for modern students of Odisha.",
    benefits: "Laptop + ₹5,000 stipend",
    documents_required: ["Domicile Certificate", "Mark Sheet"],
    deadline: new Date("2026-09-30"), apply_link: "https://scholarship.odisha.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Odisha State Scholarship – Post Matric",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["SC", "ST", "OBC"],
    eligible_gender: "All", income_limit: 200000, states: ["Odisha"],
    description: "Odisha state post matric scholarship for backward class students.",
    benefits: "Fee reimbursement + maintenance",
    documents_required: ["Caste Certificate", "Domicile Certificate", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://scholarship.odisha.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Kerala Higher Education Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 300000, states: ["Kerala"],
    description: "Financial aid for higher educational aspirations in Kerala.",
    benefits: "₹12,000 per year",
    documents_required: ["Domicile Certificate", "Bank Passbook"],
    deadline: new Date("2026-09-30"), apply_link: "https://dcescholarship.kerala.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Kerala ASAP Higher Education Merit Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 400000, states: ["Kerala"],
    description: "Scholarship rewarding merit in higher education from Kerala Government.",
    benefits: "₹15,000 per year",
    documents_required: ["12th Marksheet", "Domicile Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://asapkerala.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Bihar Chief Minister Kanya Utthan Yojana",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "Female", income_limit: 300000, states: ["Bihar"],
    description: "Incentivizes secondary and higher education among young women in Bihar.",
    benefits: "₹25,000 incentive on graduation",
    documents_required: ["Domicile Certificate", "Aadhar Card"],
    deadline: new Date("2026-09-30"), apply_link: "https://medhasoft.bih.nic.in",
    status: "approved", source: "manual"
  },
  {
    name: "Bihar Mukhyamantri Medhavriti Scholarship",
    type: "State", scholarship_level: "School",
    eligible_classes: ["11th", "12th"], eligible_categories: ["SC", "ST"],
    eligible_gender: "Female", income_limit: 800000, states: ["Bihar"],
    description: "Scholarship for SC/ST girls who passed Class 12 with first or second division.",
    benefits: "₹10,000–₹15,000 one time grant",
    documents_required: ["Caste Certificate", "12th Marksheet", "Domicile Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://medhasoft.bih.nic.in",
    status: "approved", source: "manual"
  },
  {
    name: "Delhi Merit Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 250000, states: ["Delhi"],
    description: "Merit-based scholarship for Delhi students pursuing higher education.",
    benefits: "₹10,000 per year",
    documents_required: ["Domicile Certificate", "Mark Sheet"],
    deadline: new Date("2026-09-30"), apply_link: "https://edudel.nic.in",
    status: "approved", source: "manual"
  },
  {
    name: "Delhi SC/ST Post Matric Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["SC", "ST"],
    eligible_gender: "All", income_limit: 200000, states: ["Delhi"],
    description: "Post matric scholarship for SC/ST students domiciled in Delhi.",
    benefits: "Fee reimbursement",
    documents_required: ["Caste Certificate", "Domicile Certificate", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://edistrict.delhigovt.nic.in",
    status: "approved", source: "manual"
  },
  {
    name: "Assam Pragyan Bharati Scholarship",
    type: "State", scholarship_level: "School",
    eligible_classes: ["11th", "12th"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 200000, states: ["Assam"],
    description: "Educational aid offering free learning material assistance in Assam.",
    benefits: "Free textbooks + ₹5,000 stipend",
    documents_required: ["Domicile Certificate"],
    deadline: new Date("2026-09-20"), apply_link: "https://directorateofhighereducation.assam.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Assam Swarnapravas Scheme",
    type: "State", scholarship_level: "Research",
    eligible_classes: ["PG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 500000, states: ["Assam"],
    description: "Assam government scheme to send students abroad for higher education.",
    benefits: "Loan subsidy + fee support for overseas education",
    documents_required: ["Domicile Certificate", "Admission Letter from Foreign University"],
    deadline: new Date("2026-09-30"), apply_link: "https://dhte.assam.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Punjab Post Matric Scholarship for SC",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["SC"],
    eligible_gender: "All", income_limit: 250000, states: ["Punjab"],
    description: "Punjab state scholarship for SC students in higher education.",
    benefits: "Tuition fee + maintenance allowance",
    documents_required: ["Caste Certificate", "Domicile Certificate", "Income Certificate"],
    deadline: new Date("2026-09-25"), apply_link: "https://punjab.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Haryana SC Post Matric Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["SC"],
    eligible_gender: "All", income_limit: 200000, states: ["Haryana"],
    description: "Post matric scholarship for SC students domiciled in Haryana.",
    benefits: "Fee reimbursement",
    documents_required: ["Caste Certificate", "Domicile Certificate"],
    deadline: new Date("2026-09-25"), apply_link: "https://haryanascbc.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Haryana Mukhyamantri Vivah Shagun Yojana",
    type: "State", scholarship_level: "School",
    eligible_classes: ["8th", "9th", "10th", "11th", "12th"], eligible_categories: ["SC", "ST", "OBC"],
    eligible_gender: "Female", income_limit: 200000, states: ["Haryana"],
    description: "Financial assistance to SC/ST/OBC girls for marriage expenditure in Haryana.",
    benefits: "₹31,000 one time grant",
    documents_required: ["Caste Certificate", "BPL Card", "Marriage Certificate"],
    deadline: new Date("2026-09-25"), apply_link: "https://haryanascbc.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Himachal Pradesh Merit Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 300000, states: ["Himachal Pradesh"],
    description: "Merit scholarship for students domiciled in Himachal Pradesh.",
    benefits: "₹900–₹1,200 per month",
    documents_required: ["Domicile Certificate", "Mark Sheet"],
    deadline: new Date("2026-09-30"), apply_link: "https://himachal.nic.in",
    status: "approved", source: "manual"
  },
  {
    name: "Uttarakhand SC/ST Post Matric Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["SC", "ST"],
    eligible_gender: "All", income_limit: 200000, states: ["Uttarakhand"],
    description: "Post matric scholarship for SC/ST students from Uttarakhand.",
    benefits: "Fee reimbursement + maintenance",
    documents_required: ["Caste Certificate", "Domicile Certificate"],
    deadline: new Date("2026-09-25"), apply_link: "https://scholarship.uk.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Chhattisgarh Mukhyamantri Gyan Protsahan Initiative",
    type: "State", scholarship_level: "School",
    eligible_classes: ["10th", "12th"], eligible_categories: ["SC", "ST"],
    eligible_gender: "All", income_limit: 300000, states: ["Chhattisgarh"],
    description: "Incentive for meritorious SC/ST students scoring high marks in CG board exams.",
    benefits: "₹15,000 one time incentive",
    documents_required: ["Mark Sheet", "Caste Certificate", "Domicile Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://schoolscholarship.cg.nic.in",
    status: "approved", source: "manual"
  },
  {
    name: "Goa Scholarship for SC Students",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["SC"],
    eligible_gender: "All", income_limit: 250000, states: ["Goa"],
    description: "Post matric scholarship for SC students in Goa.",
    benefits: "Fee reimbursement",
    documents_required: ["Caste Certificate", "Domicile Certificate", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://www.goa.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Jammu & Kashmir Post Matric Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["SC", "ST", "OBC"],
    eligible_gender: "All", income_limit: 200000, states: ["Jammu and Kashmir"],
    description: "JK Govt post matric scholarship for backward class students.",
    benefits: "Fee + maintenance allowance",
    documents_required: ["Domicile Certificate", "Caste Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://jkdssa.nic.in",
    status: "approved", source: "manual"
  },
  {
    name: "Meghalaya Post Matric Scholarship",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["ST"],
    eligible_gender: "All", income_limit: 250000, states: ["Meghalaya"],
    description: "Post matric scholarship for ST students domiciled in Meghalaya.",
    benefits: "Fee reimbursement + maintenance",
    documents_required: ["Tribe Certificate", "Domicile Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://meghalaya.gov.in",
    status: "approved", source: "manual"
  },
  {
    name: "Manipur Post Matric Scholarship for ST",
    type: "State", scholarship_level: "UG",
    eligible_classes: ["UG", "PG"], eligible_categories: ["ST"],
    eligible_gender: "All", income_limit: 250000, states: ["Manipur"],
    description: "Financial assistance to ST students from Manipur.",
    benefits: "Maintenance allowance + fee",
    documents_required: ["Tribe Certificate", "Domicile Certificate", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://manipur.gov.in",
    status: "approved", source: "manual"
  },

  // ─────────────────────────────────────────
  // PRIVATE / CORPORATE SCHOLARSHIPS
  // ─────────────────────────────────────────
  {
    name: "Reliance Foundation Undergraduate Scholarships",
    type: "Private", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 1500000, states: ["All"],
    description: "Reliance Foundation scholarship for UG students in Engineering, Humanities or Management.",
    benefits: "Up to ₹2,00,000 per year",
    documents_required: ["Aadhar Card", "Income Certificate", "12th Marksheet", "Admission Proof"],
    deadline: new Date("2026-11-30"), apply_link: "https://scholarships.reliancefoundation.org",
    status: "approved", source: "manual"
  },
  {
    name: "HDFC Badhte Kadam Scholarship",
    type: "Private", scholarship_level: "School",
    eligible_classes: ["10th", "11th", "12th", "UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 600000, states: ["All"],
    description: "HDFC Bank CSR scholarship for meritorious students from financially weaker sections.",
    benefits: "Up to ₹1,00,000 per year",
    documents_required: ["Aadhar Card", "Income Certificate", "Previous Year Marksheet"],
    deadline: new Date("2026-10-31"), apply_link: "https://hdfc.scholarships.net.in",
    status: "approved", source: "manual"
  },
  {
    name: "Tata Capital Pankh Scholarship Programme",
    type: "Private", scholarship_level: "School",
    eligible_classes: ["11th", "12th", "UG", "Diploma"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 300000, states: ["All"],
    description: "Tata Capital financial assistance for economically weaker students in India.",
    benefits: "Up to ₹12,000 per year",
    documents_required: ["Aadhar Card", "Income Certificate", "Marksheets"],
    deadline: new Date("2026-10-31"), apply_link: "https://tatacapital.com/pankh",
    status: "approved", source: "manual"
  },
  {
    name: "Buddy4Study Scholarship Programme",
    type: "Private", scholarship_level: "UG",
    eligible_classes: ["UG", "PG", "Diploma"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 800000, states: ["All"],
    description: "Aggregated scholarship programs on Buddy4Study platform for multiple donors.",
    benefits: "Varies by individual scheme (₹5,000–₹50,000)",
    documents_required: ["Aadhar Card", "Income Certificate", "Marksheets"],
    deadline: new Date("2026-11-30"), apply_link: "https://buddy4study.com",
    status: "approved", source: "manual"
  },
  {
    name: "ONGC Scholarship for SC/ST Students",
    type: "Private", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["SC", "ST"],
    eligible_gender: "All", income_limit: 200000, states: ["All"],
    description: "ONGC CSR initiative to support SC/ST students in technical and professional courses.",
    benefits: "₹48,000 per year",
    documents_required: ["Caste Certificate", "Income Certificate", "Admission Proof"],
    deadline: new Date("2026-09-30"), apply_link: "https://www.ongcindia.com",
    status: "approved", source: "manual"
  },
  {
    name: "SBI Asha Scholarship Programme",
    type: "Private", scholarship_level: "School",
    eligible_classes: ["9th", "10th", "11th", "12th"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 300000, states: ["All"],
    description: "SBI Foundation scholarship for meritorious students from economically weaker sections.",
    benefits: "₹15,000 per year",
    documents_required: ["Income Certificate", "Marksheets", "Aadhar Card"],
    deadline: new Date("2026-10-31"), apply_link: "https://sbifoundation.in",
    status: "approved", source: "manual"
  },
  {
    name: "Infosys Foundation Scholarship",
    type: "Private", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 600000, states: ["All"],
    description: "Infosys Foundation scholarship for undergraduate engineering students.",
    benefits: "₹20,000 per year",
    documents_required: ["Income Certificate", "Admission Proof", "Aadhar Card"],
    deadline: new Date("2026-10-31"), apply_link: "https://infosys.com/infosys-foundation",
    status: "approved", source: "manual"
  },
  {
    name: "Wipro Cares Scholarship",
    type: "Private", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 400000, states: ["All"],
    description: "Wipro Cares scholarship for students pursuing engineering or technology programs.",
    benefits: "Up to ₹30,000 per year",
    documents_required: ["Income Certificate", "Admission Letter", "Marksheets"],
    deadline: new Date("2026-10-31"), apply_link: "https://wipro.com/wipro-cares",
    status: "approved", source: "manual"
  },
  {
    name: "Google Generation Scholarship India",
    type: "Private", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "Female", income_limit: 800000, states: ["All"],
    description: "Google scholarship for women students pursuing Computer Science or Engineering.",
    benefits: "₹2,50,000 one-time grants",
    documents_required: ["Admission Proof", "Resume", "Essays"],
    deadline: new Date("2026-12-31"), apply_link: "https://buildyourfuture.withgoogle.com/scholarships",
    status: "approved", source: "manual"
  },
  {
    name: "LIC Golden Jubilee Scholarship",
    type: "Private", scholarship_level: "School",
    eligible_classes: ["11th", "12th", "UG", "Diploma"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 200000, states: ["All"],
    description: "LIC of India scholarship for students from economically weaker sections.",
    benefits: "₹20,000 per year",
    documents_required: ["Income Certificate", "Marksheets", "Aadhar Card"],
    deadline: new Date("2026-09-30"), apply_link: "https://www.licindia.in",
    status: "approved", source: "manual"
  },
  {
    name: "Sitaram Jindal Foundation Scholarship",
    type: "Private", scholarship_level: "UG",
    eligible_classes: ["UG", "PG", "Diploma"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 300000, states: ["All"],
    description: "Scholarship by Sitaram Jindal Foundation for students in professional and technical courses.",
    benefits: "₹1,000–₹2,500 per month",
    documents_required: ["Income Certificate", "Marksheets", "Admission Proof"],
    deadline: new Date("2026-09-30"), apply_link: "https://sjf.co.in",
    status: "approved", source: "manual"
  },
  {
    name: "IOCL Scholarship for SC/ST Students",
    type: "Private", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["SC", "ST"],
    eligible_gender: "All", income_limit: 200000, states: ["All"],
    description: "Indian Oil Corp scholarship for SC/ST students pursuing professional courses.",
    benefits: "₹24,000 per year",
    documents_required: ["Caste Certificate", "Admission Proof", "Income Certificate"],
    deadline: new Date("2026-09-30"), apply_link: "https://iocl.com",
    status: "approved", source: "manual"
  },
  {
    name: "Kotak Kanya Scholarship",
    type: "Private", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "Female", income_limit: 300000, states: ["All"],
    description: "Kotak Education Foundation scholarship for girls pursuing professional undergraduate degrees.",
    benefits: "Up to ₹1,50,000 per year",
    documents_required: ["Income Certificate", "12th Marksheet", "Admission Proof"],
    deadline: new Date("2026-10-31"), apply_link: "https://kotakeducation.org",
    status: "approved", source: "manual"
  },
  {
    name: "Maruti Suzuki Scholarship for Technical Education",
    type: "Private", scholarship_level: "UG",
    eligible_classes: ["UG", "Diploma", "Engineering"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 500000, states: ["All"],
    description: "Maruti Suzuki scholarship for students pursuing technical education / engineering.",
    benefits: "₹20,000–₹50,000 per year",
    documents_required: ["Income Certificate", "Admission Proof", "12th Marksheet"],
    deadline: new Date("2026-10-31"), apply_link: "https://marutisuzuki.com",
    status: "approved", source: "manual"
  },
  {
    name: "Bajaj Finserv Scholarship",
    type: "Private", scholarship_level: "UG",
    eligible_classes: ["UG"], eligible_categories: ["All"],
    eligible_gender: "All", income_limit: 500000, states: ["All"],
    description: "Bajaj Finserv CSR scholarship for meritorious UG students from weaker sections.",
    benefits: "₹30,000–₹60,000 per year",
    documents_required: ["Income Certificate", "12th Marksheet", "Admission Proof"],
    deadline: new Date("2026-10-31"), apply_link: "https://www.bajajfinserv.in",
    status: "approved", source: "manual"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'scholarship-finder'
    });
    console.log("Connected to MongoDB");

    await Scholarship.deleteMany({});
    console.log("Deleted old scholarships");

    await Scholarship.insertMany(scholarshipsData);
    console.log(`✅ Seeded ${scholarshipsData.length} scholarships successfully`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedDB();
