const axios = require('axios');

async function sync() {
    const API_URL = 'https://book-website-1.onrender.com';
    const email = 'admin@bookhaven.com';
    const password = 'admin123';

    try {
        console.log("Logging in as admin...");
        const loginRes = await axios.post(`${API_URL}/api/users/login`, { email, password });
        
        // Extract cookie
        const cookie = loginRes.headers['set-cookie'];
        console.log("Login successful. Syncing books...");

        const syncRes = await axios.post(`${API_URL}/api/settings/repopulate-books`, {}, {
            headers: { 'Cookie': cookie },
            withCredentials: true
        });

        console.log("SUCCESS:", syncRes.data.message);
    } catch (err) {
        console.error("FAILED:", err.response?.data?.message || err.message);
    }
}

sync();
