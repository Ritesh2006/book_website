const DISPOSABLE_DOMAINS = [
    'yopmail.com',
    'temp-mail.org',
    'tempmail.com',
    'mailinator.com',
    '10minutemail.com',
    'guerrillamail.com',
    'sharklasers.com',
    'dispostable.com',
    'getairmail.com',
    'burnermurphy.com',
    'trashmail.com',
    'mailnesia.com',
    'maildrop.cc',
    'tempmail.net',
    'temp-mail.com',
    'temp-mail.io',
    'fakeaddressgenerator.com',
    'emailfake.com',
    'disposable.com'
];

/**
 * Checks if an email belongs to a known disposable email provider.
 * @param {string} email 
 * @returns {boolean} True if disposable, false otherwise.
 */
const isDisposableEmail = (email) => {
    if (!email || !email.includes('@')) return true;
    const domain = email.split('@')[1].toLowerCase();
    return DISPOSABLE_DOMAINS.some(d => domain.includes(d));
};

module.exports = { isDisposableEmail };
