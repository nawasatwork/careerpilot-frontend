import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api, getErrorMessage } from '../lib/api';
import { useToast } from '../lib/useToast';

function CoverLetter() {
    const { state } = useLocation();
    const { toast } = useToast();
    useDocumentTitle('Cover letter');

    const [jobTitle, setJobTitle] = useState(state?.job?.title ?? '');
    const [company, setCompany] = useState(state?.job?.company ?? '');
    const [jobDescription, setJobDescription] = useState(state?.job?.description ?? '');
    const [coverLetter, setCoverLetter] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const cameFromJob = Boolean(state?.job);

    async function generate() {
        setError('');
        if (!jobTitle || !company || !jobDescription) {
            setError('Job title, company and description are required.');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/jobs/cover-letter', { jobTitle, company, jobDescription });
            setCoverLetter(res.data.coverLetter);
        } catch (err) {
            setError(getErrorMessage(err, 'Cover letter generation failed'));
        } finally {
            setLoading(false);
        }
    }

    async function copy() {
        try {
            await navigator.clipboard.writeText(coverLetter);
            toast('Cover letter copied.');
        } catch {
            toast('Could not copy to clipboard.', { kind: 'error' });
        }
    }

    return (
        <>
            <Navbar />
            <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-8 focus:outline-none">
                <PageHeader
                    eyebrow="Write"
                    title="Cover Letter"
                    subtitle="A tailored letter built only from your real experience."
                />

                {!cameFromJob && (
                    <p className="mb-4 text-sm text-muted">
                        Tip: open a job in{' '}
                        <Link to="/jobs" className="text-accent hover:underline">Jobs</Link>{' '}
                        and press Cover letter to prefill these fields.
                    </p>
                )}

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <label htmlFor="jobTitle" className="mb-1 block text-sm text-muted">Job title</label>
                        <Input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Frontend Engineer" />

                        <label htmlFor="company" className="mb-1 mt-4 block text-sm text-muted">Company</label>
                        <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." />

                        <label htmlFor="jobDescription" className="mb-1 mt-4 block text-sm text-muted">Job description</label>
                        <Textarea
                            id="jobDescription"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description…"
                            className="min-h-40"
                        />

                        {error && <Alert className="mt-4">{error}</Alert>}

                        <div className="mt-5 flex justify-end">
                            <Button onClick={generate} disabled={loading} aria-busy={loading}>
                                {loading && <Spinner className="h-3.5 w-3.5" />}
                                {loading ? 'Writing' : 'Generate'}
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <div className="mb-3 flex items-center justify-between gap-2">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Preview</h2>
                            {coverLetter && <Button variant="ghost" size="sm" onClick={copy}>Copy</Button>}
                        </div>
                        {coverLetter ? (
                            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-fg/90">{coverLetter}</p>
                        ) : (
                            <p className="text-sm text-muted">Your generated letter will appear here.</p>
                        )}
                    </Card>
                </div>
            </main>
        </>
    );
}

export default CoverLetter;
