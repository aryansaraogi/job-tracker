import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // or 'list'

  const statuses = [
    'wishlist',
    'applied',
    'interview',
    'offer',
    'rejected',
  ];

  const fetchJobs = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('/api/jobs', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setJobs(res.data))
      .catch(err => {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.error(err);
          setError('Failed to load jobs. Please try again later.');
        }
      });
  };

  useEffect(() => {
    fetchJobs();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const updateJobStatus = async (jobId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        `/api/jobs/${jobId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(prev => prev.map(j => (j._id === jobId ? res.data : j)));
    } catch (err) {
      console.error(err);
      setError('Unable to update job status.');
    }
  };

  // add new job form state/handler
  const [newJob, setNewJob] = useState({ title: '', company: '', url: '', portal: '', status: 'wishlist' });

  const handleAddJob = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('/api/jobs', newJob, { headers: { Authorization: `Bearer ${token}` } });
      setJobs(prev => [...prev, res.data]);
      setNewJob({ title: '', company: '', url: '', portal: '', status: 'wishlist' });
    } catch (err) {
      console.error(err);
      setError('Failed to add job.');
    }
  };

  const grouped = statuses.reduce((acc, s) => {
    acc[s] = jobs.filter(j => j.status === s);
    return acc;
  }, {});


  return (
    <div className="container">
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <form onSubmit={handleAddJob}>
        <h4>Add Job</h4>
        <input
          placeholder="Title"
          value={newJob.title}
          onChange={e => setNewJob({...newJob, title: e.target.value})}
          required
        />
        <input
          placeholder="Company"
          value={newJob.company}
          onChange={e => setNewJob({...newJob, company: e.target.value})}
        />
        <input
          placeholder="URL"
          value={newJob.url}
          onChange={e => setNewJob({...newJob, url: e.target.value})}
        />
        <input
          placeholder="Portal"
          value={newJob.portal}
          onChange={e => setNewJob({...newJob, portal: e.target.value})}
        />
        <button type="submit">Add</button>
      </form>
      <div className="view-toggle">
        <label>View: </label>
        <select value={viewMode} onChange={e => setViewMode(e.target.value)}>
          <option value="kanban">Kanban</option>
          <option value="list">List</option>
        </select>
      </div>
      {error && <p className="error">{error}</p>}
      {viewMode === 'kanban' ? (
        <div className="kanban-board">
          {statuses.map(status => (
            <div key={status} className="kanban-column">
              <h3 style={{ textTransform: 'capitalize' }}>{status}</h3>
              {grouped[status].map(job => (
                <div key={job._id} className="job-card">
                  <strong>{job.title}</strong><br />
                  <small>{job.company}</small><br />
                  <select
                    value={job.status}
                    onChange={e => updateJobStatus(job._id, e.target.value)}
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>
                  <select
                    value={job.status}
                    onChange={e => updateJobStatus(job._id, e.target.value)}
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;