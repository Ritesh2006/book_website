const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendWelcomeEmail = async (userEmail, userName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Welcome to BookHaven!',
        html: `
            <h1>Hello ${userName}!</h1>
            <p>Welcome to BookHaven, your ultimate source for free books.</p>
            <p>Enjoy reading without limits!</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (err) {
        console.error('Email error:', err);
    }
};

module.exports = { sendWelcomeEmail };
