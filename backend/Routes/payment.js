const express = require('express');
const router  = express.Router();
const {capturePayment, verifySignature} = require('../Controllers/payment');
const { authenticate, isStudent } = require('../Middlewares/auth');
// ************ payment *************
// Capture payment for a course
router.post('/capture',authenticate, isStudent, capturePayment);
// Verify payment signature and enroll student in course
router.post('/verify-signature', verifySignature);
module.exports = router;