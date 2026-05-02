const { sendWelcomeEmail, sendSupportRequest } = require('./src/utils/emailService');

async function testEmail() {
  console.log('Testing Email Service Initialization...');
  console.log('----------------------------------------');
  
  try {
    console.log('1. Testing Welcome Email...');
    await sendWelcomeEmail('testuser@example.com', 'Test User');
    console.log('----------------------------------------');

    console.log('2. Testing Support Request...');
    await sendSupportRequest(
        { subject: 'Help with my account', message: 'I cannot login to the dashboard.' },
        { name: 'Alice', email: 'alice@example.com' }
    );
    console.log('----------------------------------------');
    console.log('TEST COMPLETE: If you see a Preview URL above, click it to view the email in your browser!');
  } catch (err) {
    console.error('Test Failed:', err);
  }
}

testEmail();
