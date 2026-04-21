const { isDisposableEmail } = require('./Backend/src/utils/securityUtils');

const emailsToTest = [
    'test@gmail.com',
    'user@yahoo.com',
    'attacker@yopmail.com',
    'random@temp-mail.org',
    'someone@mailinator.com',
    'test@guerrillamail.com'
];

emailsToTest.forEach(email => {
    const isDisposable = isDisposableEmail(email);
    console.log(`${email} -> ${isDisposable ? 'BLOCKED' : 'ALLOWED'}`);
});
