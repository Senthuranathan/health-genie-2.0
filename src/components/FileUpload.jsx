import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';

export default function FileUpload({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (uploadedFile) => {
    setFile(uploadedFile);
    setUploading(true);
    
    // Mock upload and analysis delay
    setTimeout(() => {
      setUploading(false);
      if (onUploadComplete) {
        onUploadComplete({
          name: uploadedFile.name,
          date: new Date().toLocaleDateString(),
          type: 'Blood Report',
          status: 'Analyzed'
        });
      }
    }, 2000);
  };

  return (
    <div 
      className={`glass-card ${isDragging ? 'drag-active' : ''}`}
      style={{
        padding: '2rem',
        textAlign: 'center',
        border: isDragging ? '2px dashed var(--primary)' : '2px dashed var(--glass-border)',
        transition: 'all var(--transition-normal)',
        cursor: 'pointer',
        position: 'relative'
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileUpload').click()}
    >
      <input 
        id="fileUpload" 
        type="file" 
        style={{ display: 'none' }} 
        onChange={(e) => {
          if (e.target.files?.[0]) processFile(e.target.files[0]);
        }}
        accept=".pdf,.jpg,.png,.jpeg"
      />

      {!file ? (
        <>
          <div style={{
            display: 'inline-flex',
            padding: '1rem',
            borderRadius: 'var(--border-radius-full)',
            background: 'var(--glass-highlight)',
            marginBottom: '1rem',
            color: 'var(--primary)'
          }}>
            <UploadCloud size={32} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Upload Medical Report</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Drag & drop your report here, or click to browse
          </p>
        </>
      ) : uploading ? (
        <div className="animate-fade-in">
          <div style={{
            display: 'inline-flex',
            padding: '1rem',
            borderRadius: 'var(--border-radius-full)',
            background: 'var(--glass-highlight)',
            marginBottom: '1rem',
            color: 'var(--accent-teal)'
          }}>
            <div className="spinner" style={{
              width: '32px', height: '32px', border: '3px solid var(--glass-border)',
              borderTopColor: 'var(--accent-teal)', borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
          <h3>Analyzing Report...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Scanning {file.name} to adopt previous medical data.
          </p>
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div style={{
            display: 'inline-flex',
            padding: '1rem',
            borderRadius: 'var(--border-radius-full)',
            background: 'rgba(20, 184, 166, 0.2)',
            marginBottom: '1rem',
            color: 'var(--accent-teal)'
          }}>
            <CheckCircle size={32} />
          </div>
          <h3>Upload Complete!</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
            <FileText size={16} />
            <span>{file.name} adopted successfully.</span>
          </div>
        </div>
      )}
    </div>
  );
}
