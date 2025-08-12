const express = require('express');
const router = express.Router();

// Import admin controllers
const {
    getAllUsers,
    getAllStudents,
    getAllInstructors,
    getUserDetails,
    getAllCourses,
    getDashboardStats
} = require('../Controllers/Admin');

// Import middlewares
const { authenticate, isAdmin } = require('../Middlewares/auth');

// ===============================================
// Admin Routes - All routes require admin authentication
// ===============================================

// Get all users
router.get('/users', authenticate, isAdmin, getAllUsers);

// Get all students
router.get('/students', authenticate, isAdmin, getAllStudents);

// Get all instructors
router.get('/instructors', authenticate, isAdmin, getAllInstructors);

// Get user details by ID
router.get('/user/:userId', authenticate, isAdmin, getUserDetails);

// Get all courses
router.get('/courses', authenticate, isAdmin, getAllCourses);

// Get dashboard statistics
router.get('/dashboard/stats', authenticate, isAdmin, getDashboardStats);

module.exports = router;
