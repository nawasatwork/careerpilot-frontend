import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    async function fetchProfile() {
      try {
        const res = await axios.get('http://localhost:5000/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }

    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="container card">
        <h1>Welcome, {user.name}</h1>
        <p>Current Role: {user.currentRole || 'Not set'}</p>
        <p>Target Role: {user.targetRole || 'Not set'}</p>
        <p>Skills: {user.skills?.join(', ') || 'Not set'}</p>
        <p>Location: {user.location || 'Not set'}</p>
        <div className="card">
          <h3>Resume</h3>
          {user.resume ? (
            <>
              <p>Resume uploaded ✓</p>
              <p>{user.resume.slice(0, 200)}...</p>
              <Link to="/resume">Replace resume</Link>
            </>
          ) : (
            <>
              <p>No resume yet. Upload one to unlock job matching.</p>
              <Link to="/resume">Upload resume</Link>
            </>
          )}
        </div>
      </div>
    </>

  );
}

export default Dashboard;