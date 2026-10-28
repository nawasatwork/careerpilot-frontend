import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/auth/register', {
                name,
                email,
                password
            });

            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed')
        }
    }

    return (
        <div>
            <h1>CareerPilot</h1>
            <h2>Register</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">Register</button>
            </form>
            <p>Already registered? <a href="/login">Login</a></p>
        </div>
    );
}

export default Register;