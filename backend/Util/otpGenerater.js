const otpGenerator = require('otp-generator');

const otpgene = () => {
    try {
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true
        });
        return otp;
    } catch (err) {
        console.error("Error in OTP generation:", err);
        return null;
    }
}
module.exports = otpgene;