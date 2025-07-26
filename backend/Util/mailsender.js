const nodemailer = require("nodemailer");
require('dotenv').config();
const mailSender = async (email,title, body)=>{
    try{
        // firsty create a transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER, // your email address
                pass: process.env.MAIL_PASS, // your email password
            },
        });
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from:'Gurukul - Centralised Learning Platform',
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`,
        })
        console.log(info);
        return info;
    }catch(err){
        console.error("Error in sending mail:", err);
    }
}
module.exports = mailSender;
