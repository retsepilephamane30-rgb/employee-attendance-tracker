import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navigation({ currentPage, onPageChange }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container">
        <span className="navbar-brand">Employee Attendance Tracker</span>
        <div className="navbar-nav">
          <button
            className={`nav-link btn btn-link ${currentPage === 'form' ? 'active' : ''}`}
            onClick={() => onPageChange('form')}
          >
            Mark Attendance
          </button>
          <button
            className={`nav-link btn btn-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => onPageChange('dashboard')}
          >
            View Dashboard
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;