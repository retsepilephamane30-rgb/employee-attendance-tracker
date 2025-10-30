import React, { useState } from 'react';
import { attendanceAPI } from '../services/api';

function AttendanceForm() {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeID: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.employeeName.trim() || !formData.employeeID.trim()) {
      setMessage('Employee Name and ID are required');
      setIsError(true);
      return;
    }

    try {
      await attendanceAPI.create(formData);
      setMessage('Attendance recorded successfully!');
      setIsError(false);
      
      // Reset form
      setFormData({
        employeeName: '',
        employeeID: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });
    } catch (error) {
      console.error('Error submitting attendance:', error);
      setMessage('Failed to record attendance. Please try again.');
      setIsError(true);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title mb-0">Mark Attendance</h3>
            </div>
            <div className="card-body">
              {message && (
                <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="employeeName" className="form-label">
                    Employee Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="employeeName"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="employeeID" className="form-label">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="employeeID"
                    name="employeeID"
                    value={formData.employeeID}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Submit Attendance
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceForm;