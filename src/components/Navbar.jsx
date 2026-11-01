import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }

    return (
        <nav className="navbar">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/resume">Resume</Link>
            <Link to="/cover-letter">Cover Letter</Link>
            <button onClick={handleLogout}>Logout</button>
        </nav>
    )
}

export default Navbar;