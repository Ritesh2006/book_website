const disposableDomains = require('disposable-email-domains');

// Convert high-performance set for faster lookup
const DISPOSABLE_SET = new Set(disposableDomains);

/**
 * Checks if an email belongs to a known disposable email provider.
 * @param {string} email 
 * @returns {boolean} True if disposable, false otherwise.
 */
const isDisposableEmail = (email) => {
    if (!email || !email.includes('@')) return true;
    const domain = email.split('@')[1].toLowerCase();
    
    // Check direct match
    if (DISPOSABLE_SET.has(domain)) return true;
    
    // Check if any part of the domain matches (e.g. subdomains)
    return disposableDomains.some(d => domain.endsWith(`.${d}`));
};

module.exports = { isDisposableEmail };
