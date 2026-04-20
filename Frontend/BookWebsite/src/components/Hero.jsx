import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Play, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  
  const bgImages = [
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1600"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      position: 'relative',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0 0 80px 80px',
      margin: '0 auto 4rem',
      maxWidth: '1400px',
      overflow: 'hidden',
      color: 'white'
    }}>
      {/* Absolute Background Slider */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundImage: `url(${bgImages[index]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </AnimatePresence>
        {/* Professional Dark Overlay with Gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
          zIndex: 1
        }} />
      </div>

      {/* Hero Content */}
      <div className="hero-content" style={{ 
        position: 'relative', 
        zIndex: 2, 
        maxWidth: '1000px', 
        textAlign: 'center', 
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <motion.div 
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '0.6rem 1.5rem', 
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#818cf8',
            marginBottom: '2.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <Sparkles size={20} />
          <span>The Future of Digital Libraries</span>
        </motion.div>

        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ 
            fontSize: 'clamp(3rem, 8vw, 6rem)', 
            fontWeight: 900, 
            marginBottom: '1.5rem', 
            lineHeight: 1,
            letterSpacing: '-3px'
          }}
        >
          Knowledge Without <br/>
          <span style={{ 
            background: 'linear-gradient(to right, #818cf8, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Boundaries</span>
        </motion.h1>

        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ 
            color: '#cbd5e1', 
            fontSize: '1.4rem', 
            maxWidth: '700px', 
            marginBottom: '3.5rem',
            lineHeight: 1.6,
            fontWeight: 400
          }}
        >
          Access millions of free digital books, research papers, and literary gems. Powered by AI and curated by experts.
        </motion.p>

        <motion.div 
          className="hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}
            style={{
              background: '#4f46e5',
              color: 'white',
              padding: '1.25rem 3rem',
              borderRadius: '16px',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer'
          }}>
            Explore Collection <ArrowRight size={22} />
          </motion.button>
          
          <motion.button 
            whileHover={{ background: 'rgba(255,255,255,0.1)', scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowVideo(true)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              padding: '1.25rem 3rem',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              fontSize: '1.1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
          }}>
            <Play size={20} fill="currentColor" /> Tour Platform
          </motion.button>
        </motion.div>


      </div>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {showVideo && (
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
              background: 'rgba(0,0,0,0.95)',
              backdropFilter: 'blur(20px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              style={{
                width: '100%',
                maxWidth: '1200px',
                aspectRatio: '16/9',
                background: 'black',
                borderRadius: '32px',
                overflow: 'hidden',
                boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowVideo(false)}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}
              >
                ✕
              </button>
              <video 
                autoPlay 
                controls 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-coffee-cup-and-a-stack-of-books-9914-large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;
