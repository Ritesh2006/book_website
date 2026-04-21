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
              width: 'calc(100vw - 2rem)', maxWidth: '420px',
              height: 'calc(100vh - 6rem)', maxHeight: '720px',
              background: '#0f172a',
              borderRadius: '35px',
              boxShadow: '0 50px 100px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
              display: 'flex', flexDirection: 'column',
              zIndex: 10000, overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {/* --- DYNAMIC MESH BACKGROUND --- */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  x: [0, 50, 0],
                  y: [0, -30, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', top: '-20%', left: '-20%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 60%)' }} 
              />
              <motion.div 
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  x: [0, -40, 0],
                  y: [0, 60, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', bottom: '-20%', right: '-20%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(219, 39, 119, 0.2) 0%, transparent 60%)' }} 
              />
            </div>

            {/* --- VIBRANT PREMIUM HEADER --- */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.9) 0%, rgba(147, 51, 234, 0.8) 50%, rgba(219, 39, 119, 0.7) 100%)',
              padding: '2rem 2rem 3rem', position: 'relative', color: 'white',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.25)', padding: '0.6rem', borderRadius: '15px', display: 'flex', backdropFilter: 'blur(10px)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                    <Sparkles size={22} color="white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <span style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.5px', display:'block' }}>Llama 3.3</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.9 }}>Neural Core Active</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border:'none', color:'white', width:'38px', height:'38px', borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter: 'blur(10px)', transition: 'all 0.3s' }} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.3)'} onMouseLeave={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
                  <X size={20} />
                </button>
              </div>

              {activeTab === 'home' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'relative', zIndex: 1 }}>
                  <h1 style={{ fontSize: '2.4rem', fontWeight: 900, margin: 0, lineHeight: 1.1, letterSpacing: '-1.5px', textShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                    Ready to <br/> Explore?
                  </h1>
                </motion.div>
              )}
              {activeTab === 'messages' && <h1 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0 }}>OmniChat System</h1>}
              {activeTab === 'help' && <h1 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0 }}>Core Knowledge</h1>}
            </div>

            {/* --- SCROLLABLE CONTENT --- */}
            <div style={{ flex: 1, margin: '-2rem 0 0', position: 'relative', zIndex: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem 1.25rem' }}>
              
              {activeTab === 'home' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                    <div style={{ background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)', padding: '1rem', borderRadius: '18px', color: 'white', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)' }}>
                      <Zap size={26} fill="currentColor" />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 900, color: 'white', fontSize: '1.1rem' }}>Llama 3.3 Turbo</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>State-of-the-art literary intelligence.</p>
                    </div>
                  </motion.div>

                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.75rem', borderRadius: '30px', display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Quick Links</h4>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {menuItems.map((item, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ x: 10, background: 'rgba(255,255,255,0.05)' }}
                          onClick={() => handleQuickLink(item.label)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div style={{ transform: 'scale(1.2)' }}>{item.icon}</div>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{item.label}</span>
                          </div>
                          <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
                  {messages.map((msg, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', gap: '1rem' }}>
                      {msg.sender === 'bot' && <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', padding: '0.6rem', borderRadius: '14px', color: 'white', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 15px rgba(99, 102, 241, 0.4)', flexShrink: 0 }}><Bot size={22} /></div>}
                      <div style={{
                        background: msg.sender === 'user' ? 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)' : 'rgba(30, 41, 59, 0.8)',
                        color: 'white',
                        padding: '1.25rem 1.5rem', borderRadius: msg.sender === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px', maxWidth: '92%', fontSize: '1rem', lineHeight: 1.6, 
                        boxShadow: msg.sender === 'user' ? '0 12px 30px rgba(219, 39, 119, 0.3)' : '0 10px 40px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(15px)'
                      }}>
                        <ReactMarkdown 
                          components={{
                            p: ({node, ...props}) => <p style={{margin: '0 0 0.75rem 0', opacity: 0.95}} {...props} />,
                            li: ({node, ...props}) => <li style={{margin: '0.4rem 0', opacity: 0.9}} {...props} />,
                            h1: ({node, ...props}) => <h1 style={{fontSize: '1.3rem', fontWeight: 900, margin: '1rem 0', color: '#818cf8'}} {...props} />,
                            h2: ({node, ...props}) => <h2 style={{fontSize: '1.15rem', fontWeight: 800, margin: '0.75rem 0', color: '#c084fc'}} {...props} />,
                            hr: () => <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1rem 0' }} />
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', padding: '0.6rem', borderRadius: '14px', color: 'white', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={22} /></div>
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
              <form onSubmit={handleSend} style={{ padding: '1rem 1.5rem', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.75rem' }}>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Send a message..." style={{ flex: 1, padding: '1.2rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none', fontSize: '1rem', transition: 'all 0.3s' }} onFocus={(e)=>{e.target.style.borderColor='#a855f7'; e.target.style.background='rgba(255,255,255,0.08)'}} onBlur={(e)=>{e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.background='rgba(255,255,255,0.05)'}} />
                <button type="submit" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)', color: 'white', border: 'none', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 25px rgba(219, 39, 119, 0.4)', transition: 'all 0.3s' }} onMouseEnter={(e)=>e.currentTarget.style.transform='scale(1.08) rotate(5deg)'} onMouseLeave={(e)=>e.currentTarget.style.transform='scale(1) rotate(0)'}>
                  <Send size={24} style={{ marginLeft: '4px' }} />
                </button>
              </form>
            )}

            {/* --- BOTTOM NAVIGATION BAR --- */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.95)', height: '90px', borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 1rem', paddingBottom: 'env(safe-area-inset-bottom)'
            }}>
              <button 
                onClick={() => setActiveTab('home')}
                style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: activeTab === 'home' ? '#818cf8' : '#64748b', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                <div style={{ padding: '8px', borderRadius: '12px', background: activeTab === 'home' ? 'rgba(99, 102, 241, 0.1)' : 'transparent' }}>
                  <Home size={26} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Home</span>
              </button>
              <button 
                onClick={() => setActiveTab('messages')}
                style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: activeTab === 'messages' ? '#c084fc' : '#64748b', cursor: 'pointer', position: 'relative', transition: 'all 0.3s' }}
              >
                <div style={{ position: 'relative', padding: '8px', borderRadius: '12px', background: activeTab === 'messages' ? 'rgba(192, 132, 252, 0.1)' : 'transparent' }}>
                    <MessageSquare size={26} />
                    <div style={{ position: 'absolute', top: '2px', right: '2px', background: '#f43f5e', color: 'white', width: '18px', height: '18px', borderRadius: '50%', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, boxShadow: '0 0 10px rgba(244, 63, 94, 0.5)' }}>1</div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>AI Bot</span>
              </button>
              <button 
                onClick={() => setActiveTab('help')}
                style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: activeTab === 'help' ? '#ec4899' : '#64748b', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                <div style={{ padding: '8px', borderRadius: '12px', background: activeTab === 'help' ? 'rgba(236, 72, 153, 0.1)' : 'transparent' }}>
                  <HelpCircle size={26} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Help</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
