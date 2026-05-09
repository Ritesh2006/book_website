import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Tag, X, CheckCircle, Zap, ShieldCheck, ShoppingCart } from 'lucide-react';

const LiveAd = ({ title, description, badge }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  
  const images = [
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: <Zap size={18} />, title: "Hyper-Fast Response", detail: "Latest generation E-Ink tech" },
    { icon: <ShieldCheck size={18} />, title: "Waterproof IPX8", detail: "Read in the bath or pool" },
    { icon: <CheckCircle size={18} />, title: "Warm Light", detail: "Adjustable shade for eyes" }
  ];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="live-ad-container"
        style={{
          padding: window.innerWidth > 768 ? '3rem' : '1.5rem',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gridColumn: '1 / -1',
          marginTop: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          borderRadius: window.innerWidth > 768 ? '32px' : '20px',
          border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: '#38bdf8', opacity: 0.1, filter: 'blur(80px)', borderRadius: '50%' }}></div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.08)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)' }}>
            <Tag size={16} color="#38bdf8" />
            <span style={{ color: '#38bdf8', letterSpacing: '1px', fontSize: '0.75rem' }}>{badge || "OFFICIAL PARTNER"}</span>
          </div>
        </div>
        
        <div style={{ 
          position: 'relative', 
          zIndex: 2, 
          marginTop: '1.5rem', 
          display: 'flex', 
          flexDirection: window.innerWidth > 900 ? 'row' : 'column',
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: window.innerWidth > 900 ? '4rem' : '2rem' 
        }}>
          <div style={{ flex: 1, width: '100%' }}>
            <h3 style={{ fontSize: window.innerWidth > 768 ? '2.5rem' : '1.75rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>{title || "The Kindle Oasis Pro"}</h3>
            <p style={{ color: '#94a3b8', fontSize: window.innerWidth > 768 ? '1.2rem' : '1rem', maxWidth: '500px', marginBottom: '2rem', lineHeight: 1.6 }}>
              {description || "The absolute pinnacle of digital reading. Featuring a massive 7-inch display, adjustable warm light, and ergonomic design."}
            </p>

            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDetails(true)}
                style={{
                  background: '#38bdf8',
                  color: '#1e1b4b',
                  padding: '1rem 2rem',
                  borderRadius: '14px',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: '0 20px 40px rgba(56, 189, 248, 0.3)'
                }}
              >
                Learn More <ExternalLink size={20} />
              </motion.button>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>$249.99 <span style={{ color: '#64748b', fontSize: '0.9rem', textDecoration: 'line-through', fontWeight: 500 }}>$299.99</span></span>
            </div>
          </div>
          
          <div style={{ 
            flex: 1, 
            position: 'relative', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            width: '100%',
            height: window.innerWidth > 768 ? '350px' : '250px' 
          }}>
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImage}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
                src={images[currentImage]} 
                alt="Live Ad Product"
                onError={(e) => {
                  // Cycle to next image if current one fails
                  e.target.onerror = null;
                  const next = (currentImage + 1) % images.length;
                  e.target.src = images[next];
                }}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  maxWidth: '450px', 
                  objectFit: 'cover', 
                  borderRadius: '24px', 
                  boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }} 
              />
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Details Modal Overlay */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(10px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              style={{
                width: '100%',
                maxWidth: '600px',
                background: '#1e1b4b',
                borderRadius: '32px',
                padding: '3rem',
                border: '1px solid rgba(255,255,255,0.1)',
                position: 'relative',
                color: 'white'
              }}
            >
              <button 
                onClick={() => setShowDetails(false)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                 <div style={{ background: '#38bdf8', padding: '0.6rem', borderRadius: '12px' }}>
                    <Zap size={24} color="#1e1b4b" />
                 </div>
                 <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Product Specifications</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                {features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                    <div style={{ color: '#38bdf8' }}>{f.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{f.title}</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{f.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => alert('Product added to checkout!')}
                  style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: '#38bdf8', color: '#1e1b4b', border: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', cursor: 'pointer' }}
                >
                  <ShoppingCart size={20} /> Buy Now
                </button>
                <button 
                  onClick={() => setShowDetails(false)}
                  style={{ padding: '1rem 2rem', borderRadius: '12px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveAd;
