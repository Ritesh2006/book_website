const nodemailer = require('nodemailer');
require('dotenv').config({ path: './.env' });

async function testEmail() {
  console.log('Using EMAIL_USER:', process.env.EMAIL_USER);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.verify();
    console.log('SUCCESS: Connection to Gmail is established!');
    
    const mailOptions = {
      from: `"BookHaven Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'BookHaven Email Functionality Test',
      text: 'If you are reading this, your automated email system is working correctly!'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('SUCCESS: Test email sent! Message ID:', info.messageId);
  } catch (error) {
    console.error('FAILURE: Could not send test email.');
    console.error('Error Details:', error.message);
    if (error.message.includes('535-5.7.8')) {
      console.log('\nDIAGNOSIS: This is definitely an authentication error. Please follow the App Password instructions provided earlier.');
    }
  }
}

testEmail();
