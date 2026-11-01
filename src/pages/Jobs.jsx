import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        async function getJobs() {
            try {
                const res = await axios.get('http://localhost:5000/jobs/match', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setJobs(res.data.jobs);
            } catch (err) {
                console.log(err.response?.data);
                setError(err.response?.data?.error || 'Jobs matching failed');
            } finally {
                setLoading(false);
            }
        }

        getJobs();
    }, []);

    if (loading) return (<><Navbar /><p>Finding your matches...</p></>);
    if (error) return (<><Navbar /><p style={{ color: 'red' }}>{error}</p></>);
    
    return (
        <>
            <Navbar />
            <div className="container">
                <h1>Job Matches</h1>
                {jobs.map((job, index) => (
                    <div key={index} className="card">
                        <h3>{job.title}</h3>
                        <p>{job.company} - {job.location}</p>
                        <p>Match Score: <span className="badge">{job.score}/10</span></p>
                        <p>{job.reason}</p>
                        <div className="actions">
                            <a href={job.url} target="_blank" rel="noopener noreferrer">Apply</a>
                            <button onClick={() => navigate('/cover-letter', { state: { job } })}>
                                Write cover letter
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Jobs;