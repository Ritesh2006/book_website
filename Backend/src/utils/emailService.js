const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = null;
let etherealTransporter = null;

const getTransporter = async () => {
    if (transporter) return transporter;

    const isConfigured = process.env.EMAIL_USER && 
                        process.env.EMAIL_PASS && 
                        process.env.EMAIL_PASS !== 'your_app_password_here';

    if (isConfigured) {
        // Switch to Port 587 as primary because Port 465 is often blocked by cloud providers like Render
        try {
            console.log("Trying Gmail Port 587 (TLS)...");
            const t = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // TLS
                name: 'bookhaven.com',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                pool: true,
                connectionTimeout: 5000,
                greetingTimeout: 5000,
                socketTimeout: 8000
            });
            await t.verify();
            transporter = t;
            console.log("✅ Gmail Port 587 ready.");
            return transporter;
        } catch (err) {
            console.error("❌ Gmail Port 587 failed, trying 465:", err.message);
            try {
                const t465 = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true, // SSL
                    name: 'bookhaven.com',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    },
                    pool: true,
                    connectionTimeout: 5000
                });
                await t465.verify();
                transporter = t465;
                console.log("✅ Gmail Port 465 ready.");
                return transporter;
            } catch (err2) {
                console.error("❌ Both Gmail ports failed.");
            }
        }
    }
    
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
        return etherealTransporter;
    } catch (err) {
        return { sendMail: async (opts) => { console.log('Mock mail:', opts.subject); return { messageId: 'mock' }; } };
    }
};

const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const t = await getTransporter();
        await t.sendMail({
            from: `"BookHaven" <${process.env.EMAIL_USER || 'noreply@bookhaven.com'}>`,
            to: userEmail,
            subject: 'Welcome to BookHaven!',
            html: `<h1>Hello ${userName}!</h1><p>Welcome to BookHaven!</p>`
        });
    } catch (err) { console.error('Email error:', err); }
};

const sendLoginAlert = async (userEmail, userName) => {
    try {
        const t = await getTransporter();
        await t.sendMail({
            from: `"BookHaven" <${process.env.EMAIL_USER || 'noreply@bookhaven.com'}>`,
            to: userEmail,
            subject: 'New Login Alert',
            html: `<p>New login detected for ${userName}</p>`
        });
    } catch (err) { console.error('Email error:', err); }
};

const sendCommunityPostNotification = async (userEmail, userName, postTitle) => {
    try {
        const t = await getTransporter();
        await t.sendMail({
            from: `"BookHaven" <${process.env.EMAIL_USER || 'noreply@bookhaven.com'}>`,
            to: userEmail,
            subject: 'New Community Post',
            html: `<p>New post: ${postTitle}</p>`
        });
    } catch (err) { console.error('Email error:', err); }
};

const sendSupportRequest = async (supportData, userDetails) => {
    const t = await getTransporter();
    const recipient = process.env.EMAIL_RECEIVER || process.env.EMAIL_USER || 'riteshrakhit2006@gmail.com';
    
    return await t.sendMail({
        from: `"BookHaven Support" <${process.env.EMAIL_USER || 'support@bookhaven.com'}>`,
        to: recipient,
        subject: `SUPPORT: ${supportData.subject}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2>New Support Request</h2>
                <p><strong>From:</strong> ${userDetails.name} (${userDetails.email})</p>
                <p><strong>Message:</strong> ${supportData.message}</p>
            </div>
        `
    });
};

module.exports = { 
    sendWelcomeEmail, 
    sendLoginAlert, 
    sendCommunityPostNotification,
    sendSupportRequest
};
