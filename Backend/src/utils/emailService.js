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
        from: `"BookHaven" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'Welcome to BookHaven!',
        html: `
            <div style="font-family: sans-serif; color: #333;">
                <h1>Hello ${userName}!</h1>
                <p>Welcome to <strong>BookHaven</strong>, your ultimate source for books.</p>
                <p>We are glad to have you in our community!</p>
                <hr />
                <p>Happy Reading!</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully');
    } catch (err) {
        console.error('Email error:', err);
    }
};

const sendLoginAlert = async (userEmail, userName) => {
    const mailOptions = {
        from: `"BookHaven" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'New Login to your BookHaven account',
        html: `
            <div style="font-family: sans-serif; color: #333;">
                <h3>Hello ${userName},</h3>
                <p>A new login was detected for your account at <strong>${new Date().toLocaleString()}</strong>.</p>
                <p>If this was not you, please secure your account immediately.</p>
                <br />
                <p>Team BookHaven</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Login alert sent');
    } catch (err) {
        console.error('Email error:', err);
    }
};

const sendCommunityPostNotification = async (userEmail, userName, postTitle) => {
    const mailOptions = {
        from: `"BookHaven" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'New Post in BookHaven Community',
        html: `
            <div style="font-family: sans-serif; color: #333;">
                <h3>New Post Alert!</h3>
                <p>Hi ${userName},</p>
                <p>A new post was just created in the community: <strong>"${postTitle}"</strong></p>
                <p>Check it out now and join the conversation!</p>
                <br />
                <p>Team BookHaven</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Community post notification sent');
    } catch (err) {
        console.error('Email error:', err);
    }
};

const sendSupportRequest = async (supportData, userDetails) => {
    const mailOptions = {
        from: `"BookHaven Support" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `SUPPORT: ${supportData.subject}`,
        html: `
            <div style="font-family: sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; borderRadius: 10px;">
                <h2 style="color: #6366f1;">New Support Request</h2>
                <p><strong>From:</strong> ${userDetails.name} (${userDetails.email})</p>
                <p><strong>Subject:</strong> ${supportData.subject}</p>
                <hr />
                <p><strong>Message:</strong></p>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
                    ${supportData.message}
                </div>
                <br />
                <small>Submitted at: ${new Date().toLocaleString()}</small>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { 
    sendWelcomeEmail, 
    sendLoginAlert, 
    sendCommunityPostNotification,
    sendSupportRequest
};
