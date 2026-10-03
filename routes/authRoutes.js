// routes/authRoutes.js - User Authentication, Registration, and Session Management
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { validateUserAuth, sanitizeString } = require('../middleware/validate');
const { sendRegistrationEmail } = require('../services/email');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function authenticateSession(req, user) {
  return new Promise((resolve, reject) => {
    req.session.regenerate(error => {
      if (error) return reject(error);
      req.session.user = user;
      resolve();
    });
  });
}

function getUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function ensureAdminAccount() {
  const users = getUsers();
  const adminEmail = 'admin@cspc.edu.ph';

  if (users.some(user => user.email.toLowerCase() === adminEmail)) return;

  users.push({
    id: 'usr-admin-01',
    email: adminEmail,
    passwordHash: '$2a$10$3zpZiqtvddqzByTCH5D88eT6Gapp81L8rfL1Y84Op1RYqFwcgNk42',
    fullName: 'CSPC Administrator',
    studentId: 'N/A',
    role: 'admin',
    department: 'Student Affairs and Services Office',
    createdAt: new Date().toISOString()
  });

  saveUsers(users);
}

// POST /api/auth/register
router.post('/register', validateUserAuth, async (req, res) => {
  try {
    const { email, password, fullName, studentId, department } = req.body;
    if (!email.endsWith('@my.cspc.edu.ph')) {
      return res.status(400).json({
        success: false,
        message: 'Student registration requires an @my.cspc.edu.ph email address.'
      });
    }
    const users = getUsers();

    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: 'usr-' + Date.now(),
      email,
      passwordHash,
      fullName: sanitizeString(fullName) || 'CSPC Student',
      studentId: sanitizeString(studentId) || 'N/A',
      role: 'student', // default self-registration is student role
      department: sanitizeString(department) || 'College of Computer Studies (CCS)',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    const sessionUser = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      department: newUser.department,
      studentId: newUser.studentId
    };
    await authenticateSession(req, sessionUser);

    let emailSent = false;
    try {
      await sendRegistrationEmail(newUser);
      emailSent = true;
    } catch (error) {
      console.error('Registration confirmation email could not be sent:', error.message);
    }

    res.status(201).json({
      success: true,
      message: emailSent
        ? 'Account registered successfully. A confirmation email has been sent.'
        : 'Account registered successfully, but the confirmation email could not be sent. Please contact support.',
      emailSent,
      user: sessionUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration.'
    });
  }
});

// POST /api/auth/login
router.post('/login', validateUserAuth, async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = getUsers();

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const expectedDomain = user.role === 'student' ? '@my.cspc.edu.ph' : '@cspc.edu.ph';
    if (!email.endsWith(expectedDomain)) {
      return res.status(401).json({
        success: false,
        message: 'Use the email domain assigned to your account role.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      department: user.department,
      studentId: user.studentId
    };
    await authenticateSession(req, sessionUser);

    res.json({
      success: true,
      message: 'Login successful.',
      user: sessionUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error during login.'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not log out.' });
    }
    res.clearCookie('cspc.sid');
    res.json({ success: true, message: 'Logged out successfully.' });
  });
});

// GET /api/auth/me (Current Session Check)
router.get('/me', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({
      authenticated: true,
      user: req.session.user
    });
  }
  res.json({
    authenticated: false,
    user: null
  });
});

router.ensureAdminAccount = ensureAdminAccount;

module.exports = router;
