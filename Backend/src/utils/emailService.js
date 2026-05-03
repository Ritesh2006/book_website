const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = null;
let etherealTransporter = null;

const getTransporter = async () => {
    // 1. Return cached Gmail transporter if available
    if (transporter) return transporter;

    const isConfigured = process.env.EMAIL_USER && 
                        process.env.EMAIL_PASS && 
                        process.env.EMAIL_PASS !== 'your_app_password_here';

    if (isConfigured) {
        try {
            const t = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                name: 'bookhaven.com',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                pool: true, // Use connection pooling
                maxConnections: 5,
                maxMessages: 100
            });
            await t.verify();
            transporter = t;
            console.log("✅ Gmail transporter verified.");
            return transporter;
        } catch (err) {
            console.error("❌ Gmail verification failed:", err.message);
        }
    }
    
    // 2. Return cached Ethereal if Gmail failed
    if (etherealTransporter) return etherealTransporter;

    console.log("Creating Ethereal fallback...");
    try {
        const testAccount = await nodemailer.createTestAccount();
        etherealTransporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        console.log(`✅ Ethereal fallback ready: ${testAccount.user}`);
        return etherealTransporter;
    } catch (err) {
        console.error("❌ Ethereal fallback failed:", err);
        return { sendMail: async (opts) => { console.log('Mock mail:', opts.subject); return { messageId: 'mock' }; } };
    }
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
        await t.sendMail(mailOptions);
        console.log('Welcome email sent');
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
        await t.sendMail(mailOptions);
        console.log('Login alert sent');
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
        await t.sendMail(mailOptions);
        console.log('Community post notification sent');
    } catch (err) {
        console.error('Email error:', err);
    }
};

const sendSupportRequest = async (supportData, userDetails) => {
    const t = await getTransporter();
    const recipient = process.env.EMAIL_RECEIVER || process.env.EMAIL_USER || 'riteshrakhit2006@gmail.com';
    
    const mailOptions = {
        from: `"BookHaven Support" <${process.env.EMAIL_USER || 'support@bookhaven.com'}>`,
        to: recipient,
        subject: `SUPPORT: ${supportData.subject}`,
        html: `
            <div style="font-family: sans-serif; color: #1f2937; padding: 20px; background: #f3f4f6;">
                <div style="background: white; padding: 30px; border-radius: 12px;">
                    <h2 style="color: #4f46e5;">New Support Request</h2>
                    <p><strong>From:</strong> ${userDetails.name} (${userDetails.email})</p>
                    <p><strong>Subject:</strong> ${supportData.subject}</p>
                    <div style="background: #f9fafb; padding: 20px; border-left: 4px solid #4f46e5; margin-top: 20px;">
                        ${supportData.message}
                    </div>
                </div>
            </div>
        `
    };

    try {
        const info = await t.sendMail(mailOptions);
        console.log('Support request sent');
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
