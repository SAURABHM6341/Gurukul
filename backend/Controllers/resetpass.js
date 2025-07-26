const userModel = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const generateOtp = require('../Util/otpGenerater');
const sendOtpEmail = require('../Util/mailsender');
const otpSchema = require('../Models/otp');
// reset password token or email verification token
// both tested
exports.resetPasswordsendOtp = async (req, res) => {
    try{
        const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            message: "please fill all the fields",
            success: false,

        })
    }
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({
            message: "User not found, Please Register yourself :)",
            success: false
        })
    }
    const otp = generateOtp();
    const otpData = await otpSchema.findOne({ email, purpose: "password-reset" });
    if (!otpData) {
        await otpSchema.create({
            email,
            otp,
            purpose: "password-reset"
        });
        await sendOtpEmail(email, "Password Reset OTP for GURUKUL - A Centralized Learning Platform", `OTP for Account Recovery is ${otp}`,);
        return res.status(200).json({
            message: "OTP sent to your email, please check your inbox",
            success: true
        });
    }
    if (otpData.createdAt < Date.now() - 5 * 60 * 1000) {
        otpSchema.findOneAndUpdate(
            { email, purpose: "password-reset" },
            { otp },
            { purpose: "password-reset" },
            { new: true, upsert: true }
        );
        await sendOtpEmail(email, "Password Reset OTP for GURUKUL - A Centralized Learning Platform", `OTP for Account Recovery is ${otp}`,);
        return res.status(200).json({
            message: "OTP sent to your email, please check your inbox",
            success: true
        });
    }
    return res.status(400).json({
        message: "OTP already sent, please check your inbox",
        success: false
    });

    }catch(err){
        console.error("Error in sending OTP:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: err.message
        });
    }
}

//reset password db me entry ke liye

exports.resetPasswordEntry = async (req, res) => {
    try{
        const { email, otp, newpassword, confirmPassword, purpose } = req.body;
    if (!email || !otp || !newpassword || !confirmPassword || !purpose) {
        return res.status(400).json({
            message: "Please fill all the fields",
            success: false
        });
    }
    if (newpassword !== confirmPassword) {
        return res.status(400).json({
            message: "New Password and Confirm Password do not match",
            success: false
        });
    }
    const otpData = await otpSchema.findOne({ email, purpose });
    if (!otpData) {
        return res.status(404).json({
            message: "OTP entry not found, please request a new OTP",
            success: false
        })
    }
    if (otpData.otp !== otp) {
        return res.status(400).json({
            message: "Invalid OTP, please try again",
            success: false
        });
    }
    if (otpData.createdAt < Date.now() - 5 * 60 * 1000) {
        return res.status(400).json({
            message: "OTP expired, please request a new OTP",
            success: false
        });
    }
    const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(newpassword, 10);
        user.password = hashedPassword;
        user.confirmPassword = hashedPassword; // Assuming you want to update confirmPassword as well
        await user.save();
        return res.status(200).json({
            message: "Password reset successfully",
            success: true
        });

    } catch (err) {
        console.error("Error in password encryption:", err);
        return res.status(500).json({
            message: "Password encryption failure",
            error: err
        });
    }
    }catch(err){
        console.error("Error in resetting password:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: err.message
        });
    }
    
}