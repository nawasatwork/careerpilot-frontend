import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api, getErrorMessage } from '../lib/api';
import { useToast } from '../lib/useToast';
import { useApi } from '../hooks/useApi';

const QUICK_ACTIONS = [
    { to: '/jobs', title: 'Find jobs', text: 'Evidence-based matches from your resume.' },
    { to: '/resume', title: 'Update resume', text: 'Re-parse your profile from a PDF.' },
    { to: '/cover-letter', title: 'Cover letter', text: 'Draft a tailored letter in seconds.' },
];

function Dashboard() {
    const navigate = useNavigate();
    const { toast } = useToast();
    useDocumentTitle('Dashboard');

    const { data: user, loading, error, run } = useApi(() => api.get('/profile').then((res) => res.data));
    const [fileMissing, setFileMissing] = useState(false);

    useEffect(() => {
        run();
    }, [run]);

    async function handleDownload() {
        try {
            const res = await api.get('/profile/resume/download', { responseType: 'blob' });
            const url = URL.createObjectURL(res.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = user.resumeFileName || 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            if (err.response?.status === 410) {
                setFileMissing(true);
                return;
            }
            toast(getErrorMessage(err, 'Could not download the resume'), { kind: 'error' });
        }
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-10 text-muted">
                    <Spinner /> Loading your profile
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-10 focus:outline-none">
                    <Alert>{error}</Alert>
                </main>
            </>
        );
    }

    if (!user) {
        return (
            <>
                <Navbar />
                <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-10 focus:outline-none">
                    <EmptyState
                        title="No profile yet"
                        message="Add your details or upload a resume to get started."
                        action={<Button onClick={() => navigate('/profile')}>Set up profile</Button>}
                    />
                </main>
            </>
        );
    }

    const skills = user.skills || [];
    const facts = [
        { label: 'Current role', value: user.currentRole },
        { label: 'Target role', value: user.targetRole },
        { label: 'Location', value: user.location },
    ];
    const hasFile = Boolean(user.resume) && !fileMissing;

    return (
        <>
            <Navbar />
            <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-8 focus:outline-none">
                <header className="elevate relative mb-6 overflow-hidden rounded-2xl border border-border bg-surface p-6 sm:p-8">
                    <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
                    <div className="relative">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Workspace</p>
                        <h1 className="text-gradient mt-1 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                            {user.name}
                        </h1>
                        <p className="mt-2 max-w-md text-sm text-muted">
                            Your job-hunt workspace at a glance.
                        </p>
                    </div>
                </header>

                <div className="grid gap-4 md:grid-cols-3">
                    {facts.map((fact) => (
                        <Card key={fact.label}>
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{fact.label}</p>
                            </div>
                            <p className="mt-2 break-words font-semibold text-fg">{fact.value || 'Not set'}</p>
                        </Card>
                    ))}
                </div>

                <Card className="mt-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Skills</h2>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>Edit profile</Button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {skills.length > 0 ? (
                            skills.map((skill) => (
                                <Badge key={skill} className="bg-accent/15 text-accent">{skill}</Badge>
                            ))
                        ) : (
                            <p className="text-sm text-muted">
                                No skills yet. <Link to="/profile" className="text-accent hover:underline">Add them manually</Link> or upload a resume.
                            </p>
                        )}
                    </div>
                </Card>

                <Card className="mt-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Resume</h2>
                    {hasFile ? (
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={handleDownload}
                                className="group inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:border-accent/60"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4 shrink-0 text-accent"
                                    aria-hidden="true"
                                >
                                    <path d="M14 3v5h5" />
                                    <path d="M6 3h8l5 5v13H6z" />
                                </svg>
                                <span className="max-w-[16rem] truncate group-hover:text-accent-hover">
                                    {user.resumeFileName || 'resume.pdf'}
                                </span>
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-3.5 w-3.5 shrink-0 text-muted group-hover:text-accent"
                                    aria-hidden="true"
                                >
                                    <path d="M12 3v12" />
                                    <path d="m7 10 5 5 5-5" />
                                    <path d="M5 21h14" />
                                </svg>
                            </button>
                            <Button variant="secondary" onClick={() => navigate('/resume')}>Replace</Button>
                        </div>
                    ) : user.resume ? (
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-muted">
                                The uploaded file is no longer stored on this server. Your parsed profile is still saved.
                            </p>
                            <Button onClick={() => navigate('/resume')}>Re-upload</Button>
                        </div>
                    ) : (
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-muted">No resume yet. Upload one to unlock matching.</p>
                            <Button onClick={() => navigate('/resume')}>Upload resume</Button>
                        </div>
                    )}
                </Card>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {QUICK_ACTIONS.map((action) => (
                        <Link
                            key={action.to}
                            to={action.to}
                            className="elevate group rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60"
                        >
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-fg group-hover:text-accent">{action.title}</p>
                                <span className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent">
                                    →
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-muted">{action.text}</p>
                        </Link>
                    ))}
                </div>
            </main>
        </>
    );
}

export default Dashboard;
