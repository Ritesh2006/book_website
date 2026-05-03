const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;

const getTransporter = async () => {
    if (transporter) return transporter;

    const isConfigured = process.env.EMAIL_USER && 
                       process.env.EMAIL_PASS && 
                       process.env.EMAIL_PASS !== 'your_app_password_here';

    if (isConfigured) {
        try {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            await transporter.verify();
            console.log("Using Gmail transporter (Verified)");
            return transporter;
        } catch (err) {
            console.error("Gmail verification failed, falling back to Ethereal:", err.message);
            transporter = null; // Clear it so we don't return a broken one
        }
    }
    
    console.log("No valid EMAIL_USER/EMAIL_PASS provided. Creating an Ethereal test account...");
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
    
    // Use EMAIL_RECEIVER if set, otherwise EMAIL_USER, otherwise fallback admin email
    const recipient = process.env.EMAIL_RECEIVER || process.env.EMAIL_USER || 'riteshrakshit2006@gmail.com';
    
    const mailOptions = {
        from: `"BookHaven Support" <${process.env.EMAIL_USER || 'support@bookhaven.com'}>`,
        to: recipient,
        subject: `SUPPORT: ${supportData.subject}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1f2937; padding: 30px; background-color: #f3f4f6; border-radius: 15px;">
                <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #4f46e5; margin-top: 0; font-size: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px;">New Support Request</h2>
                    
                    <div style="margin-top: 25px;">
                        <p style="margin: 5px 0;"><strong>From:</strong> ${userDetails.name}</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${userDetails.email}</p>
                        <p style="margin: 5px 0;"><strong>Subject:</strong> ${supportData.subject}</p>
                    </div>

                    <div style="margin-top: 30px; background: #f9fafb; padding: 25px; border-left: 4px solid #4f46e5; border-radius: 4px;">
                        <p style="margin: 0; font-weight: 600; color: #374151; margin-bottom: 10px;">Message:</p>
                        <p style="white-space: pre-wrap; line-height: 1.6; color: #4b5563;">${supportData.message}</p>
                    </div>

                    <div style="margin-top: 30px; font-size: 12px; color: #9ca3af; text-align: center;">
                        <p>Submitted via BookHaven Support Portal at ${new Date().toLocaleString()}</p>
                    </div>
                </div>
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
