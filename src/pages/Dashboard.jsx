import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        navigate('/login');
      }
    }

    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Current Role: {user.currentRole || 'Not set'}</p>
      <p>Target Role: {user.targetRole || 'Not set'}</p>
      <p>Skills: {user.skills?.join(', ') || 'Not set'}</p>
      <p>Location: {user.location || 'Not set'}</p>
      <button onClick={() => {
        localStorage.removeItem('token');
        navigate('/login');
      }}>Logout</button>
    </div>
  );
}

export default Dashboard;