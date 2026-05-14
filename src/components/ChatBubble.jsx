import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

export default function ChatBubble({ message, isGenie, isTyping = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexDirection: isGenie ? 'row' : 'row-reverse'
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: isGenie 
          ? 'linear-gradient(135deg, var(--primary), var(--secondary))' 
          : 'var(--glass-highlight)',
        color: 'white',
        boxShadow: isGenie ? '0 0 15px var(--primary-glow)' : 'none'
      }}>
        {isGenie ? <Bot size={20} /> : <User size={20} />}
      </div>
      
      <div style={{
        maxWidth: '80%',
        padding: '1rem 1.2rem',
        borderRadius: 'var(--border-radius-md)',
        background: isGenie ? 'var(--glass-bg)' : 'var(--primary)',
        color: 'var(--text-primary)',
        border: isGenie ? '1px solid var(--glass-border)' : 'none',
        borderTopLeftRadius: isGenie ? '4px' : 'var(--border-radius-md)',
        borderTopRightRadius: isGenie ? 'var(--border-radius-md)' : '4px',
        boxShadow: isGenie ? 'none' : '0 4px 15px var(--primary-glow)',
      }}>
        {isTyping ? (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '24px' }}>
            <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }} style={dotStyle}></motion.span>
            <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} style={dotStyle}></motion.span>
            <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} style={dotStyle}></motion.span>
          </div>
        ) : (
          <div style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: message }} />
        )}
      </div>
    </motion.div>
  );
}

const dotStyle = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: 'var(--text-secondary)',
  display: 'inline-block'
};
