import { useMemo, useState } from 'react';
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

function InterviewPrep() {
    const { state } = useLocation();
    const { toast } = useToast();
    useDocumentTitle('Interview prep');

    const [jobTitle, setJobTitle] = useState(state?.job?.title ?? '');
    const [company, setCompany] = useState(state?.job?.company ?? '');
    const [jobDescription, setJobDescription] = useState(state?.job?.description ?? '');
    const [prep, setPrep] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const cameFromJob = Boolean(state?.job);

    // The backend returns a strict "Q: ...\n\nA: ..." shape; split it for rendering.
    const pairs = useMemo(() => {
        if (!prep) {
            return [];
        }
        const found = [];
        const blocks = prep.split(/(?=^Q: )/m);

        for (const block of blocks) {
            const match = block.match(/^Q: ([\s\S]*?)\n+A: ([\s\S]*)$/);
            if (match) {
                found.push({ question: match[1].trim(), answer: match[2].trim() });
            }
        }

        return found;
    }, [prep]);

    async function generate() {
        setError('');
        if (!jobTitle || !company || !jobDescription) {
            setError('Job title, company and description are required.');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/jobs/interview-prep', { jobTitle, company, jobDescription });
            setPrep(res.data.interviewPrep);
        } catch (err) {
            setError(getErrorMessage(err, 'Interview prep generation failed'));
        } finally {
            setLoading(false);
        }
    }

    async function copy() {
        try {
            await navigator.clipboard.writeText(prep);
            toast('Interview prep copied.');
        } catch {
            toast('Could not copy to clipboard.', { kind: 'error' });
        }
    }

    return (
        <>
            <Navbar />
            <main id="main" tabIndex={-1} className="mx-auto max-w-4xl px-4 py-8 focus:outline-none">
                <PageHeader
                    eyebrow="Prepare"
                    title="Interview Prep"
                    subtitle="Ten tailored questions with model answers."
                />

                {!cameFromJob && (
                    <p className="mb-4 text-sm text-muted">
                        Tip: open a job in{' '}
                        <Link to="/jobs" className="text-accent hover:underline">Jobs</Link>{' '}
                        and press Interview prep to prefill these fields.
                    </p>
                )}

                <Card>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label htmlFor="jobTitle" className="mb-1 block text-sm text-muted">Job title</label>
                            <Input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Frontend Engineer" />
                        </div>
                        <div>
                            <label htmlFor="company" className="mb-1 block text-sm text-muted">Company</label>
                            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." />
                        </div>
                    </div>

                    <label htmlFor="jobDescription" className="mb-1 mt-4 block text-sm text-muted">Job description</label>
                    <Textarea
                        id="jobDescription"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description…"
                        className="min-h-32"
                    />

                    {error && <Alert className="mt-4">{error}</Alert>}

                    <div className="mt-5 flex justify-end">
                        <Button onClick={generate} disabled={loading} aria-busy={loading}>
                            {loading && <Spinner className="h-3.5 w-3.5" />}
                            {loading ? 'Preparing' : 'Generate questions'}
                        </Button>
                    </div>
                </Card>

                {prep && (
                    <Card className="animate-rise mt-4">
                        <div className="mb-3 flex items-center justify-between gap-2">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Questions</h2>
                            <Button variant="ghost" size="sm" onClick={copy}>Copy</Button>
                        </div>
                        {pairs.length > 0 ? (
                            <ol className="space-y-5">
                                {pairs.map((pair, index) => (
                                    <li key={index}>
                                        <p className="break-words font-semibold leading-snug text-fg">
                                            <span className="me-2 text-accent">{index + 1}.</span>
                                            {pair.question}
                                        </p>
                                        <p className="mt-2 whitespace-pre-wrap break-words border-s-2 border-border ps-3 text-sm leading-relaxed text-fg/80">
                                            {pair.answer}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-fg/90">{prep}</p>
                        )}
                    </Card>
                )}
            </main>
        </>
    );
}

export default InterviewPrep;
