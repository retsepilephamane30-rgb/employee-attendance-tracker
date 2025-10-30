import React, { useState } from 'react';
import Navigation from './components/Navigation';
import AttendanceForm from './components/AttendanceForm';
import AttendanceDashboard from './components/AttendanceDashboard';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [currentPage, setCurrentPage] = useState('form');

  const renderPage = () => {
    switch (currentPage) {
      case 'form':
        return <AttendanceForm />;
      case 'dashboard':
        return <AttendanceDashboard />;
      default:
        return <AttendanceForm />;
    }
  };

  return (
    <div className="App d-flex flex-column min-vh-100">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-grow-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;