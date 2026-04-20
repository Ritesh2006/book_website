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

const Chatbot = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'messages', 'help'
  const [messages, setMessages] = useState([
    { text: "Hello! I am your Llama 3 AI Librarian. How can I help you discover something new today?", sender: 'bot' }
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
              background: 'rgba(255, 255, 255, 0.95)', borderRadius: '32px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 40px 80px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.5)',
              display: 'flex', flexDirection: 'column',
              zIndex: 10000, overflow: 'hidden',

            }}
          >
            {/* --- PREMIUM HEADER SECTION --- */}
            <div style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #db2777 100%)',
              padding: '2.5rem 2rem 3.5rem', position: 'relative', color: 'white',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              {/* Shine overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)', zIndex: 0 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '50%', display: 'flex', backdropFilter: 'blur(10px)' }}>
                    <BookOpen size={22} color="white" strokeWidth={2.5} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.5px', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>BookHaven.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', marginRight: '5px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', overflow: 'hidden', background: '#ccc', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                      <img src={user?.picture || "https://randomuser.me/api/portraits/men/32.jpg"} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    </div>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', overflow: 'hidden', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display:'flex', alignItems:'center', justifyContent:'center', marginLeft:'-14px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                      <Bot size={18} color="white" />
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border:'none', color:'white', width:'36px', height:'36px', borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter: 'blur(5px)', transition: 'background 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.3)'} onMouseLeave={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
                    <X size={20} />
                  </button>
                </div>
              </div>

              {activeTab === 'home' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ position: 'relative', zIndex: 1 }}>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, lineHeight: 1.1, textShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    Hello {user?.name?.split(' ')[0] || 'Reader'}! <br/>
                    How can we help?
                  </h1>
                </motion.div>
              )}
              {activeTab === 'messages' && <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, position: 'relative', zIndex: 1, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>Llama 3 Brain</h1>}
              {activeTab === 'help' && <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, position: 'relative', zIndex: 1, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>Help Center</h1>}
            </div>

            {/* --- SCROLLABLE CONTENT --- */}
            <div style={{ flex: 1, margin: '-2.5rem 1rem 0', position: 'relative', zIndex: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', pb: '1rem' }}>
              
              {activeTab === 'home' && (
                <>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="premium-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'white' }}>
                    <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '12px', color: '#d97706' }}>
                      <AlertCircle size={22} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 800, color: '#1f2937', fontSize: '0.95rem' }}>Status: All Systems Active</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Llama 3 is online and ready to assist.</p>
                    </div>
                  </motion.div>

                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="premium-card" style={{ background: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                      <input type="text" placeholder="Search for library help..." style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '0.9rem', outline: 'none' }} />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {menuItems.map((item, i) => (
                        <div 
                          key={i} 
                          onClick={() => handleQuickLink(item.label)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: i === menuItems.length - 1 ? 'none' : '1px solid #f3f4f6', cursor: 'pointer' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {item.icon}
                            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#374151' }}>{item.label}</span>
                          </div>
                          <ChevronRight size={18} color="#9ca3af" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}

              {activeTab === 'messages' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0 0.5rem' }}>
                  {messages.map((msg, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', gap: '0.75rem' }}>
                      {msg.sender === 'bot' && <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '0.5rem', borderRadius: '10px', color: 'white', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)' }}><Bot size={18} /></div>}
                      <div style={{
                        background: msg.sender === 'user' ? 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)' : 'white',
                        color: msg.sender === 'user' ? 'white' : '#1f2937',
                        padding: '1rem 1.25rem', borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px', maxWidth: '85%', fontSize: '0.95rem', lineHeight: 1.5, boxShadow: msg.sender === 'user' ? '0 8px 20px rgba(219, 39, 119, 0.2)' : '0 4px 15px rgba(0,0,0,0.05)',
                        border: msg.sender === 'bot' ? '1px solid #f3f4f6' : 'none'
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && <div style={{ color:'var(--text-muted)', fontSize:'0.8rem', fontStyle:'italic', ml:'40px' }}>Llama 3 is thinking...</div>}
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
