"use strict";
const nodemailer = require('nodemailer');
require('dotenv').config();
let transporter = null;
const getTransporter = async () => {
    if (transporter)
        return transporter;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    console.log(`[EmailService] Initializing for user: ${user}`);
    if (user && pass && pass !== 'your_app_password_here') {
        try {
            // Use Port 587 (TLS) - industry standard for cloud environments
            const t = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // TLS
                auth: { user, pass },
                name: 'bookhaven.com',
                pool: true,
                connectionTimeout: 10000,
                greetingTimeout: 10000,
                socketTimeout: 15000,
                debug: true,
                logger: true // This will print full SMTP logs to Render console
            });
            await t.verify();
            transporter = t;
            console.log("✅ [EmailService] Gmail Port 587 connected and verified.");
            return transporter;
        }
        catch (err) {
            console.error("❌ [EmailService] Gmail Port 587 failed:", err.message);
            try {
                console.log("Trying Port 465 (SSL) as backup...");
                const t465 = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true, // SSL
                    auth: { user, pass },
                    name: 'bookhaven.com',
                    connectionTimeout: 10000
                });
                await t465.verify();
                transporter = t465;
                console.log("✅ [EmailService] Gmail Port 465 connected and verified.");
                return transporter;
            }
            catch (err2) {
                console.error("❌ [EmailService] All Gmail ports failed. Error:", err2.message);
            }
        }
    }
    console.log("⚠️ [EmailService] Falling back to Ethereal. Check your Render Environment Variables!");
    try {
        const testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: { user: testAccount.user, pass: testAccount.pass }
        });
    }
    catch (err) {
        return { sendMail: async (opts) => { console.log('Mock mail:', opts.subject); return { messageId: 'mock' }; } };
    }
};
const sendSupportRequest = async (supportData, userDetails) => {
    const t = await getTransporter();
    const sender = process.env.EMAIL_USER;
    const recipient = process.env.EMAIL_RECEIVER || sender || 'riteshrakhit2006@gmail.com';
    console.log(`[EmailService] Sending support mail from ${sender} to ${recipient}`);
    return await t.sendMail({
        from: `"BookHaven Support" <${sender}>`, // Must match EMAIL_USER for Gmail
        to: recipient,
        subject: `SUPPORT: ${supportData.subject}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4f46e5;">New Support Request</h2>
                <p><strong>Name:</strong> ${userDetails.name}</p>
                <p><strong>Email:</strong> ${userDetails.email}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="white-space: pre-wrap;">${supportData.message}</p>
            </div>
        `
    });
};
module.exports = { sendSupportRequest };
