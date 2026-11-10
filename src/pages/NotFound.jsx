import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function NotFound() {
    useDocumentTitle('Not found');

    return (
        <main id="main" tabIndex={-1} className="grid min-h-screen place-items-center px-4 focus:outline-none">
            <div className="animate-rise text-center">
                <p className="text-gradient text-6xl font-bold tracking-tight">404</p>
                <p className="mt-2 text-muted">This page does not exist.</p>
                <Link to="/dashboard" className="mt-6 inline-block font-medium text-accent hover:underline">
                    Back to dashboard
                </Link>
            </div>
        </main>
    );
}

export default NotFound;
