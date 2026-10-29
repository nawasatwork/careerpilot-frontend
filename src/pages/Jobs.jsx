import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState('');
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
            }
        }

        getJobs();
    }, []);

    if (!jobs.length) return <p>Finding your matches...</p>;

    return (
        <div>
            <h1>Job Matches</h1>
            {jobs.map((job, index) => (
                <div key={index}>
                    <h3>{job.title}</h3>
                    <p>{job.company} - {job.location}</p>
                    <p>Match Score: {job.score}/10</p>
                    <p>{job.reason}</p>
                    <a href={job.url} target="_blank">Apply</a>
                </div>
            ))}
        </div>
    )
}

export default Jobs;