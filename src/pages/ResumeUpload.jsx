import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function handleUpload() {
        try {
            const url = 'http://localhost:5000/profile/resume';
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('resume', file);

            await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Resume upload failed');
        }
    }

    return (
        <div>
            <h1>Upload Resume</h1>
            <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <button onClick={handleUpload}>Upload</button>
            {error && <p>{error}</p>}
        </div>
    );
}

export default ResumeUpload;