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
              background: 'var(--bg-card)',
              borderRadius: '32px',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.12), 0 0 0 1px var(--border)',
              display: 'flex', flexDirection: 'column',
              zIndex: 10000, overflow: 'hidden',
              backdropFilter: 'blur(30px)',
              border: '1px solid var(--border)'
            }}
          >
            {/* --- ADAPTIVE DYNAMIC BACKGROUND --- */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none', opacity: 0.5 }}>
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', top: '-10%', left: '-10%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 60%)' }} 
              />
              <motion.div 
                animate={{ 
                  scale: [1.1, 1, 1.1],
                  rotate: [0, -10, 0]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 60%)' }} 
              />
            </div>

            {/* --- VIBRANT PROFESSIONAL HEADER --- */}
            <div style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)',
              padding: '1.75rem 2rem 2.5rem', position: 'relative', color: 'white',
              boxShadow: '0 10px 30px rgba(99, 102, 241, 0.2)',
              zIndex: 1
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.6rem', borderRadius: '15px', color: 'white', backdropFilter: 'blur(10px)' }}>
                    <Bot size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>Llama Librarian</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.9 }}>AI Core Active</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border:'none', color:'white', width:'36px', height:'36px', borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseLeave={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
                  <X size={20} />
                </button>
              </div>

              {activeTab === 'home' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, lineHeight: 1.1, letterSpacing: '-1px' }}>
                    Hello {user?.name?.split(' ')[0] || 'Reader'}! <br/>
                    How can I help?
                  </h1>
                </motion.div>
              )}
              {activeTab === 'messages' && <h1 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0 }}>Knowledge AI</h1>}
              {activeTab === 'help' && <h1 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0 }}>Library Support</h1>}
            </div>

            {/* --- SCROLLABLE CONTENT --- */}
            <div style={{ flex: 1, margin: '-1rem 0 0', position: 'relative', zIndex: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem 1.25rem' }}>
              
              {activeTab === 'home' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="premium-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '16px', color: 'var(--primary)' }}>
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem' }}>Smart Assistant</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ask me anything about our collection.</p>
                    </div>
                  </motion.div>

                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} style={{ background: 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border)', backdropFilter: 'blur(10px)' }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Common Inquiries</h4>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {menuItems.map((item, i) => (
                        <div 
                          key={i} 
                          onClick={() => handleQuickLink(item.label)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: i === menuItems.length - 1 ? 'none' : '1px solid var(--border)', cursor: 'pointer' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {item.icon}
                            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{item.label}</span>
                          </div>
                          <ChevronRight size={18} color="var(--text-muted)" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
                  {messages.map((msg, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', gap: '1rem' }}>
                      {msg.sender === 'bot' && <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '12px', color: 'var(--primary)', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={22} /></div>}
                      <div style={{
                        background: msg.sender === 'user' ? 'var(--primary)' : 'white',
                        color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                        padding: '1.1rem 1.4rem', borderRadius: msg.sender === 'user' ? '22px 22px 4px 22px' : '22px 22px 22px 4px', maxWidth: '90%', fontSize: '0.95rem', lineHeight: 1.6, 
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        border: msg.sender === 'bot' ? '1px solid var(--border)' : 'none'
                      }}>
                        <ReactMarkdown 
                          components={{
                            p: ({node, ...props}) => <p style={{margin: '0 0 0.6rem 0'}} {...props} />,
                            li: ({node, ...props}) => <li style={{margin: '0.3rem 0'}} {...props} />,
                            h1: ({node, ...props}) => <h1 style={{fontSize: '1.25rem', fontWeight: 800, margin: '1rem 0', color: 'var(--primary)'}} {...props} />,
                            h2: ({node, ...props}) => <h2 style={{fontSize: '1.1rem', fontWeight: 800, margin: '0.75rem 0'}} {...props} />,
                            hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '12px', color: 'var(--primary)', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={22} /></div>
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
