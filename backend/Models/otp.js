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

async function sendVerificationEmail(email, otp) {
    try {
        const title = "Email verification OTP for  GURUKUL A CENTRALIZED LEARNING PLATFORM";
        const body = `OTP to verify your email On <b>Gurukul - a centralized learning platform</b> is <h1>${otp}</h1>`;

        await sendOtpEmail(email, title, body);

    } catch (err) {
        console.error("Error in OTP generation:", err);
    }
}

//pre middleware because i want to send it before entry created in db of user
otpSchema.pre('save', async function(next){
        if (!this.isModified('otp')) return next();
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model('otp', otpSchema);