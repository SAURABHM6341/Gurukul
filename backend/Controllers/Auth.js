const userModel = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const generateOtp = require('../Util/otpGenerater');
const otpSchema = require('../Models/otp');
const profile = require('../Models/profle');
const mailSender = require('../Util/mailsender');
//all tested
//login

exports.login = async (req, res) => {
    try {
        const { email, password, accType } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields",
                success: false
            });
        }
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found, Please Register yourself :)",
                success: false
            });
        }
        if (user.accountType !== accType) {
            return res.status(403).json({
                message: "You are not authorized to access this account type",
                success: false
            })
        }
        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType
        }
        const isPassvalid = await bcrypt.compare(password, user.password);
        if (!isPassvalid) {
            return res.status(401).json({
                message: "Invalid credentials, Please try again",
                success: false
            });
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' }); // 3 hours expiration
        user = user.toObject(); // Convert Mongoose document to plain object
        user._id = user._id.toString(); // Convert ObjectId to string
        user.token = token; // Add token to user object
        user.password = undefined; // Remove password from user object
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days expiration
            httpOnly: true,
            secure: true,
            sameSite: "none"
        };
        res.cookie("token", token, options).status(200).json({
            message: "User logged in successfully",
            success: true,
            token,
            user
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error, please try again later",
            error: "err"
        });
    }
}

//change password (user want to change its old password not forgot it )

exports.changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword, confirmNewPassword } = req.body;
        if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                message: "Please fill all the fields",
                success: false
            });
        }
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                message: "New passwords do not match",
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
        const isPassvalid = await bcrypt.compare(oldPassword, user.password);
        if (!isPassvalid) {
            return res.status(401).json({
                message: "Old password is incorrect",
                success: false
            });
        }
        let hashedNewPassword;
        hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        user.confirmPassword = hashedNewPassword; // Assuming you want to update confirmPassword as well
        await user.save();
        // Optionally, you can send a confirmation email about the password change
        const emailBody = `<p>Your password has been changed successfully.</p>`;
        try {
            await mailSender(user.email, "Password Change Confirmation", emailBody);
            console.log("Confirmation email sent successfully");
        } catch (err) {
            console.error("Error in sending confirmation email:", err);
        }
        return res.status(200).json({
            message: "Password changed successfully",
            success: true
        });
    } catch (err) {
        console.error("Error in password encryption:", err);
        return res.status(500).json({
            message: "Password encryption failure",
            error: "err"
        });
    }
}


//send otp for mail verification
exports.sendOtpMailVerify = async (req, res) => {
    const email = req.body.email;
    if (!email) {
        return res.status(400).json({
            message: "Email is required",
            success: false
        });
    }
    const userExists = await userModel.findOne({ email });
    if (userExists) {
        return res.status(409).json({
            message: "User already registered with this email",
            success: false
        });
    }
    const otp = generateOtp();
    if (!otp) {
        return res.status(500).json({
            message: "Failed to generate OTP",
            success: false
        });
    }
    try {
        const isOtpAlreadyExists = await otpSchema.findOne({ email: email });
        if (isOtpAlreadyExists) {
            if (isOtpAlreadyExists.createdAt && (new Date() - isOtpAlreadyExists.createdAt) < 5 * 60 * 1000) {
                return res.status(429).json({
                    message: "OTP already sent, please wait for 5 minutes before requesting a new one",
                    success: false
                });
            }
            else {
                isOtpAlreadyExists.otp = otp; // Update the OTP
                isOtpAlreadyExists.createdAt = new Date(); // Update the creation time
                await isOtpAlreadyExists.save();
            }
        }
        else {
            const otpentry = await otpSchema.create({
                email: email,
                otp: otp,
                purpose: 'signup'
            });
            if (!otpentry) {
                return res.status(500).json({
                    message: "Failed to create OTP entry",
                    success: false
                });
            }
            return res.status(200).json({
                message: "OTP sent successfully",
                success: true
            });
        }
    } catch (err) {
        console.error("Error in OTP generation:", err);
        return res.status(500).json({
            message: "Internal server error, please try again later",
            error: "err"
        });
    }
}
// verify otp and create user
exports.verifyOtpanduserCreation = async (req, res) => {
    try {
        const { Fname, Lname, email, otp, password, confirmPassword, accountType } = req.body;
        if (!email || !otp || !Fname || !password || !confirmPassword || !accountType) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                success: false
            });
        }
        const isuserexist = await userModel.findOne({ email });
        if (isuserexist) {
            return res.status(400).json({
                message: "Email already exists",
                success: false
            });
        }
        const otpEntry = await otpSchema.findOne({ email: email, otp: otp, purpose: 'signup' });
        if (!otpEntry) {
            return res.status(404).json({
                message: "Invalid OTP or email, otp entry not found",
                success: false
            });
        }
        if (otp !== otpEntry.otp) {
            return res.status(400).json({
                message: "Incorrect OTP, please try again",
                success: false
            });
        }
        if (email !== otpEntry.email) {
            return res.status(400).json({
                message: "Email does not match the OTP entry",
                success: false
            });
        }
        // Create user after successful OTP verification
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);

        } catch (err) {
            console.error("Error in password encryption:", err);
            return res.status(500).json({
                message: "Password encryption failure",
                error: "err"
            });
        }
        const Profile = await profile.create({
            about: null,
            contactNumber: null,
            //gender and dateOfBirth have default values in the profile schema
        });
        if (!Profile) {
            return res.status(500).json({
                message: "Profile creation failed",
                success: false
            });
        }
        const newUser = await userModel.create({
            Fname,
            Lname,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword, // Assuming you want to store the same hashed password
            accountType,
            additionalDetails: Profile._id, // Assuming you want to link the profile to the user
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${Fname}${Lname}`, // Assuming you want to set a default image or handle it later
            courses: [],
            courseProgress: []
        });
        // now delete the otp entry
        await otpSchema.deleteOne({ email: email, otp: otp, purpose: 'signup' });
        return res.status(200).json({
            data: newUser,
            success: true,
            message: 'User created successfully'
        })


    } catch (err) {
        console.error("Error in OTP verification or user creation failure :", err);
        return res.status(500).json({
            message: "Internal server error, please try again later",
            error: "err"
        });
    }
}