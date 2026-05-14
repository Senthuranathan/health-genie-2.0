import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, ArrowLeft, Send, Activity, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import ChatBubble from '../components/ChatBubble';
import { GoogleGenAI } from '@google/genai';

export default function HealthGenie() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      isGenie: true,
      text: "Hello! I am Health Genie. I can help assess how serious your symptoms might be based on your inputs and previous medical history. <br/><br/><strong>What symptoms are you currently experiencing?</strong>"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const [chatSession, setChatSession] = useState(null);
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (apiKey && !chatSession) {
      try {
        const ai = new GoogleGenAI({ apiKey: apiKey });

        const systemInstruction = `You are Health Genie, a friendly, professional AI health assistant.
Your goal is to help users assess the severity of their symptoms and recommend whether they should see a doctor. You can also answer general informational questions about diseases and health conditions.
IMPORTANT RULES:
1. IF THE USER ASKS A GENERAL QUESTION (e.g., "what are the symptoms of thyroid?", "how long does flu last?"):
   - Answer their question clearly and directly based on medical knowledge.
   - Do NOT force an assessment or diagnosis flow. 
   - You can politely ask if they are experiencing any of these symptoms to start an assessment if they want, but do not ask diagnostic follow-up questions immediately.
2. IF THE USER DESCRIBES THEIR OWN SYMPTOMS:
   - DO NOT PROVIDE A FINAL DIAGNOSIS IMMEDIATELY. Ask 1-3 follow-up questions to understand the duration, severity, and specific details of their symptoms.
   - After gathering sufficient information (usually after 2 or 3 turns), provide a final assessment.
3. You MUST NEVER prescribe medications or specific treatments. Only analyze symptoms and recommend seeing a doctor.
4. When you provide the FINAL assessment for a user's symptoms, you MUST format your response using one of the following exact HTML structures, depending on severity. Do NOT wrap it in markdown blockquotes, just output the raw HTML and stop asking questions.

For General Conditions (e.g., flu, cold, minor issues):
<div style="background: rgba(245, 158, 11, 0.1); border-left: 4px solid var(--warning); padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
  <strong style="color: #fbbf24; display:flex; align-items:center; gap:0.5rem;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg> General Condition</strong>
  <p style="margin-top: 0.5rem; color: var(--text-primary);">[Your brief summary here]</p>
</div>
<p><strong>Even though this doesn't seem immediately life-threatening, I still advise you to schedule a visit with your doctor for a confirmed diagnosis.</strong></p>

For Serious Conditions (e.g., chest pain, severe bleeding, difficulty breathing):
<div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid var(--danger); padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
  <strong style="color: #f87171; display:flex; align-items:center; gap:0.5rem;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg> Potential Serious Condition</strong>
  <p style="margin-top: 0.5rem; color: var(--text-primary);">[Your brief summary here]</p>
</div>
<p><strong>I strongly advise you to visit a doctor or an emergency room immediately for a proper medical checkup.</strong></p>

Only output the HTML in the final assessment. No extra text around it. Maintain a caring, empathetic tone throughout the prompt. Use <br/> for line breaks in your regular text if needed to make it readable.

Contraints: 
        - always answer in a consise manner, do not use more words than necessary
        - organise you follow up question in a clean manner with numbering and each question in a new line for better readability 
`;

        const newChat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7
          }
        });
        setChatSession(newChat);
      } catch (err) {
        console.error("Failed to initialize Gemini:", err);
      }
    }
  }, [apiKey]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMessage = { id: Date.now(), isGenie: false, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      let promptText = input;
      if (messages.length === 1) {
        const savedHistory = localStorage.getItem('healthGenieHistory');
        if (savedHistory) {
          promptText += `\n\n[System Note: User's previous medical history for context: ${savedHistory}]`;
        }
      }

      const response = await chatSession.sendMessage({ message: promptText });
      const text = response.text;

      setMessages(prev => [...prev, { id: Date.now() + 1, isGenie: true, text: text }]);

      if (text.includes('General Condition') || text.includes('Potential Serious Condition') || text.includes('f87171') || text.includes('fbbf24')) {
        setIsAssessmentComplete(true);
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        isGenie: true,
        text: "I'm sorry, I encountered an error connecting to the AI system. Please check your API key or try again later."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="app-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--glass-border)',
        background: 'var(--bg-secondary)',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-glass"
            style={{ padding: '0.5rem', borderRadius: '50%' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              borderRadius: '50%',
              padding: '8px',
              color: 'white',
              boxShadow: '0 0 10px var(--primary-glow)'
            }}>
              <Bot size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Health Genie</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--accent-teal)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-teal)', display: 'inline-block' }}></span>
                Online Status
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div style={{
        background: 'rgba(99, 102, 241, 0.1)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem'
      }}>
        <Info size={16} color="var(--primary)" />
        <span>Health Genie analyzes severity based on your symptoms and history but does NOT provide treatment or diagnosis. Always consult a doctor.</span>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>

          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg.text} isGenie={msg.isGenie} />
          ))}
          {isTyping && <ChatBubble isGenie={true} isTyping={true} />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div style={{
        padding: '1.5rem 2rem',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--glass-border)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          gap: '1rem',
          position: 'relative'
        }}>
          <input
            type="text"
            className="input-field"
            style={{
              borderRadius: 'var(--border-radius-full)',
              padding: '1rem 1.5rem',
              paddingRight: '4rem',
              background: 'var(--bg-primary)',
              border: '1px solid var(--glass-border)'
            }}
            placeholder={isAssessmentComplete ? "Assessment completed. Refresh to start over." : "Describe your symptoms..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isTyping || isAssessmentComplete}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping || isAssessmentComplete}
            className="btn btn-primary"
            style={{
              position: 'absolute',
              right: '8px',
              top: '8px',
              bottom: '8px',
              borderRadius: 'var(--border-radius-full)',
              padding: '0 1rem'
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
