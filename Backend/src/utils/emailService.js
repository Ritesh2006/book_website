const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;

const getTransporter = async () => {
    if (transporter) return transporter;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        console.log("Using Gmail transporter");
    } else {
        console.log("No EMAIL_USER/EMAIL_PASS provided. Creating an Ethereal test account...");
        try {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            console.log(`Ethereal test account created: ${testAccount.user}`);
            console.log(`Log into https://ethereal.email/login to view emails, or check terminal for preview URLs.`);
        } catch (err) {
            console.error("Failed to create Ethereal account:", err);
            // Fallback mock
            transporter = { sendMail: async (opts) => { console.log('Mock mail sent:', opts.subject); return { messageId: 'mock' }; } };
        }
    }
    return transporter;
};

const sendWelcomeEmail = async (userEmail, userName) => {
    const t = await getTransporter();
    const mailOptions = {
        from: `"BookHaven" <${process.env.EMAIL_USER || 'noreply@bookhaven.com'}>`,
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
        const info = await t.sendMail(mailOptions);
        console.log('Welcome email sent successfully');
        if (nodemailer.getTestMessageUrl(info)) {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    } catch (err) {
        console.error('Email error:', err);
    }
};

const sendLoginAlert = async (userEmail, userName) => {
    const t = await getTransporter();
    const mailOptions = {
        from: `"BookHaven" <${process.env.EMAIL_USER || 'noreply@bookhaven.com'}>`,
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
        const info = await t.sendMail(mailOptions);
        console.log('Login alert sent');
        if (nodemailer.getTestMessageUrl(info)) {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    } catch (err) {
        console.error('Email error:', err);
    }
};

const sendCommunityPostNotification = async (userEmail, userName, postTitle) => {
    const t = await getTransporter();
    const mailOptions = {
        from: `"BookHaven" <${process.env.EMAIL_USER || 'noreply@bookhaven.com'}>`,
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
        const info = await t.sendMail(mailOptions);
        console.log('Community post notification sent');
        if (nodemailer.getTestMessageUrl(info)) {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    } catch (err) {
        console.error('Email error:', err);
    }
};

const sendSupportRequest = async (supportData, userDetails) => {
    const t = await getTransporter();
    const mailOptions = {
        from: `"BookHaven Support" <${process.env.EMAIL_USER || 'support@bookhaven.com'}>`,
        to: process.env.EMAIL_USER || 'admin@bookhaven.com',
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

    try {
        const info = await t.sendMail(mailOptions);
        console.log('Support request sent');
        if (nodemailer.getTestMessageUrl(info)) {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
        return info;
    } catch (err) {
        console.error('Email error:', err);
        throw err;
    }
};

module.exports = { 
    sendWelcomeEmail, 
    sendLoginAlert, 
    sendCommunityPostNotification,
    sendSupportRequest
};
