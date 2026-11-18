import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import Input from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api, getErrorMessage } from '../lib/api';
import { setSession } from '../lib/auth';

// Public showcase credentials. This is a demo account with fictional sample data,
// so it is safe to show. Prefilled to keep a portfolio walkthrough friction-free.
const DEMO_EMAIL = 'demo@careerpilot.app';
const DEMO_PASSWORD = 'DemoCareer2026';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useDocumentTitle('Sign in');

    const nextParam = searchParams.get('next');
    // Only allow internal paths, never an absolute URL.
    const next = nextParam && nextParam.startsWith('/') ? nextParam : '/dashboard';

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            setSession(res.data.token, res.data.user);
            navigate(next, { replace: true });
        } catch (err) {
            setError(getErrorMessage(err, 'Login failed'));
        } finally {
            setLoading(false);
        }
    }

    function fillDemo() {
        setEmail(DEMO_EMAIL);
        setPassword(DEMO_PASSWORD);
        setError('');
    }

    return (
        <AuthShell
            heading="Sign in to your job-hunt workspace"
            footer={
                <>
                    No account?{' '}
                    <Link to="/register" className="font-medium text-accent hover:underline">Create one</Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="elevate rounded-2xl border border-border bg-surface p-6">
                {error && <Alert className="mb-4">{error}</Alert>}

                <label htmlFor="email" className="mb-1 block text-sm text-muted">Email</label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    spellCheck={false}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(error)}
                    required
                />

                <label htmlFor="password" className="mb-1 mt-4 block text-sm text-muted">Password</label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    aria-invalid={Boolean(error)}
                    required
                />

                <Button type="submit" className="mt-6 w-full" disabled={loading}>
                    {loading && <Spinner className="h-3.5 w-3.5" />}
                    Sign in
                </Button>
            </form>

            <div className="mt-4 rounded-xl border border-border bg-surface-2/60 p-4 text-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Demo account</p>
                <p className="mt-2 text-muted">
                    Explore the app with a populated profile. The résumé is fictional sample data.
                </p>
                <div className="mt-3 space-y-1 font-mono text-xs text-fg">
                    <p>{DEMO_EMAIL}</p>
                    <p>{DEMO_PASSWORD}</p>
                </div>
                <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={fillDemo}>
                    Use demo account
                </Button>
            </div>
        </AuthShell>
    );
}

export default Login;
