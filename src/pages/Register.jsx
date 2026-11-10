import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import Input from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api, getErrorMessage } from '../lib/api';
import { useToast } from '../lib/useToast';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useDocumentTitle('Create account');

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/register', { name, email, password });
            toast('Account created. Sign in to continue.');
            navigate('/login');
        } catch (err) {
            setError(getErrorMessage(err, 'Registration failed'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthShell
            heading="Start matching jobs in minutes"
            footer={
                <>
                    Already registered?{' '}
                    <Link to="/login" className="font-medium text-accent hover:underline">Sign in</Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="elevate rounded-2xl border border-border bg-surface p-6">
                {error && <Alert className="mb-4">{error}</Alert>}

                <label htmlFor="name" className="mb-1 block text-sm text-muted">Name</label>
                <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                />

                <label htmlFor="email" className="mb-1 mt-4 block text-sm text-muted">Email</label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    spellCheck={false}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                />

                <label htmlFor="password" className="mb-1 mt-4 block text-sm text-muted">Password</label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    minLength={8}
                    required
                />

                <Button type="submit" className="mt-6 w-full" disabled={loading}>
                    {loading && <Spinner className="h-3.5 w-3.5" />}
                    Create account
                </Button>
            </form>
        </AuthShell>
    );
}

export default Register;
