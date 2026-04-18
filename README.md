# 🎓 Scholarship Finder — AI-Powered Discovery Platform

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://scholarship-finder-app.vercel.app)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)

**Scholarship Finder** is a premium, full-stack web application designed to help Indian students discover Central and State Government scholarships. Using an intelligent matching algorithm, it connects students with financial aid based on their unique profile.

---

## 🌟 Key Features

### 🚀 Smart Matching Engine
- **Automated Eligibility:** Students fill out a single form, and the platform instantly calculates matching scores for hundreds of scholarships.
- **Detailed Feedback:** If a student is ineligible, the platform explains exactly why (income, state, gender, or category mismatch).

### 🛠️ Advanced Admin Dashboard
- **Scholarship Management:** Effortously add, edit, or delete scholarship schemes.
- **API-Integrated Fetcher:** One-click automated harvesting of the latest scholarships from **data.gov.in** and **Wikipedia API**.
- **Review System:** Approve or Reject crowd-sourced or API-fetched scholarships before they go public.

### 📱 Premium UX/UI
- **Glassmorphic Design:** Modern, sleek interface with a focus on usability.
- **Responsive Layout:** Works perfectly on Mobile, Tablet, and Desktop.
- **Dynamic Icons:** Powered by Lucide-React for a professional look.

---

## 💻 Tech Stack

- **Frontend:** HTML5, Modern CSS (Custom Variables), JavaScript (Vanilla ES6)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas with Mongoose ODM
- **Auth:** JSON Web Tokens (JWT) & Bcrypt.js
- **Deployment:** Vercel

---

## 🛠️ Local Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/arslanhussain9/scholarship-finder-app.git
cd scholarship-finder-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
```

### 4. Seed the Database
Populate your database with the pre-loaded 100+ government scholarship records:
```bash
npm run seed
```

### 5. Start the Application
```bash
# Run locally
node server.js
```
The app will be available at `http://localhost:5000`.

---

## 🌐 Deployment

This project is optimized for **Vercel**. To deploy:
1. Push your code to GitHub.
2. Link your repository to Vercel.
3. **CRITICAL:** Add your `.env` variables (especially `MONGO_URI`) into the Vercel Project Settings.
4. Deploy!

---

## 🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to improve the matching algorithm or UI components.

---

## 📄 License
This project is licensed under the ISC License.

---
*Built with ❤️ for Indian Students.*