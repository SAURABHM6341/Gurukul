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
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' }); // 3 hours expiration
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
        const emailBody = `
            <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
                <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">✅ Password Changed Successfully</h1>
                    <p style="color: #c6f6d5; margin: 10px 0 0 0; font-size: 16px;">Gurukul - Centralized Learning Platform</p>
                </div>
                
                <div style="background-color: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #2d3748; margin-bottom: 20px; font-size: 24px;">Your Password Has Been Updated</h2>
                    
                    <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                        Hi <strong>${user.firstName} ${user.lastName}</strong>,
                    </p>
                    
                    <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                        Your password has been successfully changed on <strong>${new Date().toLocaleDateString()}</strong> at <strong>${new Date().toLocaleTimeString()}</strong>. Your account is now secured with your new password.
                    </p>
                    
                    <div style="background-color: #f0fff4; border-left: 4px solid #48bb78; padding: 20px; margin: 30px 0; border-radius: 5px;">
                        <h3 style="color: #2f855a; margin: 0 0 15px 0; font-size: 18px;">🔐 Security Confirmation</h3>
                        <ul style="color: #2f855a; margin: 0; padding-left: 20px; font-size: 14px;">
                            <li>Password successfully updated</li>
                            <li>Account security enhanced</li>
                            <li>All active sessions remain valid</li>
                        </ul>
                    </div>
                    
                    <div style="background-color: #fef5e7; border-left: 4px solid #f6ad55; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <p style="color: #c05621; margin: 0; font-size: 14px;">
                            <strong>⚠️ Important:</strong> If you didn't make this change, please contact our support team immediately at <a href="mailto:support@gurukul.com" style="color: #c05621;">support@gurukul.com</a>
                        </p>
                    </div>
                    
                    <h3 style="color: #2d3748; font-size: 18px; margin: 30px 0 15px 0;">What's next?</h3>
                    <ol style="color: #4a5568; font-size: 16px; line-height: 1.6; padding-left: 20px;">
                        <li>Continue using Gurukul with your new password</li>
                        <li>Make sure to remember your new password securely</li>
                        <li>Consider using a password manager for better security</li>
                    </ol>
                    
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="${process.env.FRONTEND_URL}/login" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block;">
                            Login to Your Account
                        </a>
                    </div>
                    
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                        <p style="color: #718096; font-size: 14px; text-align: center; margin: 0;">
                            Best regards,<br>
                            <strong>The Gurukul Security Team</strong><br>
                            🛡️ Keeping your account safe and secure
                        </p>
                    </div>
                </div>
            </div>
        `;
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