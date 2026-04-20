import React, { useState } from 'react';
import axios from 'axios';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const SubscriptionBox = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    try {
      const res = await axios.post('http://localhost:5000/api/users/subscribe', { email, name });
      setStatus('success');
      setMessage(res.data.message);
      setEmail('');
      setName('');
      
      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{
      margin: '4rem auto 0',
      maxWidth: '800px',
      padding: '3rem',
      background: 'linear-gradient(135deg, var(--primary) 0%, #3730a3 100%)',
      borderRadius: '24px',
      color: 'white',
      textAlign: 'center',
      boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.4)'
    }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Join the BookHaven Community</h2>
      <p style={{ color: '#e0e7ff', marginBottom: '2rem', fontSize: '1.1rem' }}>
        Subscribe to get exclusive updates, reading recommendations, and your welcome email!
      </p>

      {status === 'success' ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px' }}>
          <CheckCircle color="#34d399" size={24} />
          <span style={{ fontWeight: 600 }}>{message}</span>
        </div>
      ) : status === 'error' ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
          <AlertCircle color="#fca5a5" size={24} />
          <span style={{ fontWeight: 600 }}>{message}</span>
        </div>
      ) : null}

      {status !== 'success' && (
        <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: window.innerWidth > 640 ? 'row' : 'column', gap: '1rem', justifyContent: 'center' }}>
          <input 
            type="text" 
            placeholder="Your Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '1rem 1.5rem', borderRadius: '12px', border: 'none', outline: 'none', fontSize: '1rem', flex: 1, maxWidth: '250px' }}
          />
          <input 
            type="email" 
            required 
            placeholder="Your Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '1rem 1.5rem', borderRadius: '12px', border: 'none', outline: 'none', fontSize: '1rem', flex: 2 }}
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            style={{ 
              padding: '1rem 2rem', 
              borderRadius: '12px', 
              border: 'none', 
              background: '#1e1b4b', 
              color: 'white', 
              fontWeight: 700, 
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer'
            }}
          >
            {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : <><Mail size={20} /> Subscribe</>}
          </button>
        </form>
      )}
    </div>
  );
};

export default SubscriptionBox;
