import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { register, login, logout } from './auth';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { generateIdea } from './groq';
import { FaUserCircle } from "react-icons/fa";
import { motion } from 'framer-motion';
import axios from 'axios';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";
import SavedIdeas from "./pages/SavedIdeas";
import SavedCodes from "./pages/SavedCodes";

function AppContent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const [codePrompt, setCodePrompt] = useState('');
  const [codeFeatures, setCodeFeatures] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);

  const [showProfile, setShowProfile] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');

  const [savedIdeas, setSavedIdeas] = useState(() => {
    const storedIdeas = sessionStorage.getItem('savedIdeas');
    return storedIdeas ? JSON.parse(storedIdeas) : [];
  });
  const [savedCodes, setSavedCodes] = useState(() => {
    const storedCodes = sessionStorage.getItem('savedCodes');
    return storedCodes ? JSON.parse(storedCodes) : [];
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setIdea('');
        setGeneratedCode('');
        setCustomPrompt('');
        setCodePrompt('');
        setCodeFeatures('');
        setSavedIdeas([]);
        setSavedCodes([]);
        setName('');
        setBio('');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGenerateIdea = async () => {
    if (!customPrompt.trim()) {
      alert('Please enter your idea prompt first.');
      return;
    }
    setLoading(true);
    setIdea('');
    const result = await generateIdea(customPrompt);
    setIdea(result);
    setLoading(false);
  };

  const saveIdea = () => {
    if (idea && !savedIdeas.includes(idea)) {
      const updatedIdeas = [...savedIdeas, idea];
      setSavedIdeas(updatedIdeas);
      sessionStorage.setItem("savedIdeas", JSON.stringify(updatedIdeas));
      setIdea("");
    }
  };

  const saveCode = () => {
    if (code && !savedCodes.includes(code)) {
      const updatedCodes = [...savedCodes, code];
      setSavedCodes(updatedCodes);
      sessionStorage.setItem("savedCodes", JSON.stringify(updatedCodes));
      setCode("");
    }
  };

  const extractInfo = (text) => {
    const lines = text.split('\n').map(l => l.trim());
    let title = '', overview = '', techs = '', features = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.startsWith('project title:') || line.startsWith('🔑')) {
        title = lines[i].split(':')[1]?.trim() || '';
      } else if (line.startsWith('overview:') || line.startsWith('📖')) {
        overview = lines[i].split(':')[1]?.trim() || '';
      } else if (line.startsWith('core technologies:') || line.startsWith('technologies:') || line.startsWith('🧰')) {
        techs = lines[i].split(':')[1]?.trim() || '';
      } else if (line.startsWith('key features:') || line.startsWith('🛠️')) {
        features = [];
        for (let j = i + 1; j < lines.length; j++) {
          const fLine = lines[j];
          if (fLine.startsWith('-') || fLine.startsWith('•')) {
            features.push(fLine.replace(/^[-•]\s*/, '').trim());
          } else if (fLine === '') continue;
          else break;
        }
      }
    }

    return {
      title,
      overview,
      technologies: techs ? techs.split(',').map(t => t.trim()) : [],
      features,
    };
  };

  const handleCodeGeneration = async () => {
    if (!codePrompt.trim() || !codeFeatures.trim()) {
      return alert("Enter both project type and features");
    }

    setCodeLoading(true);
    setGeneratedCode('');

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://skillforgeai.onrender.com';
      const res = await fetch(`${API_BASE_URL}/generate-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectType: codePrompt, feature: codeFeatures }),
      });

      const data = await res.json();
      const cleanCode = (data.code || 'No code returned')
        .replace(/```(?:\w+)?/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/`{1,3}/g, '')
        .trim();

      setGeneratedCode(cleanCode);
      setSavedCodes(prev => [...prev, codePrompt]);
    } catch (err) {
      setGeneratedCode("Failed to fetch code.");
    } finally {
      setCodeLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    alert("Code copied to clipboard!");
  };

  const handleLogout = () => {
    logout();
    setIdea('');
    setCustomPrompt('');
    setGeneratedCode('');
    setCodePrompt('');
    setCodeFeatures('');
    setSavedIdeas([]);
    setSavedCodes([]);
    setName('');
    setBio('');
  };

  if (user) {
    const extracted = idea ? extractInfo(idea) : null;

    return (
      <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', position: 'relative' }}>
        {/* 🔹 Profile Icon */}
        <div style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '20px', 
          zIndex: 999,
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '50%',
          padding: '8px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          border: '2px solid rgba(255, 255, 255, 0.8)'
        }}>
          <FaUserCircle
            size={40}
            style={{ 
              cursor: 'pointer', 
              color: '#667eea',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
              transition: 'all 0.3s ease'
            }}
            className="floating"
            onClick={() => setShowProfile(true)}
          />
        </div>

        {/* 🔹 Profile Modal */}
        {showProfile && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="profile-modal" style={{
              padding: '2.5rem', width: '90%', maxWidth: '450px', position: 'relative'
            }}>
              <h2 className="gradient-text" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>👤 Your Profile</h2>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', marginBottom: '0.75rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
              />
              <textarea
                placeholder="Your Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
                rows="3"
              />

              <div className="stats-card" style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>💡 Saved Ideas</h4>
                <div className="stats-number" style={{ fontSize: '1.5rem' }}>{savedIdeas.length}</div>
                <button
                  onClick={() => {
                    navigate("/saved-ideas");
                    setShowProfile(false);
                  }}
                  className="primary"
                  style={{ marginTop: '0.5rem', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  View All Ideas
                </button>
              </div>

              <div className="stats-card" style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>💻 Saved Code Prompts</h4>
                <div className="stats-number" style={{ fontSize: '1.5rem' }}>{savedCodes.length}</div>
                <button
                  onClick={() => {
                    navigate("/saved-codes");
                    setShowProfile(false);
                  }}
                  className="success"
                  style={{ marginTop: '0.5rem', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  View All Codes
                </button>
              </div>

              <button
                onClick={() => setShowProfile(false)}
                className="secondary"
                style={{ marginTop: '1.5rem', width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Main UI */}
        <div className="hero-section fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem', textAlign: 'center', width: '100%', maxWidth: '100vw' }}>
          <h1 className="gradient-text">🚀 Welcome to SkillForge AI</h1>
          <p style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '2rem', textShadow: '0 3px 6px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.6)', fontWeight: '700' }}>Logged in as <strong style={{ color: '#ffffff', textShadow: '0 3px 6px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.6)' }}>{user.email}</strong></p>

          <div className="card slide-in" style={{ marginTop: '2rem', maxWidth: '700px', width: '100%', boxSizing: 'border-box' }}>
            <h2>Your Dashboard</h2>
            <p style={{ color: '#0f1419', fontSize: '1.2rem', fontWeight: '600', textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' }}>🚀 Enter your idea prompt and get AI suggestions:</p>

            {!idea && (
              <>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Suggest a unique AI project for students"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '1rem' }}
                />
                <button
                  onClick={handleGenerateIdea}
                  disabled={loading}
                  className="primary"
                  style={{ marginTop: '1rem' }}
                >
                  {loading ? 'Thinking...' : 'Generate Idea 💡'}
                </button>
              </>
            )}

            {idea && extracted && (
              <div className="ai-breakdown-modal fade-in" style={{ marginTop: '2rem' }}>
                <h2>🧠 AI Suggestion Breakdown</h2>
                
                <div className="ai-breakdown-item">
                  <h3>🔑 Project Title</h3>
                  <p>{extracted.title || 'Not available'}</p>
                </div>
                
                <div className="ai-breakdown-item">
                  <h3>📖 Overview</h3>
                  <p>{extracted.overview || 'Not available'}</p>
                </div>
                
                <div className="ai-breakdown-item">
                  <h3>🧰 Technologies</h3>
                  <p>{extracted.technologies.length ? extracted.technologies.join(', ') : 'Not available'}</p>
                </div>
                
                <div className="ai-breakdown-item">
                  <h3>🛠️ Key Features</h3>
                  <p>
                    {extracted.features.length ? 
                      extracted.features.map((f, i) => <span key={i}>• {f}<br/></span>) : 
                      'Not available'
                    }
                  </p>
                </div>
                
                <div className="ai-breakdown-buttons">
                  <button onClick={saveIdea} className="ai-breakdown-btn primary">
                    💾 Save Idea
                  </button>
                  <button
                    onClick={() => setIdea('')}
                    className="ai-breakdown-btn secondary"
                  >
                    🔙 Back
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="danger"
              style={{ marginTop: '1.5rem' }}
            >
              Log Out
            </button>
          </div>
        </div>

        {/* 🔽 Code Generator Section */}
        <div className="hero-section" style={{ padding: '3rem 1rem', minHeight: '100vh' }}>
          <div className="card slide-in" style={{
            maxWidth: '800px',
            margin: 'auto',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>💻 Want Code for Your Project?</h2>
            <p style={{ fontSize: '1.1rem', color: '#0f1419', marginBottom: '1rem', fontWeight: '600', textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' }}>
              Type your project type + features. Get working code instantly 👇
            </p>

            <textarea
              placeholder="e.g. MERN Stack Blog"
              value={codePrompt}
              onChange={(e) => setCodePrompt(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                marginBottom: '1rem'
              }}
              rows={3}
            />
            <textarea
              placeholder="e.g. JWT login, image upload, search bar..."
              value={codeFeatures}
              onChange={(e) => setCodeFeatures(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #ccc'
              }}
              rows={3}
            />
            <button
              onClick={handleCodeGeneration}
              disabled={codeLoading}
              className="success"
              style={{ marginTop: '1rem' }}
            >
              {codeLoading ? 'Generating Code...' : 'Generate Code'}
            </button>

            {generatedCode && (
              <>
                <div className="code-block fade-in" style={{ marginTop: '1.5rem' }}>
                  <code>{generatedCode}</code>
                </div>
                <button
                  onClick={saveCode}
                  className="primary"
                  style={{ marginTop: '1rem', marginRight: '0.75rem' }}
                >
                  💾 Save Code Prompt
                </button>
                <button
                  onClick={handleCopy}
                  className="dark"
                  style={{ marginTop: '1rem' }}
                >
                  📋 Copy Code
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  //not logged in
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Login Box with animation */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card"
          style={{
            width: '100%',
            maxWidth: '450px',
            textAlign: 'center'
          }}
        >
          <h1 className="gradient-text" style={{ marginBottom: '0.5rem' }}>🔥 SkillForge AI</h1>
          <p style={{ marginBottom: '2rem', color: '#ffffff', fontSize: '1.3rem', fontWeight: '700', textShadow: '0 3px 6px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.6)' }}>Log in or Sign Up to continue</p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              border: '1px solid #ccc'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #ccc'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <button
              onClick={() => register(email, password)}
              className="success"
              style={{ flex: 1 }}
            >
              Sign Up
            </button>
            <button
              onClick={() => login(email, password)}
              className="primary"
              style={{ flex: 1 }}
            >
              Log In
            </button>
          </div>
        </motion.div>
      </div>

      {/* MVP Cards Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        style={{ padding: '4rem 1rem', width: '100%' }}
      >
        <div style={{ maxWidth: '1200px', margin: 'auto', textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✨ Amazing Features</h2>
          <p style={{ fontSize: '1.4rem', color: '#ffffff', maxWidth: '600px', margin: 'auto', fontWeight: '700', textShadow: '0 3px 6px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.6)' }}>
            Discover the power of AI-driven project development with our cutting-edge tools
          </p>
        </div>
        <div style={{ maxWidth: '1200px', margin: 'auto', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', padding: '0 1rem' }}>
          {[
            {
              icon: '💡',
              title: 'AI Idea Generator',
              description: 'Get detailed project suggestions with technologies, features, and implementation strategies',
              color: '#667eea'
            },
            {
              icon: '💻',
              title: 'Code Generator',
              description: 'Generate working code snippets and full project structures instantly',
              color: '#764ba2'
            },
            {
              icon: '🚀',
              title: 'Project Management',
              description: 'Save and organize your ideas and code for future reference and development',
              color: '#f093fb'
            }
          ].map((feature, i) => (
                      <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: i * 0.1 }}
            viewport={{ once: true }}
              className="feature-card floating"
              style={{
                width: '350px',
                textAlign: 'center',
                animationDelay: `${i * 2}s`
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: feature.color }}>{feature.title}</h3>
              <p style={{ color: '#ffffff', lineHeight: '1.6', fontWeight: '700', textShadow: '0 3px 6px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.6)' }}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="hero-section"
        style={{ padding: '4rem 1rem', margin: '2rem 0' }}
      >
        <div style={{ maxWidth: '900px', margin: 'auto', textAlign: 'center' }}>
          <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            What is SkillForge AI?
          </h2>
          <p style={{ fontSize: '1.4rem', color: '#ffffff', lineHeight: '1.8', marginBottom: '2rem', fontWeight: '700', textShadow: '0 3px 6px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.6)' }}>
            SkillForge AI is your personal project mentor and idea generator. 
            It helps students discover the most valuable projects (MVPs), 
            suggests ideas based on your interests, and connects you with the right resources.
          </p>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem', padding: '0 1rem' }}>
            <div className="stats-card">
              <div className="stats-number">100+</div>
                          <p style={{ margin: '0.5rem 0 0 0', color: '#0f1419', fontWeight: '700', textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' }}>Project Ideas</p>
          </div>
          <div className="stats-card">
            <div className="stats-number">50+</div>
            <p style={{ margin: '0.5rem 0 0 0', color: '#0f1419', fontWeight: '700', textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' }}>Technologies</p>
          </div>
          <div className="stats-card">
            <div className="stats-number">24/7</div>
            <p style={{ margin: '0.5rem 0 0 0', color: '#0f1419', fontWeight: '700', textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' }}>AI Support</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
          <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
        className="card"
        style={{
          margin: '3rem auto',
          width: '90%',
          maxWidth: '600px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))'
        }}
      >
        <h3 className="gradient-text" style={{ marginBottom: '1.5rem' }}>🚀 Get In Touch</h3>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', padding: '0 1rem' }}>
          <div className="stats-card" style={{ flex: '1', minWidth: '150px' }}>
            <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '600', color: '#667eea' }}>📞 Phone</p>
            <p style={{ margin: '0.5rem 0 0 0', color: '#0f1419', fontWeight: '700', textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' }}>+91-9650882793</p>
          </div>
          <div className="stats-card" style={{ flex: '1', minWidth: '150px' }}>
            <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '600', color: '#667eea' }}>📧 Email</p>
            <p style={{ margin: '0.5rem 0 0 0', color: '#0f1419', fontWeight: '700', textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)', wordBreak: 'break-all', fontSize: '0.9rem' }}>sharmakshtij154@gmail.com</p>
          </div>
          <div className="stats-card" style={{ flex: '1', minWidth: '150px' }}>
            <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '600', color: '#667eea' }}>🙋‍♂️ Developer</p>
            <p style={{ margin: '0.5rem 0 0 0', color: '#0f1419', fontWeight: '700', textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' }}>Kshitij Sharma</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <Router>
      <div>
        {/* Main Navigation Bar */}
        <nav className="navbar" style={{ 
          padding: '1rem 2rem', 
          display: 'flex', 
          gap: '2rem', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          {/* Logo Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              🚀 SkillForge AI
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div style={{ display: 'none', cursor: 'pointer' }} className="mobile-menu-toggle">
            {mobileMenuOpen ? (
              <FaTimes 
                size={24} 
                color="#667eea" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              />
            ) : (
              <FaBars 
                size={24} 
                color="#667eea" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              />
            )}
          </div>

          {/* Navigation Links */}
          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`} style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ 
              color: '#667eea', 
              fontWeight: '600', 
              fontSize: '1.1rem',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              border: '2px solid transparent'
            }}>🏠 Home</Link>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ 
              color: '#667eea', 
              fontWeight: '600', 
              fontSize: '1.1rem',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              border: '2px solid transparent',
              cursor: 'pointer'
            }}>✨ Features</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ 
              color: '#667eea', 
              fontWeight: '600', 
              fontSize: '1.1rem',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              border: '2px solid transparent',
              cursor: 'pointer'
            }}>📞 Contact</a>
          </div>

          {/* User Section */}
          {sessionStorage.getItem("user") && (
            <div className="user-section" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#667eea', 
                fontWeight: '500',
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}>
                👤 {sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")).email : 'User'}
              </div>
            </div>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/saved-ideas" element={<SavedIdeas />} />
          <Route path="/saved-codes" element={<SavedCodes />} />
        </Routes>
      </div>
    </Router>
  );
}
