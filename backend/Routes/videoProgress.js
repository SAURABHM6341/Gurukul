const express = require('express');
const router = express.Router();

const { authenticate, isStudent } = require('../Middlewares/auth');
const {
    updateVideoProgress,
    getCourseProgress,
    markVideoCompleted,
    getVideoAnalytics
} = require('../Controllers/videoProgress');

// Student routes - for tracking video progress
router.post('/update-progress', authenticate, isStudent, updateVideoProgress);
router.get('/course/:courseId', authenticate, isStudent, getCourseProgress);
router.post('/mark-completed', authenticate, isStudent, markVideoCompleted);

// Instructor routes - for video analytics
router.get('/analytics/:courseId', authenticate, getVideoAnalytics);

module.exports = router;
