import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Send, Bot, User, Sparkles, 
  Home, HelpCircle, ChevronRight, Search, AlertCircle, 
  BookOpen, Heart, Globe, Zap 
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'messages', 'help'
  const [messages, setMessages] = useState([
    { text: "Hello! I am your **Llama 3 AI Librarian**. How can I help you discover something new today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'messages') scrollToBottom();
  }, [messages, activeTab]);

  const sendMessage = async (text) => {
    const userMessage = { text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'https://book-website-1.onrender.com'}/api/ai/chat`, { 
        message: text 
      });
      setMessages(prev => [...prev, { text: res.data.reply, sender: 'bot' }]);
    } catch (err) {
      console.error("Chat error:", err);
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "I'm having a little trouble connecting to my neural core, but our library is still wide open for you!", 
          sender: 'bot' 
        }]);
        setIsLoading(false);
      }, 1000);
      return;
    }
    setIsLoading(false);
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    const textToSend = input;
    setInput('');
    await sendMessage(textToSend);
  };

  const handleQuickLink = (label) => {
    setActiveTab('messages');
    sendMessage(label);
  };

  const menuItems = [
    { label: "Find specific book category", icon: <BookOpen size={18} color="#6366f1" /> },
    { label: "Request a new addition", icon: <Zap size={18} color="#f59e0b" /> },
    { label: "Contact our human librarian", icon: <User size={18} color="#10b981" /> },
    { label: "How to download PDFs on mobile", icon: <Globe size={18} color="#ec4899" /> }
  ];

  const TypingIndicator = () => (
    <div style={{ display: 'flex', gap: '4px', padding: '12px 16px', background: 'white', borderRadius: '15px', width: 'fit-content', border: '1px solid #f3f4f6' }}>
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.6 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
    </div>
  );

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '1rem', right: '1rem',
          background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)', 
          color: 'white', border: 'none',
          borderRadius: '50%', width: '64px', height: '64px',
          display: isOpen ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 30px rgba(99, 102, 241, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)', cursor: 'pointer', zIndex: 9999
        }}
      >
        <MessageSquare size={32} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            style={{
              position: 'fixed', bottom: '1rem', right: '1rem',
              width: 'calc(100vw - 2rem)', maxWidth: '400px',
              height: 'calc(100vh - 6rem)', maxHeight: '650px',
              background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)', 
              borderRadius: '32px',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 40px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255,255,255,0.8)',
              display: 'flex', flexDirection: 'column',
              zIndex: 10000, overflow: 'hidden',
              border: '1px solid rgba(99, 102, 241, 0.1)'
            }}
          >
            {/* Neural Background Decorator */}
            <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(219, 39, 119, 0.03) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />

            {/* --- PREMIUM HEADER SECTION --- */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              padding: '1.75rem 2rem 2.5rem', position: 'relative', color: 'var(--text-main)',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '12px', display: 'flex', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                    <BookOpen size={20} color="white" strokeWidth={2.5} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.5px', color: 'var(--text-main)' }}>AI Librarian</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.08)', padding: '4px 10px', borderRadius: '50px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>Online</span>
                   </div>
                   <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(0,0,0,0.04)', border:'none', color:'var(--text-muted)', width:'32px', height:'32px', borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(0,0,0,0.08)'} onMouseLeave={(e)=>e.currentTarget.style.background='rgba(0,0,0,0.04)'}>
                    <X size={18} />
                   </button>
                </div>
              </div>

              {activeTab === 'home' && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1 }}>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, lineHeight: 1.2, color: 'var(--text-main)' }}>
                    Greetings, {user?.name?.split(' ')[0] || 'Reader'}. <br/>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.95rem' }}>Your personal Llama 3 expert is ready.</span>
                  </h1>
                </motion.div>
              )}
              {activeTab === 'messages' && <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, position: 'relative', zIndex: 1 }}>Neural Messenger</h1>}
              {activeTab === 'help' && <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, position: 'relative', zIndex: 1 }}>Support Library</h1>}
            </div>

            {/* --- SCROLLABLE CONTENT --- */}
            <div style={{ flex: 1, margin: '-1rem 0 0', position: 'relative', zIndex: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem 1rem pb 1rem' }}>
              
              {activeTab === 'home' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="premium-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(99,102,241,0.1)' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#10b981' }}>
                      <Zap size={22} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>High-Speed AI Core</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Llama 3.3 is currently under 10ms latency.</p>
                    </div>
                  </motion.div>

                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="premium-card" style={{ background: 'rgba(255,255,255,0.9)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Quick Actions</h4>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {menuItems.map((item, i) => (
                        <div 
                          key={i} 
                          onClick={() => handleQuickLink(item.label)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: i === menuItems.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.03)', cursor: 'pointer' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {item.icon}
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{item.label}</span>
                          </div>
                          <ChevronRight size={16} color="var(--text-muted)" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem 0.5rem' }}>
                  {messages.map((msg, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', gap: '0.75rem' }}>
                      {msg.sender === 'bot' && <div style={{ background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '10px', color: 'var(--primary)', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(99,102,241,0.1)', flexShrink: 0 }}><Bot size={18} /></div>}
                      <div style={{
                        background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.9)',
                        color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                        padding: '1rem 1.25rem', borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px', maxWidth: '90%', fontSize: '0.95rem', lineHeight: 1.6, 
                        boxShadow: msg.sender === 'user' ? '0 10px 25px rgba(99, 102, 241, 0.25)' : '0 4px 15px rgba(0,0,0,0.03)',
                        border: msg.sender === 'bot' ? '1px solid rgba(255,255,255,0.8)' : 'none',
                        backdropFilter: msg.sender === 'bot' ? 'blur(10px)' : 'none'
                      }}>
                        <ReactMarkdown 
                          components={{
                            p: ({node, ...props}) => <p style={{margin: '0 0 0.5rem 0'}} {...props} />,
                            li: ({node, ...props}) => <li style={{margin: '0.25rem 0'}} {...props} />,
                            h1: ({node, ...props}) => <h1 style={{fontSize: '1.1rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--primary)'}} {...props} />,
                            h2: ({node, ...props}) => <h2 style={{fontSize: '1rem', fontWeight: 800, margin: '0.5rem 0'}} {...props} />,
                            hr: () => <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.05)', margin: '0.75rem 0' }} />
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '10px', color: 'var(--primary)', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={18} /></div>
                      <TypingIndicator />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {activeTab === 'help' && (
                <div style={{ padding: '0 0.5rem' }}>
                  <div className="premium-card" style={{ background: 'white', padding: '2rem', textAlign: 'center' }}>
                    <HelpCircle size={48} color="var(--primary)" style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                    <h3 style={{ margin: '0 0 0.5rem', color:'var(--text-main)' }}>Documentation</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      Explore our guides on how to use the dashboard, upload books, and participate in the community.
                    </p>
                    <button 
                      onClick={() => { setIsOpen(false); navigate('/docs'); }}
                      style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700, marginTop: '1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}
                    >
                      Open Library Docs
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* --- BOTTOM INPUT FOR MESSAGES --- */}
            {activeTab === 'messages' && (
              <form onSubmit={handleSend} style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '0.75rem' }}>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '0.9rem 1.25rem', borderRadius: '50px', border: '1px solid #e5e7eb', background: '#f9fafb', color: '#1f2937', outline: 'none', fontSize: '0.95rem', transition: 'border-color 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }} onFocus={(e)=>e.target.style.borderColor='#a855f7'} onBlur={(e)=>e.target.style.borderColor='#e5e7eb'} />
                <button type="submit" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)', color: 'white', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 20px rgba(219, 39, 119, 0.3)', transition: 'transform 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={(e)=>e.currentTarget.style.transform='scale(1)'}>
                  <Send size={20} style={{ marginLeft: '2px' }} />
                </button>
              </form>
            )}

            {/* --- BOTTOM NAVIGATION BAR --- */}
            <div style={{
              background: 'white', height: '80px', borderTop: '1px solid #f3f4f6',
              display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 1rem'
            }}>
              <button 
                onClick={() => setActiveTab('home')}
                style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', color: activeTab === 'home' ? 'var(--primary)' : '#9ca3af', cursor: 'pointer' }}
              >
                <Home size={24} style={{ color: activeTab === 'home' ? 'var(--primary)' : '#9ca3af' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Home</span>
              </button>
              <button 
                onClick={() => setActiveTab('messages')}
                style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', color: activeTab === 'messages' ? 'var(--primary)' : '#9ca3af', cursor: 'pointer', position: 'relative' }}
              >
                <div style={{ position: 'relative' }}>
                    <MessageSquare size={24} style={{ color: activeTab === 'messages' ? 'var(--primary)' : '#9ca3af' }} />
                    <div style={{ position: 'absolute', top: '-5px', right: '-8px', background: '#ef4444', color: 'white', width: '16px', height: '16px', borderRadius: '50%', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Messages</span>
              </button>
              <button 
                onClick={() => setActiveTab('help')}
                style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', color: activeTab === 'help' ? 'var(--primary)' : '#9ca3af', cursor: 'pointer' }}
              >
                <HelpCircle size={24} style={{ color: activeTab === 'help' ? 'var(--primary)' : '#9ca3af' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Help</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
