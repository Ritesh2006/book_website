import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Key, Loader2, AlertCircle, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        if (res.role === 'admin') navigate('/admin');
        else navigate('/');
      } else {
        setError(res.message);
        setIsSubmitting(false);
      }
    } else {
      const res = await register(name, email, password);
      if (res.success) {
        setIsLogin(true);
        setIsSubmitting(false);
        setError('');
        alert('Account created! Please sign in.');
      } else {
        setError(res.message);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'var(--bg-main)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* --- CINEMATIC ANIMATED BACKGROUND --- */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <div style={{
            position: 'absolute', top: '10%', left: '15%', width: '40vw', height: '40vw',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
            animation: 'pulse-glow 15s infinite alternate'
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', right: '15%', width: '35vw', height: '35vw',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
            animation: 'pulse-glow 12s infinite alternate-reverse'
          }} />
          {/* Floating Neural Orbs */}
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 80}%`,
              width: '4px', height: '4px',
              background: 'var(--primary)',
              borderRadius: '50%',
              boxShadow: '0 0 20px var(--primary)',
              animation: `float ${10 + i * 2}s infinite ease-in-out`
            }} />
          ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-effect"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '3.5rem 3rem',
          borderRadius: '40px',
          boxShadow: '0 40px 100px -20px rgba(0,0,0,0.2)',
          textAlign: 'center',
          border: '1px solid var(--border)',
          background: 'var(--glass)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{ 
          background: 'var(--primary)', 
          width: '64px', 
          height: '64px', 
          borderRadius: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 2rem',
          color: 'white',
          transform: 'rotate(-10deg)',
          boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.4)'
        }}>
          <Lock size={32} />
        </div>
        
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-1px' }}>
          {isLogin ? 'Welcome Back' : 'Join BookHaven'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontWeight: 500 }}>
          {isLogin ? 'Continue your literary journey' : 'Start your journey of thousands of books'}
        </p>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '16px', marginBottom: '2rem', color: '#ef4444' }}
          >
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div 
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ position: 'relative' }}
              >
                <User size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.1rem 1.1rem 3.5rem',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '1rem',
                    fontWeight: 500
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ position: 'relative' }}>
            <Mail size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '1.1rem 1.1rem 1.1rem 3.5rem',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                outline: 'none',
                fontSize: '1rem',
                fontWeight: 500
              }}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Key size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              placeholder="Secure Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '1.1rem 1.1rem 1.1rem 3.5rem',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                outline: 'none',
                fontSize: '1rem',
                fontWeight: 500
              }}
            />
          </div>
          
          {isLogin && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <a href="#" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>Forgot Password?</a>
            </div>
          )}
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '1.1rem',
              borderRadius: '16px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 800,
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.4)'
            }}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
            {!isSubmitting && <ArrowRight size={20} />}
          </motion.button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <span style={{ padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        <div style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center',
          padding: '0.5rem', // Refined padding around the official button
          backgroundColor: 'var(--bg-main)',
          borderRadius: '16px',
          border: '1px solid var(--border)'
        }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              setIsSubmitting(true);
              const res = await googleLogin(credentialResponse.credential);
              if (res.success) navigate('/');
              else setError(res.message);
              setIsSubmitting(false);
            }}
            onError={() => {
              setError("Google verification failed");
            }}
            useOneTap
            theme={localStorage.getItem('theme') === 'dark' ? 'filled_black' : 'outline'}
            shape="pill"
            width="100%"
          />
        </div>

        <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', marginLeft: '0.5rem' }}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
