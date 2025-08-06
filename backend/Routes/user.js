const express = require('express');
const router = require('express').Router();
const {sendOtpMailVerify, login, verifyOtpanduserCreation, changePassword} = require('../Controllers/Auth');
const { authenticate } = require('../Middlewares/auth');
const {resetPasswordsendOtp, resetPasswordEntry} = require('../Controllers/resetpass');
const { deleteAccount } = require('../Controllers/deleteAccount');
const {getallDetails, editDetails,updateProfileImage} = require('../Controllers/additionalDetails');
const {contactQuery} = require('../Controllers/contactUs')
// for login
router.post('/login', login);
// for signup
router.post('/signup/sendOTP', sendOtpMailVerify);
router.post('/signup', verifyOtpanduserCreation);
// password change and reset password
router.put('/changePassword', authenticate,changePassword);
router.post('/resetPassword/sendOtp', resetPasswordsendOtp);
router.put('/resetPassword', resetPasswordEntry);
// delete account
router.delete('/deleteAccount', authenticate, deleteAccount);
// get the user details
router.get('/details',authenticate, getallDetails);
router.put('/details/edit',authenticate, editDetails);
router.put('/details/edit/image',authenticate, updateProfileImage);
// contact

router.post('/contactus/submitform',contactQuery);
module.exports = router;