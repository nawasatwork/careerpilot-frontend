import { useState } from 'react';
import axios from 'axios';

function CoverLetter() {
    const [job, setJob] = useState('');
    const [company, setCompany] = useState('');
    const [description, setDescription] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [error, setError] = useState('');

    async function generateCoverLetter() {
        setError('');
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
        }
    }

    return (
        <div>
            <h1>Cover Letter</h1>
            <input type="text" placeholder="job" value={job} onChange={(e) => setJob(e.target.value)} />
            <input type="text" placeholder="company" value={company} onChange={(e) => setCompany(e.target.value)} />
            <textarea placeholder="job description" value={description} onChange={(e) => setDescription(e.target.value)} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={generateCoverLetter}>Generate</button>
            {coverLetter && <p style={{whiteSpace: 'pre-wrap'}}>{coverLetter}</p>}
        </div>
    )
}

export default CoverLetter;