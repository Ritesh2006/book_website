const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env' });

async function testEmail() {
    console.log("Testing email configuration...");
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Not Set");
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not Set");

    const isPlaceholder = process.env.EMAIL_PASS === 'your_app_password_here';
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || isPlaceholder) {
        if (isPlaceholder) console.log("Detected placeholder password ('your_app_password_here').");
        console.log("Using Ethereal (Test Account)...");
        try {
            const testAccount = await nodemailer.createTestAccount();
            const transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            const info = await transporter.sendMail({
                from: '"Test" <test@example.com>',
                to: "test@example.com",
                subject: "Test Email",
                text: "Success!"
            });
            console.log("Test email sent to Ethereal. Preview URL:", nodemailer.getTestMessageUrl(info));
        } catch (e) {
            console.error("Ethereal test failed:", e.message);
        }
    } else {
        console.log("Using Gmail (or custom) configuration...");
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            await transporter.verify();
            console.log("Connection successful! Your credentials are valid.");
        } catch (e) {
            console.error("Connection failed! Check your EMAIL_USER/EMAIL_PASS and ensure 'App Passwords' are used for Gmail.");
            console.error("Error details:", e.message);
        }
    }
}

testEmail();
