import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('/api/jobs', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setJobs(res.data))
      .catch(err => {
        // if unauthorized, clear token and redirect
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.error(err);
          setError('Failed to load jobs. Please try again later.');
        }
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {jobs.map(job => (
          <li key={job._id}>{job.title} at {job.company}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;