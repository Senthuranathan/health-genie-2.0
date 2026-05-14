import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill out all fields.');
      return;
    }
    // Mock login save state
    localStorage.setItem('healthGenieUser', JSON.stringify({ email, isLoggedIn: true }));
    navigate('/dashboard');
  };

  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card" 
        style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              padding: '1rem', 
              borderRadius: 'var(--border-radius-full)',
              color: 'white',
              boxShadow: '0 0 20px var(--primary-glow)'
            }}>
              <Activity size={32} />
            </div>
          </div>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Health Genie</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Log in to access your health portal</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid var(--danger)',
              color: '#f87171',
              borderRadius: 'var(--border-radius-sm)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                id="email" 
                type="email" 
                className="input-field" 
                style={{ paddingLeft: '3rem' }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
}
