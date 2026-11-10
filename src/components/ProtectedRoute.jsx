import { Navigate, useLocation } from 'react-router-dom';
import { isTokenValid } from '../lib/auth';

// UX-only guard. The backend middleware is the real security check.
function ProtectedRoute({ children }) {
    const location = useLocation();

    if (!isTokenValid()) {
        const next = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?next=${next}`} replace />;
    }

    return children;
}

export default ProtectedRoute;
