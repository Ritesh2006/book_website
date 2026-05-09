import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const AnnouncementBar = () => {
  return (
    <div style={{
      background: 'linear-gradient(90deg, #4f46e5, #ec4899, #f59e0b)',
      color: 'white',
      padding: '0.5rem 0',
      overflow: 'hidden',
      position: 'relative',
      whiteSpace: 'nowrap',
      zIndex: 1001
    }}>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: '-100%' }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 15
        }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '2rem', paddingLeft: '100%' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
          <Zap size={16} fill="yellow" /> LIVE: Best Selling Books Updated Daily
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
          <Zap size={16} fill="yellow" /> 🔥 50% Off Premium Subscriptions Today Only
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
          <Zap size={16} fill="yellow" /> 📚 New Llama 3 AI Chatbot Integrated For You
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
          <Zap size={16} fill="yellow" /> 🚀 All Action/Adventure eBooks Free This Week
        </span>
      </motion.div>
    </div>
  );
};

export default AnnouncementBar;
