import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Activity, FileText, Bot, Clock, AlertCircle } from 'lucide-react';
import FileUpload from '../components/FileUpload';

// Mock Previous Patient History Data
const MOCK_HISTORY = [
  { id: 1, date: 'Mar 10, 2026', type: 'General Checkup', status: 'Normal', doctor: 'Dr. Smith' },
  { id: 2, date: 'Feb 15, 2026', type: 'CBC Blood Test', status: 'Reviewed', doctor: 'Dr. Allen' },
  { id: 3, date: 'Jan 02, 2026', type: 'Viral Infection', status: 'Resolved', doctor: 'Dr. Smith' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState(MOCK_HISTORY);

  useEffect(() => {
    const savedUser = localStorage.getItem('healthGenieUser');
    if (!savedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('healthGenieUser');
    navigate('/login');
  };

  const handleNewReport = (report) => {
    setMedicalHistory([ { id: Date.now(), ...report, doctor: 'Pending Review' }, ...medicalHistory ]);
  };

  if (!user) return null;

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', background: 'rgba(10, 10, 12, 0.8)', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Activity color="var(--primary)" size={28} />
          <h2 className="gradient-text" style={{ fontSize: '1.5rem', margin: 0 }}>Health Genie</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Welcome, {user.email.split('@')[0]}</span>
          <button onClick={handleLogout} className="btn btn-glass" style={{ padding: '0.5rem 1rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="page-wrapper" style={{ gap: '2rem' }}>
        
        {/* Hero Section calling to action Genie */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ 
            padding: '3rem 2rem', 
            borderRadius: 'var(--border-radius-lg)',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.05))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem'
          }}
        >
          <div style={{ flex: '1 1 400px' }}>
            <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>
              Feeling Unwell? <br />
              <span className="gradient-text">Ask Health Genie.</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem', maxWidth: '500px' }}>
              Enter your symptoms to receive an initial assessment. The Genie will predict severity and emphasize whether you need to see a doctor for early detection.
            </p>
            <button 
              onClick={() => navigate('/genie')} 
              className="btn btn-primary" 
              style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
            >
              <Bot size={20} /> Consult Genie Now
            </button>
          </div>
          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
              width: '200px', height: '200px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 50px var(--primary-glow)',
              color: 'white'
            }}>
              <Bot size={80} />
            </div>
          </div>
        </motion.div>

        {/* Two column layout: Upload & History */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--primary)" /> Add Medical Data
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Upload your medical reports. The system will scan them to adopt data for personalized insights.
            </p>
            <FileUpload onUploadComplete={handleNewReport} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="var(--secondary)" /> Previous Medical History
            </h3>
            
            <div className="glass-card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ overflowY: 'auto', maxHeight: '350px', padding: '1rem' }}>
                {medicalHistory.map((record) => (
                  <div key={record.id} style={{
                    padding: '1rem',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div>
                      <h4 style={{ marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{record.type}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {record.date} • {record.doctor}
                      </p>
                    </div>
                    <div>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: 'var(--border-radius-full)',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        backgroundColor: record.status === 'Normal' ? 'rgba(20, 184, 166, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                        color: record.status === 'Normal' ? 'var(--accent-teal)' : 'var(--primary)'
                      }}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
