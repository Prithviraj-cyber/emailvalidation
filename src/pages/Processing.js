
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Processing.css';

function Processing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate processing delay
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000); // 3 seconds delay
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="processing-page">
      <header className="header">
        <h1>Processing Emails...</h1>
      </header>
      <main>
        <div className="loader"></div>
        <p>Please wait while we validate your emails.</p>
      </main>
      <footer className="footer">
        <p>&copy; 2023 Email Validator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Processing;
