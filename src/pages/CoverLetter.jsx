import { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useLocation } from 'react-router-dom'


function CoverLetter() {
    const { state } = useLocation();
    const [job, setJob] = useState(state?.job?.title ?? '');
    const [company, setCompany] = useState(state?.job?.company ?? '');
    const [description, setDescription] = useState(state?.job?.description ?? '');
    const [coverLetter, setCoverLetter] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function generateCoverLetter() {
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/jobs/cover-letter', {
                jobTitle: job,
                company,
                jobDescription: description
            },
            { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCoverLetter(res.data.coverLetter);

        } catch (err) {
            setError(err.response?.data?.error || 'Cover letter generation failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />
            <div className="container card">
                <h1>Cover Letter</h1>
                <input type="text" placeholder="job" value={job} onChange={(e) => setJob(e.target.value)} />
                <input type="text" placeholder="company" value={company} onChange={(e) => setCompany(e.target.value)} />
                <textarea placeholder="job description" value={description} onChange={(e) => setDescription(e.target.value)} />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button onClick={generateCoverLetter} disabled={loading}>
                    {loading ? 'Generating...' : 'Generate'}
                </button>
                {coverLetter && <p style={{whiteSpace: 'pre-wrap'}}>{coverLetter}</p>}
            </div>
        </>
    )
}

export default CoverLetter;