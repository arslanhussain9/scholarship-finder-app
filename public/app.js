// public/app.js
const API_URL = '/api';

// Utility: Setup Navigation based on Auth State
function setupNav() {
  const token = localStorage.getItem('token');
  const navLinks = document.getElementById('nav-links');
  
  if (!navLinks) return;

  if (token) {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user ? user.role : null; // Assuming user object contains role

    if (role === 'admin') {
      navLinks.innerHTML = `
        <a href="/all-scholarships.html">All Scholarships</a>
        <a href="/admin.html">Admin Dashboard</a>
        <button onclick="logout()" class="btn-secondary">Logout</button>
      `;
    } else { // Normal user
      navLinks.innerHTML = `
        <a href="/all-scholarships.html">All Scholarships</a>
        <a href="/eligibility.html">Check Eligibility</a>
        <a href="/results.html">My Matches</a>
        <a href="/profile.html">Profile</a>
        <button onclick="logout()" class="btn-secondary">Logout</button>
      `;
    }
  } else { // Not logged in
    navLinks.innerHTML = `
      <a href="/all-scholarships.html">All Scholarships</a>
      <a href="/index.html">Home</a>
      <a href="/login.html">Login</a>
      <a href="/register.html" class="btn-primary">Register</a>
    `;
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

function showAlert(elementId, message, type = 'error') {
  const alertEl = document.getElementById(elementId);
  if (!alertEl) return;
  alertEl.textContent = message;
  alertEl.className = `form-alert ${type}`;
  alertEl.style.display = 'block';
  setTimeout(() => { alertEl.style.display = 'none'; }, 5000);
}

// Auth Forms
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = '/eligibility.html';
      } else {
        showAlert('login-alert', data.message);
      }
    } catch (err) {
      showAlert('login-alert', 'Server error. Please try again.');
    }
  });
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
      return showAlert('register-alert', 'Passwords do not match');
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = '/eligibility.html';
      } else {
        showAlert('register-alert', data.message);
      }
    } catch (err) {
      showAlert('register-alert', 'Server error. Please try again.');
    }
  });
}

// Check if authenticated
function enforceAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', setupNav);
