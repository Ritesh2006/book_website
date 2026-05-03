const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
    console.log("--- Email Diagnostic Tool ---");
    console.log("User:", process.env.EMAIL_USER);
    console.log("Pass length:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
    console.log("Pass has spaces:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.includes(' ') : false);

    const configs = [
        { name: "GmailService", service: 'gmail' },
        { name: "GmailSSL465", host: 'smtp.gmail.com', port: 465, secure: true },
        { name: "GmailTLS587", host: 'smtp.gmail.com', port: 587, secure: false }
    ];

    for (const config of configs) {
        console.log(`\nTesting: ${config.name}...`);
        try {
            const transporter = nodemailer.createTransport({
                ...config,
                debug: true,
                logger: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            await transporter.verify();
            console.log(`✅ ${config.name} connected successfully!`);
            
            console.log("Attempting to send test email...");
            const info = await transporter.sendMail({
                from: `"BookHaven Test" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_USER,
                subject: "Diagnostic Test Email",
                text: "If you are reading this, your Gmail SMTP configuration is working perfectly!",
                html: "<b>If you are reading this, your Gmail SMTP configuration is working perfectly!</b>"
            });
            console.log("✅ Test email sent! Message ID:", info.messageId);
            return; // Stop if successful
        } catch (err) {
            console.error(`❌ ${config.name} failed:`, err.message);
        }
    }

    console.log("\n--- All Gmail methods failed. Checking Ethereal fallback... ---");
    try {
        const testAccount = await nodemailer.createTestAccount();
        const etherealTransporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        await etherealTransporter.verify();
        console.log("✅ Ethereal fallback is working.");
        console.log("Preview URL for test mail:", nodemailer.getTestMessageUrl(await etherealTransporter.sendMail({
            from: "test@example.com",
            to: process.env.EMAIL_USER,
            subject: "Ethereal Fallback Test",
            text: "Gmail failed, but Ethereal is working."
        })));
    } catch (err) {
        console.error("❌ Ethereal also failed:", err.message);
    }
}

testEmail();
