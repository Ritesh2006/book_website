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
              height: 'calc(100vh - 6rem)', maxHeight: '750px',
              background: 'rgba(10, 15, 30, 0.95)',
              borderRadius: '40px',
              boxShadow: '0 50px 100px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.08)',
              display: 'flex', flexDirection: 'column',
              zIndex: 10000, overflow: 'hidden',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            {/* --- VIBRANT TOP ACCENT --- */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)', zIndex: 10, boxShadow: '0 2px 15px rgba(168, 85, 247, 0.4)' }} />

            {/* --- LUXE NEURAL MESH --- */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
              <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1],
                  x: [0, 30, 0],
                  y: [0, -20, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: 'absolute', top: '-10%', left: '-10%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 60%)' }} 
              />
              <motion.div 
                animate={{ 
                  scale: [1.3, 1, 1.3],
                  x: [0, -30, 0],
                  y: [0, 40, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 60%)' }} 
              />
            </div>

            {/* --- HIGH-END VIBRANT HEADER --- */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.8) 100%)',
              padding: '2.25rem 2.5rem 3rem', position: 'relative', color: 'white',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
            }}>
              {/* Shine effect */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)', pointerEvents: 'none' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '18px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
                    <Sparkles size={24} color="white" />
                  </div>
                  <div>
                    <span style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.8px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>Llama Agent</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>Neural Link Active</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.12)', border:'none', color:'white', width:'40px', height:'40px', borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter: 'blur(10px)', transition: 'all 0.3s' }} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.25)'} onMouseLeave={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.12)'}>
                  <X size={22} />
                </button>
              </div>

              {activeTab === 'home' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1 }}>
                  <h1 style={{ fontSize: '2.4rem', fontWeight: 900, margin: 0, lineHeight: 1.05, letterSpacing: '-2px', textShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                    How can I assist <br/> you today?
                  </h1>
                </motion.div>
              )}
              {activeTab === 'messages' && <h1 style={{ fontSize: '1.65rem', fontWeight: 900, margin: 0, position: 'relative', zIndex: 1 }}>Neural Messenger</h1>}
              {activeTab === 'help' && <h1 style={{ fontSize: '1.65rem', fontWeight: 900, margin: 0, position: 'relative', zIndex: 1 }}>Core Library</h1>}
            </div>

            {/* --- LUXE CONTENT AREA --- */}
            <div style={{ flex: 1, margin: '-2rem 0 0', position: 'relative', zIndex: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem 1.25rem' }}>
              
              {activeTab === 'home' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ padding: '1.5rem', borderRadius: '28px', display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                    <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', padding: '1.1rem', borderRadius: '20px', color: 'white', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)' }}>
                      <Zap size={28} fill="currentColor" />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 950, color: 'white', fontSize: '1.15rem', letterSpacing: '-0.5px' }}>Llama 3.3 Intelligence</p>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>High-fidelity literary knowledge processing.</p>
                    </div>
                  </motion.div>

                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.75rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.75rem' }}>Precision Tools</h4>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {menuItems.map((item, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ x: 10, background: 'rgba(255,255,255,0.05)' }}
                          onClick={() => handleQuickLink(item.label)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div style={{ transform: 'scale(1.25)', color: '#818cf8' }}>{item.icon}</div>
                            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{item.label}</span>
                          </div>
                          <ChevronRight size={20} color="rgba(255,255,255,0.2)" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '1rem 0' }}>
                  {messages.map((msg, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', gap: '1.1rem' }}>
                      {msg.sender === 'bot' && <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem', borderRadius: '14px', color: '#818cf8', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}><Bot size={24} /></div>}
                      <div style={{
                        background: msg.sender === 'user' ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'rgba(255, 255, 255, 0.05)',
                        color: 'white',
                        padding: '1.25rem 1.75rem', borderRadius: msg.sender === 'user' ? '28px 28px 4px 28px' : '28px 28px 28px 4px', maxWidth: '92%', fontSize: '1.05rem', lineHeight: 1.6, 
                        boxShadow: msg.sender === 'user' ? '0 15px 40px rgba(79, 70, 229, 0.3)' : '0 10px 40px rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(20px)'
                      }}>
                        <ReactMarkdown 
                          components={{
                            p: ({node, ...props}) => <p style={{margin: '0 0 0.8rem 0', opacity: 0.95}} {...props} />,
                            li: ({node, ...props}) => <li style={{margin: '0.5rem 0', opacity: 0.9}} {...props} />,
                            h1: ({node, ...props}) => <h1 style={{fontSize: '1.4rem', fontWeight: 950, margin: '1rem 0', color: '#818cf8', letterSpacing: '-0.5px'}} {...props} />,
                            h2: ({node, ...props}) => <h2 style={{fontSize: '1.2rem', fontWeight: 900, margin: '0.75rem 0', color: '#a78bfa'}} {...props} />,
                            hr: () => <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1.25rem 0' }} />
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div style={{ display: 'flex', gap: '1.1rem', alignItems: 'center' }}>
                      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem', borderRadius: '14px', color: '#818cf8', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={24} /></div>
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

            {/* --- LUXE BOTTOM INPUT --- */}
            {activeTab === 'messages' && (
              <form onSubmit={handleSend} style={{ padding: '1.25rem 1.75rem', background: 'rgba(10, 15, 30, 0.8)', backdropFilter: 'blur(30px)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem' }}>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '1.1rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'white', outline: 'none', fontSize: '1rem', transition: 'all 0.3s' }} onFocus={(e)=>{e.target.style.borderColor='#818cf8'; e.target.style.background='rgba(255,255,255,0.05)'}} onBlur={(e)=>{e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.background='rgba(255,255,255,0.03)'}} />
                <button type="submit" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '50%', width: '58px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 30px rgba(79, 70, 229, 0.4)', transition: 'all 0.3s' }} onMouseEnter={(e)=>e.currentTarget.style.transform='scale(1.1) rotate(5deg)'} onMouseLeave={(e)=>e.currentTarget.style.transform='scale(1) rotate(0)'}>
                  <Send size={26} style={{ marginLeft: '4px' }} />
                </button>
              </form>
            )}

            {/* --- LUXE BOTTOM NAVIGATION --- */}
            <div style={{
              background: 'rgba(10, 15, 30, 0.98)', height: '95px', borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 1.5rem', paddingBottom: 'env(safe-area-inset-bottom)'
            }}>
              <button 
                onClick={() => setActiveTab('home')}
                style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', color: activeTab === 'home' ? '#818cf8' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                <div style={{ padding: '10px', borderRadius: '14px', background: activeTab === 'home' ? 'rgba(129, 140, 248, 0.1)' : 'transparent', boxShadow: activeTab === 'home' ? '0 0 15px rgba(129, 140, 248, 0.1)' : 'none' }}>
                  <Home size={28} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Home</span>
              </button>
              <button 
                onClick={() => setActiveTab('messages')}
                style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', color: activeTab === 'messages' ? '#c084fc' : 'rgba(255,255,255,0.3)', cursor: 'pointer', position: 'relative', transition: 'all 0.3s' }}
              >
                <div style={{ position: 'relative', padding: '10px', borderRadius: '14px', background: activeTab === 'messages' ? 'rgba(192, 132, 252, 0.1)' : 'transparent' }}>
                    <MessageSquare size={28} />
                    <div style={{ position: 'absolute', top: '4px', right: '4px', background: '#f43f5e', color: 'white', width: '20px', height: '20px', borderRadius: '50%', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, boxShadow: '0 0 15px rgba(244, 63, 94, 0.4)' }}>1</div>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Neural</span>
              </button>
              <button 
                onClick={() => setActiveTab('help')}
                style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', color: activeTab === 'help' ? '#fb7185' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                <div style={{ padding: '10px', borderRadius: '14px', background: activeTab === 'help' ? 'rgba(251, 113, 133, 0.1)' : 'transparent' }}>
                  <HelpCircle size={28} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Support</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
