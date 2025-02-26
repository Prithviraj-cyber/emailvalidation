// src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import ReactPaginate from 'react-paginate';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const emailsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({ key: 'email', direction: 'ascending' });

  useEffect(() => {
    const results = JSON.parse(localStorage.getItem('validationResults')) || [];
    setEmails(results);
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedEmails = React.useMemo(() => {
    let sortableEmails = [...emails];
    if (sortConfig.key) {
      sortableEmails.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableEmails;
  }, [emails, sortConfig]);

  const offset = currentPage * emailsPerPage;
  const currentPageData = sortedEmails.slice(offset, offset + emailsPerPage);
  const pageCount = Math.ceil(emails.length / emailsPerPage);

  const handleDownload = () => {
    const csv = Papa.unparse(emails);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'email_validation_results.csv');
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Email Validation Results</h1>
      </header>
      <main>
        {emails.length > 0 ? (
          <>
            <button onClick={handleDownload} className="download-button">
              Download Report
            </button>
            <table>
              <thead>
                <tr>
                  <th onClick={() => requestSort('email')}>
                    Mail Address {sortConfig.key === 'email' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                  </th>
                  <th onClick={() => requestSort('syntaxValidation')}>
                    Syntax Validation {sortConfig.key === 'syntaxValidation' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                  </th>
                  <th onClick={() => requestSort('dnsValidation')}>
                    DNS Record Validation {sortConfig.key === 'dnsValidation' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                  </th>
                  <th onClick={() => requestSort('deliverable')}>
                    Deliverable {sortConfig.key === 'deliverable' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.email}</td>
                    <td>{item.syntaxValidation}</td>
                    <td>{item.dnsValidation}</td>
                    <td>{item.deliverable}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ReactPaginate
              previousLabel={'← Previous'}
              nextLabel={'Next →'}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </>
        ) : (
          <p>No validation results to display.</p>
        )}
      </main>
      <footer className="footer">
        <p>&copy; 2023 Email Validator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
