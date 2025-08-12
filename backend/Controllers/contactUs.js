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
            "Message Received - Thank You for Contacting Gurukul",
            `
                <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
                    <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">✅ Message Received!</h1>
                        <p style="color: #c6f6d5; margin: 10px 0 0 0; font-size: 16px;">Gurukul - Centralized Learning Platform</p>
                    </div>
                    
                    <div style="background-color: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #2d3748; margin-bottom: 20px; font-size: 24px;">Thank You for Contacting Us!</h2>
                        
                        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Hi <strong>${Fname} ${Lname}</strong>,
                        </p>
                        
                        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Thank you for reaching out to us! We've successfully received your message and our team will review it shortly.
                        </p>
                        
                        <div style="background-color: #f7fafc; border-radius: 10px; padding: 25px; margin: 30px 0;">
                            <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">📝 Your Message Summary</h3>
                            <div style="background-color: white; border-left: 4px solid #48bb78; padding: 15px; border-radius: 5px;">
                                <p style="color: #2d3748; margin: 0; font-size: 14px; line-height: 1.6;">"${userMessage}"</p>
                            </div>
                            <p style="color: #4a5568; margin: 15px 0 0 0; font-size: 12px;">
                                <strong>Submitted on:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
                            </p>
                        </div>
                        
                        <div style="background-color: #e6fffa; border-left: 4px solid #38b2ac; padding: 20px; margin: 30px 0; border-radius: 5px;">
                            <h3 style="color: #234e52; margin: 0 0 15px 0; font-size: 18px;">⏱️ What happens next?</h3>
                            <ul style="color: #234e52; margin: 0; padding-left: 20px; font-size: 14px;">
                                <li>Our support team will review your message within 24 hours</li>
                                <li>We'll respond to your email: <strong>${email}</strong></li>
                                <li>Or call you at: <strong>${phonenumber}</strong></li>
                                <li>For urgent matters, you can also reach us directly</li>
                            </ul>
                        </div>
                        
                        <h3 style="color: #2d3748; font-size: 18px; margin: 30px 0 15px 0;">🚀 Meanwhile, explore Gurukul!</h3>
                        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            While you wait for our response, feel free to explore our courses and learning resources:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/courses" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; margin-right: 15px;">
                                Browse Courses
                            </a>
                            <a href="${process.env.FRONTEND_URL}/about" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block;">
                                Learn About Us
                            </a>
                        </div>
                        
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #718096; font-size: 14px; text-align: center; margin: 0;">
                                Thank you for choosing Gurukul!<br>
                                <strong>The Gurukul Support Team</strong><br>
                                🎓 Always here to help you learn
                            </p>
                        </div>
                    </div>
                </div>
            `
        );
        const emailResponse2 = await mailSender(
            process.env.MAIL_USER,
            `New Contact Form Submission from ${Fname} ${Lname}`,
            `
                <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">📬 New Contact Form Submission</h1>
                        <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Gurukul Admin Dashboard</p>
                    </div>
                    
                    <div style="background-color: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #2d3748; margin-bottom: 30px; font-size: 24px;">Contact Form Details</h2>
                        
                        <div style="background-color: #f7fafc; border-radius: 10px; padding: 25px; margin-bottom: 30px;">
                            <div style="margin-bottom: 20px;">
                                <h3 style="color: #4a5568; margin: 0 0 5px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">👤 Contact Information</h3>
                                <p style="color: #2d3748; margin: 0; font-size: 16px; font-weight: 600;">${Fname} ${Lname}</p>
                                <p style="color: #4a5568; margin: 5px 0 0 0; font-size: 14px;">📧 ${email}</p>
                                <p style="color: #4a5568; margin: 5px 0 0 0; font-size: 14px;">📱 ${phonenumber}</p>
                            </div>
                            
                            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
                                <h3 style="color: #4a5568; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">💬 Message</h3>
                                <div style="background-color: white; border-left: 4px solid #667eea; padding: 15px; border-radius: 5px;">
                                    <p style="color: #2d3748; margin: 0; font-size: 16px; line-height: 1.6;">${userMessage}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background-color: #e6fffa; border-left: 4px solid #38b2ac; padding: 15px; margin: 20px 0; border-radius: 5px;">
                            <p style="color: #234e52; margin: 0; font-size: 14px;">
                                <strong>⏰ Submitted:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="mailto:${email}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; margin-right: 15px;">
                                Reply to ${Fname}
                            </a>
                            <a href="tel:${phonenumber}" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block;">
                                Call ${Fname}
                            </a>
                        </div>
                        
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #718096; font-size: 14px; text-align: center; margin: 0;">
                                <strong>Gurukul Admin Notification</strong><br>
                                Please respond to this inquiry within 24 hours
                            </p>
                        </div>
                    </div>
                </div>
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
