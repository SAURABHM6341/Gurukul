const mongoose = require('mongoose');
const sendOtpEmail = require('../Util/mailsender');
const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // OTP expires in 5 minutes
    },
    purpose: {
        type: String,
        enum: ['signup', 'password-reset','two-factor-authentication', 'change-email', 'change-password'],
        required: true
    }
});
// a function to send email
async function sendVerificationEmail(email, otp, purpose) {
    try {
        let title, body;
        
        if (purpose === 'signup') {
            title = "Email Verification OTP - Gurukul";
            body = `
                <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Welcome to Gurukul!</h1>
                        <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Centralized Learning Platform</p>
                    </div>
                    
                    <div style="background-color: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #2d3748; margin-bottom: 20px; font-size: 24px;">Verify Your Email Address</h2>
                        
                        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Thank you for joining Gurukul! To complete your registration and secure your account, please verify your email address using the OTP below:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #4299e1 0%, #667eea 100%); padding: 25px; border-radius: 10px; text-align: center; margin: 30px 0;">
                            <p style="color: white; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                            <h1 style="color: white; font-size: 36px; font-weight: 700; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
                        </div>
                        
                        <div style="background-color: #fef5e7; border-left: 4px solid #f6ad55; padding: 15px; margin: 20px 0; border-radius: 5px;">
                            <p style="color: #c05621; margin: 0; font-size: 14px;">
                                <strong>⏰ Important:</strong> This OTP will expire in 5 minutes for security purposes.
                            </p>
                        </div>
                        
                        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
                            If you didn't create an account with Gurukul, please ignore this email or contact our support team.
                        </p>
                        
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #718096; font-size: 14px; text-align: center; margin: 0;">
                                Best regards,<br>
                                <strong>The Gurukul Team</strong><br>
                                🚀 Empowering learners worldwide
                            </p>
                        </div>
                    </div>
                </div>
            `;
        } else if (purpose === 'password-reset') {
            title = "Password Reset OTP - Gurukul";
            body = `
                <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
                    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🔐 Password Reset</h1>
                        <p style="color: #fbb6ce; margin: 10px 0 0 0; font-size: 16px;">Gurukul - Centralized Learning Platform</p>
                    </div>
                    
                    <div style="background-color: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #2d3748; margin-bottom: 20px; font-size: 24px;">Reset Your Password</h2>
                        
                        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            We received a request to reset your password for your Gurukul account. Use the OTP below to proceed with resetting your password:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 10px; text-align: center; margin: 30px 0;">
                            <p style="color: white; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Password Reset Code</p>
                            <h1 style="color: white; font-size: 36px; font-weight: 700; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
                        </div>
                        
                        <div style="background-color: #fed7d7; border-left: 4px solid #f56565; padding: 15px; margin: 20px 0; border-radius: 5px;">
                            <p style="color: #c53030; margin: 0; font-size: 14px;">
                                <strong>🔒 Security Notice:</strong> This OTP expires in 5 minutes. If you didn't request this reset, please secure your account immediately.
                            </p>
                        </div>
                        
                        <h3 style="color: #2d3748; font-size: 18px; margin: 30px 0 15px 0;">What's next?</h3>
                        <ol style="color: #4a5568; font-size: 16px; line-height: 1.6; padding-left: 20px;">
                            <li>Enter this OTP on the password reset page</li>
                            <li>Create a strong new password</li>
                            <li>Log in with your new credentials</li>
                        </ol>
                        
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #718096; font-size: 14px; text-align: center; margin: 0;">
                                Best regards,<br>
                                <strong>The Gurukul Security Team</strong><br>
                                🛡️ Keeping your account safe
                            </p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Default template for other purposes
            title = "Verification OTP - Gurukul";
            body = `
                <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
                    <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Verification Required</h1>
                        <p style="color: #bee3f8; margin: 10px 0 0 0; font-size: 16px;">Gurukul - Centralized Learning Platform</p>
                    </div>
                    
                    <div style="background-color: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #2d3748; margin-bottom: 20px; font-size: 24px;">Verification Code</h2>
                        
                        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Please use the following OTP to complete your verification process:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 25px; border-radius: 10px; text-align: center; margin: 30px 0;">
                            <p style="color: white; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
                            <h1 style="color: white; font-size: 36px; font-weight: 700; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
                        </div>
                        
                        <div style="background-color: #e6fffa; border-left: 4px solid #38b2ac; padding: 15px; margin: 20px 0; border-radius: 5px;">
                            <p style="color: #234e52; margin: 0; font-size: 14px;">
                                <strong>⏰ Reminder:</strong> This OTP is valid for 5 minutes only.
                            </p>
                        </div>
                        
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #718096; font-size: 14px; text-align: center; margin: 0;">
                                Best regards,<br>
                                <strong>The Gurukul Team</strong>
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }

        await sendOtpEmail(email, title, body);

    } catch (err) {
        console.error("Error in sending OTP email:", err);
    }
}

//pre middleware because i want to send it before entry created in db of user
otpSchema.pre('save', async function(next){
    if (!this.isModified('otp')) return next();
    await sendVerificationEmail(this.email, this.otp, this.purpose);
    next();
})

module.exports = mongoose.model('otp', otpSchema);