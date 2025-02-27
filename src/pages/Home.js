
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [singleEmail, setSingleEmail] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSingleEmailChange = (event) => {
    setSingleEmail(event.target.value);
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleValidate = () => {
    let validationResults = [];

    if (singleEmail) {
      // Perform validation on single email
      const result = validateEmail(singleEmail);
      validationResults.push(result);
    }

    if (file) {
      // Process CSV file and perform bulk validation
      processCSVFile(file, (results) => {
        validationResults = validationResults.concat(results);
        // Save results to localStorage and navigate after processing
        localStorage.setItem('validationResults', JSON.stringify(validationResults));
        navigate('/dashboard');
      });
      return; // Return here because processing is asynchronous
    } else if (singleEmail) {
      // Save results to localStorage and navigate
      localStorage.setItem('validationResults', JSON.stringify(validationResults));
      navigate('/dashboard');
    } else {
      alert('Please enter an email or upload a CSV file.');
    }
  };

  return (
    <div className="homepage">
      <header className="header">
        <h1>Email Validation Tool</h1>
      </header>
      <main>
        <section className="input-section">
          <h2>Validate Bulk or Single Emails</h2>
          <input
            type="email"
            placeholder="Enter a single email to validate..."
            value={singleEmail}
            onChange={handleSingleEmailChange}
            className="single-email-input"
          />
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="file-upload-input"
          />
          <button onClick={handleValidate} className="validate-button">
            Validate Emails
          </button>
        </section>
      </main>
      <footer className="footer">
        <p>&copy; 2023 Email Validator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;


const validateEmail = (email) => {
  return {
    email: email,
    syntaxValidation: validateSyntax(email) ? 'Valid' : 'Invalid',
    dnsValidation: checkDNS(email) ? 'Success' : 'Failure',
    deliverable: isDeliverable(email) ? 'Yes' : 'No',
  };
};

const validateSyntax = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const checkDNS = (email) => {
  // Simulate DNS check logic
  return true; // Assume success for this example
};

const isDeliverable = (email) => {
  // Simulate deliverability check
  return Math.random() > 0.5 ? true : false;
};

const processCSVFile = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target.result;
    const emails = text.split(/\r?\n/).filter((line) => line !== '');
    const results = emails.map((email) => validateEmail(email));
    callback(results);
  };
  reader.readAsText(file);
};
