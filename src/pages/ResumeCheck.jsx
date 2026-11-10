import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';

const VERDICTS = {
    'ats-friendly': { label: 'ATS-friendly', badge: 'bg-accent/15 text-accent', ring: 'stroke-accent' },
    'needs-work': { label: 'Needs work', badge: 'bg-warn/15 text-warn', ring: 'stroke-warn' },
    'not-ats-friendly': { label: 'Not ATS-friendly', badge: 'bg-danger/15 text-danger', ring: 'stroke-danger' },
};

const STATUS = {
    pass: { glyph: '✓', className: 'text-accent' },
    warn: { glyph: '!', className: 'text-warn' },
    fail: { glyph: '✕', className: 'text-danger' },
    skip: { glyph: '–', className: 'text-muted' },
};

function ResumeCheck() {
    useDocumentTitle('Resume check');

    const { data: report, loading, error, run } = useApi((deep) =>
        api.post(`/profile/resume-check${deep ? '?deep=1' : ''}`).then((res) => res.data.report)
    );

    useEffect(() => {
        run(false);
    }, [run]);

    const verdict = report ? (VERDICTS[report.verdict] || VERDICTS['needs-work']) : null;
    const needsResume = Boolean(error) && /upload|resume first/i.test(error);

    return (
        <>
            <Navbar />
            <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-4 py-8 focus:outline-none">
                <PageHeader
                    eyebrow="ATS"
                    title="Resume Check"
                    subtitle="Real, rule-based ATS checks over your resume text."
                />

                {error && !needsResume && <Alert className="mb-4">{error}</Alert>}

                {needsResume && (
                    <Alert className="mb-4">
                        Upload a resume first.{' '}
                        <Link to="/resume" className="font-semibold underline">Go to upload</Link>
                    </Alert>
                )}

                {loading && !report && (
                    <div className="flex items-center gap-3 text-muted">
                        <Spinner /> Running ATS checks
                    </div>
                )}

                {report && (
                    <>
                        <Card>
                            <div className="flex flex-wrap items-center gap-6">
                                <div
                                    role="img"
                                    aria-label={`ATS score ${report.score} out of 100, ${verdict.label}`}
                                    className="relative h-20 w-20 shrink-0"
                                >
                                    <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90" aria-hidden="true">
                                        <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="2.5" className="stroke-surface-2" />
                                        <circle
                                            cx="18"
                                            cy="18"
                                            r="15.9"
                                            fill="none"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeDasharray={`${report.score} ${100 - report.score}`}
                                            className={verdict.ring}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 grid place-items-center">
                                        <span className="text-lg font-bold tabular-nums text-fg">{report.score}</span>
                                    </div>
                                </div>

                                <div>
                                    <Badge className={verdict.badge}>{verdict.label}</Badge>
                                    <p className="mt-2 text-sm text-muted">
                                        {report.passed} passed · {report.warned} warnings · {report.failed} failed
                                    </p>
                                </div>

                                <div className="ms-auto flex flex-wrap gap-2">
                                    <Button variant="secondary" onClick={() => run(false)} disabled={loading}>
                                        {loading && <Spinner className="h-3.5 w-3.5" />}
                                        Re-run
                                    </Button>
                                    <Button onClick={() => run(true)} disabled={loading}>
                                        {loading && <Spinner className="h-3.5 w-3.5" />}
                                        Deep review
                                    </Button>
                                </div>
                            </div>

                            {report.criticalIssues?.length > 0 && (
                                <div className="mt-5 rounded-lg border border-danger/30 bg-danger/10 p-3">
                                    <p className="text-sm font-semibold text-danger">Critical issues, fix these first</p>
                                    <ul className="mt-1 list-disc space-y-1 ps-5 text-sm text-danger">
                                        {report.criticalIssues.map((issue) => (
                                            <li key={issue}>{issue}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </Card>

                        <Card className="mt-4">
                            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Checks</h2>
                            <ul className="divide-y divide-border">
                                {report.checks.map((check) => {
                                    const status = STATUS[check.status] || STATUS.skip;
                                    return (
                                        <li key={check.id} className="flex gap-3 py-2.5">
                                            <span className={`mt-0.5 w-5 shrink-0 text-center font-bold ${status.className}`}>
                                                {status.glyph}
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium text-fg">{check.label}</p>
                                                <p className="text-xs text-muted">{check.detail}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </Card>

                        {report.notes?.length > 0 && (
                            <Card className="mt-4">
                                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                                    Not verifiable from extracted text
                                </h2>
                                <ul className="list-disc space-y-1 ps-5 text-sm text-muted">
                                    {report.notes.map((note) => (
                                        <li key={note}>{note}</li>
                                    ))}
                                </ul>
                            </Card>
                        )}

                        {report.aiReview && (
                            <Card className="animate-rise mt-4">
                                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">AI review</h2>
                                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-fg/90">{report.aiReview}</p>
                            </Card>
                        )}
                    </>
                )}
            </main>
        </>
    );
}

export default ResumeCheck;
