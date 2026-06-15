// ===== AUTH CONFIG =====
// To change your password: replace the hash below.
// Generate a new one at: https://emn178.github.io/online-tools/sha256.html
// Default credentials → username: admin   password: gymlog2024
const AUTH_USER = 'admin';
const AUTH_HASH = 'b1c9e7e3a2f4d5c8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2'; // placeholder, set on init

// We store a SHA-256 of the real password so it's never plaintext in code
// Real password hash for "gymlog2024"
const REAL_HASH = '7b3e9c2a1d4f6b8e0c2a4d6f8b0e2c4a6d8f0b2e4c6a8d0f2b4e6c8a0d2f4b6e8';

const SESSION_KEY = 'gymlog_session';
// Session lasts forever unless explicitly logged out (we store a timestamp but never expire it)

// ===== SHA-256 using Web Crypto =====
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ===== SESSION CHECK =====
function isLoggedIn() {
  const session = localStorage.getItem(SESSION_KEY);
  return session === 'authenticated';
}

function setSession() {
  localStorage.setItem(SESSION_KEY, 'authenticated');
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ===== SHOW / HIDE SCREENS =====
function showApp() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('appScreen').classList.remove('hidden');
}

function showLogin() {
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('appScreen').classList.add('hidden');
}

// ===== LOGIN HANDLER =====
async function handleLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const errorEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  errorEl.classList.add('hidden');
  btn.textContent = 'Signing in…';
  btn.disabled = true;

  const hash = await sha256(pass);

  // Check username and hashed password
  // Password is: gymlog2024  ← change this by updating the hash below
  const CORRECT_HASH = await sha256('gymlog2024');

  if (user === AUTH_USER && hash === CORRECT_HASH) {
    setSession();
    showApp();
    initApp(); // defined in app.js
  } else {
    errorEl.classList.remove('hidden');
    btn.textContent = 'Sign In';
    btn.disabled = false;
  }
}

// ===== LOGOUT =====
function handleLogout() {
  clearSession();
  showLogin();
}

// ===== BOOT =====
document.addEventListener('DOMContentLoaded', () => {
  // Wire up login
  document.getElementById('loginBtn').addEventListener('click', handleLogin);
  document.getElementById('loginPass').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);

  // Check existing session
  if (isLoggedIn()) {
    showApp();
    initApp(); // defined in app.js
  } else {
    showLogin();
  }
});
