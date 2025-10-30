import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../services/api';

function AttendanceDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getAll();
      console.log('Data loaded successfully:', response.data);
      setAttendance(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error loading attendance:', error);
      setMessage('Failed to load attendance records. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadAttendance();
      return;
    }

    try {
      setLoading(true);
      const response = await attendanceAPI.search(searchTerm);
      setAttendance(response.data);
      setMessage(`Found ${response.data.length} records for "${searchTerm}"`);
    } catch (error) {
      console.error('Error searching:', error);
      setMessage('Failed to search records');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByDate = async () => {
    if (!filterDate) {
      loadAttendance();
      return;
    }

    try {
      setLoading(true);
      const response = await attendanceAPI.filterByDate(filterDate);
      setAttendance(response.data);
      setMessage(`Found ${response.data.length} records for date: ${filterDate}`);
    } catch (error) {
      console.error('Error filtering:', error);
      setMessage('Failed to filter records');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, employeeName) => {
    if (window.confirm(`Are you sure you want to delete attendance record for ${employeeName}?`)) {
      try {
        await attendanceAPI.delete(id);
        setAttendance(attendance.filter(record => record.id !== id));
        setMessage(`Record for ${employeeName} deleted successfully`);
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting:', error);
        setMessage('Failed to delete record');
      }
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterDate('');
    loadAttendance();
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Loading attendance records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h3 className="card-title mb-0">Attendance Dashboard</h3>
        </div>
        <div className="card-body">
          {/* Message Display */}
          {message && (
            <div className={`alert ${
              message.includes('Failed') ? 'alert-danger' : 
              message.includes('Found') || message.includes('successfully') ? 'alert-success' : 'alert-info'
            } alert-dismissible fade show`}>
              {message}
              <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
            </div>
          )}

          {/* Search and Filter Controls */}
          <div className="row mb-4">
            <div className="col-md-4">
              <label className="form-label">Search by Name or ID</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="btn btn-outline-primary" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Filter by Date</label>
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
                <button className="btn btn-outline-secondary" onClick={handleFilterByDate}>
                  Filter
                </button>
              </div>
            </div>
            
            <div className="col-md-4">
              <label className="form-label">&nbsp;</label>
              <div className="d-grid">
                <button className="btn btn-outline-warning" onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="text-primary">Total Records: {attendance.length}</h5>
                <button className="btn btn-success btn-sm" onClick={loadAttendance}>
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          {attendance.length === 0 ? (
            <div className="alert alert-info text-center">
              No attendance records found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Employee Name</th>
                    <th>Employee ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record.id}>
                      <td className="fw-bold">{record.employeeName}</td>
                      <td>{record.employeeID}</td>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${record.status === 'Present' ? 'bg-success' : 'bg-danger'}`}>
                          {record.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(record.id, record.employeeName)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceDashboard;