import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import Badge from '../components/Badge';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api, getErrorMessage } from '../lib/api';
import { useToast } from '../lib/useToast';

const MAX_BYTES = 5 * 1024 * 1024;

function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    useDocumentTitle('Upload resume');

    function chooseFile(next) {
        setError('');
        setResult(null);

        if (!next) {
            setFile(null);
            return;
        }
        if (next.type !== 'application/pdf' && !next.name.toLowerCase().endsWith('.pdf')) {
            setError('Please choose a PDF file.');
            return;
        }
        if (next.size > MAX_BYTES) {
            setError('That file is larger than 5 MB.');
            return;
        }
        setFile(next);
    }

    async function handleUpload() {
        setError('');
        if (!file) {
            setError('Please choose a PDF file first.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('resume', file);
            const { data } = await api.post('/profile/resume', formData);
            setResult(data);
            setFile(null);
            toast('Resume parsed. Your profile has been updated.');
        } catch (err) {
            setError(getErrorMessage(err, 'Resume upload failed'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />
            <main id="main" tabIndex={-1} className="mx-auto max-w-2xl px-4 py-8 focus:outline-none">
                <PageHeader
                    eyebrow="Resume"
                    title="Upload Resume"
                    subtitle="We read the PDF and fill your profile. Nothing is invented."
                />

                <Card>
                    <input
                        id="resume-file"
                        type="file"
                        accept="application/pdf,.pdf"
                        className="sr-only"
                        onChange={(event) => chooseFile(event.target.files?.[0] || null)}
                    />
                    <label
                        htmlFor="resume-file"
                        className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-dashed border-border bg-bg/60 px-6 py-12 text-center transition-colors hover:border-accent/60 focus-within:border-accent"
                    >
                        <span className="font-semibold text-fg">{file ? file.name : 'Choose a PDF'}</span>
                        <span className="text-sm text-muted">
                            {file
                                ? `${(file.size / 1024 / 1024).toFixed(1)} MB · click to choose a different file`
                                : 'PDF only, up to 5 MB'}
                        </span>
                    </label>

                    {error && <Alert className="mt-4">{error}</Alert>}

                    <div className="mt-5 flex justify-end">
                        <Button onClick={handleUpload} disabled={loading || !file}>
                            {loading && <Spinner className="h-3.5 w-3.5" />}
                            Upload and parse
                        </Button>
                    </div>
                </Card>

                {result && (
                    <Card className="animate-rise mt-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Parsed</h2>
                        <p className="mt-2 text-sm text-fg">
                            {(result.parsed?.skills?.length || 0)} skills found
                            {result.parsed?.experience !== null && result.parsed?.experience !== undefined
                                ? ` · ${result.parsed.experience} years of experience`
                                : ''}
                            {result.parsed?.targetRole ? ` · target: ${result.parsed.targetRole}` : ''}
                        </p>

                        {result.parsed?.skills?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {result.parsed.skills.map((skill) => (
                                    <Badge key={skill} className="bg-accent/15 text-accent">{skill}</Badge>
                                ))}
                            </div>
                        )}

                        {result.warnings?.length > 0 && (
                            <div className="mt-4 rounded-lg border border-warn/30 bg-warn/10 p-3">
                                <p className="text-sm font-semibold text-warn">Check these</p>
                                <ul className="mt-1 list-disc space-y-1 ps-5 text-sm text-warn">
                                    {result.warnings.map((warning) => (
                                        <li key={warning}>{warning}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-5 flex flex-wrap gap-2">
                            <Button onClick={() => window.location.assign('/profile')}>Review profile</Button>
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center justify-center rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-semibold text-fg transition-colors hover:border-accent/60"
                            >
                                Dashboard
                            </Link>
                        </div>
                    </Card>
                )}
            </main>
        </>
    );
}

export default ResumeUpload;
