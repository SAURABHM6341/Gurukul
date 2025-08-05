const mailSender = require('../Util/mailsender');
require('dotenv').config();

exports.contactQuery = async (req, res) => {
    try {
        const { Fname, Lname, email, phonenumber, userMessage } = req.body;
        if (!Fname || !Lname || !email || !phonenumber || !userMessage) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const emailResponse1 = await mailSender(
            email,
            "Query received - GuruKul",
            `
                <h2>Hi ${Fname} ${Lname},</h2>
                <p>We have received your query and will get back to you shortly via email or phone.</p>
                <p>Thank you for choosing GuruKul!</p>
            `
        );
        const emailResponse2 = await mailSender(
            process.env.MAIL_USER,
            `Query from ${Fname} ${Lname}`,
            `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${Fname} ${Lname}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone Number:</strong> ${phonenumber}</p>
                <p><strong>Message:</strong><br/>${userMessage}</p>
            `
        );
        return res.status(200).json({
            success: true,
            message: "Query submitted successfully",
            emailResponse1,
            emailResponse2
        });

    } catch (error) {
        console.error("Error in contactQuery:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while processing your request.",
        });
    }
};
