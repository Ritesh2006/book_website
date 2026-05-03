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
                pool: true,
                maxConnections: 5,
                maxMessages: 100,
                connectionTimeout: 5000, // 5 seconds to connect
                greetingTimeout: 5000,   // 5 seconds to greet
                socketTimeout: 10000     // 10 seconds total socket time
            });
            
            // Non-blocking verification (don't await it if we already have a transporter)
            // But for the first time, we verify to ensure it works
            await Promise.race([
                t.verify(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Gmail connection timeout')), 8000))
            ]);
            
            transporter = t;
            console.log("✅ Gmail transporter ready.");
            return transporter;
        } catch (err) {
            console.error("❌ Gmail connection failed:", err.message);
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
