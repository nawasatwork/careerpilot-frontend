import Button from './Button';

const applyClasses =
    'inline-flex items-center justify-center rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs font-semibold text-fg transition-colors hover:border-accent/60';

function scoreTone(score) {
    if (!score) {
        return { text: 'text-muted', stroke: 'stroke-border' };
    }
    if (score >= 8) {
        return { text: 'text-accent', stroke: 'stroke-accent' };
    }
    if (score >= 5) {
        return { text: 'text-warn', stroke: 'stroke-warn' };
    }
    return { text: 'text-danger', stroke: 'stroke-danger' };
}

function JobCard({ job, onCoverLetter, onInterview, style }) {
    const tone = scoreTone(job.score);
    const percent = Math.max(0, Math.min(100, (Number(job.score) || 0) * 10));
    const gaugeLabel = job.score === 0 ? 'Not scored: no concrete skills in the posting' : `${job.score} out of 10 match`;

    return (
        <article
            style={style}
            className="animate-rise elevate rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60"
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="break-words text-base font-semibold leading-snug text-fg">{job.title}</h3>
                    <p className="mt-0.5 break-words text-sm text-muted">
                        {job.company}
                        {job.location ? ` · ${job.location}` : ''}
                    </p>
                </div>

                <div
                    role="img"
                    aria-label={gaugeLabel}
                    title={gaugeLabel}
                    className="relative h-14 w-14 shrink-0"
                >
                    <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90" aria-hidden="true">
                        <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="2.5" className="stroke-surface-2" />
                        <circle
                            cx="18"
                            cy="18"
                            r="15.9"
                            fill="none"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeDasharray={`${percent} ${100 - percent}`}
                            className={tone.stroke}
                        />
                    </svg>
                    <div className="absolute inset-0 grid place-items-center">
                        <span className={`text-sm font-bold tabular-nums ${tone.text}`}>{job.score === 0 ? '—' : job.score}</span>
                    </div>
                </div>
            </div>

            {job.reason && <p className="mt-3 break-words text-sm text-fg/80">{job.reason}</p>}

            {(job.matchedSkills?.length > 0 || job.missingSkills?.length > 0 || job.preferredMissing?.length > 0) && (
                <div className="mt-2 space-y-1 text-xs">
                    {job.matchedSkills?.length > 0 && (
                        <p className="break-words text-muted">
                            <span className="font-medium text-accent">Matches:</span> {job.matchedSkills.join(', ')}
                        </p>
                    )}
                    {job.missingSkills?.length > 0 && (
                        <p className="break-words text-muted">
                            <span className="font-medium text-warn">Missing required:</span> {job.missingSkills.join(', ')}
                        </p>
                    )}
                    {job.preferredMissing?.length > 0 && (
                        <p className="break-words text-muted">
                            <span className="font-medium">Nice-to-have:</span> {job.preferredMissing.join(', ')}
                        </p>
                    )}
                </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <a href={job.url} target="_blank" rel="noopener noreferrer" className={applyClasses}>
                    Apply
                </a>
                {job.applyType && (
                    <span
                        title={job.applyType === 'direct' ? 'Opens the company’s own application page' : `Opens on ${job.applyVia}`}
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                            job.applyType === 'direct' ? 'bg-accent/15 text-accent' : 'bg-surface-2 text-muted'
                        }`}
                    >
                        {job.applyType === 'direct' ? 'Company site' : `via ${job.applyVia}`}
                    </span>
                )}
                <Button variant="secondary" size="sm" onClick={onCoverLetter}>Cover letter</Button>
                <Button variant="secondary" size="sm" onClick={onInterview}>Interview prep</Button>
                <span className="ms-auto flex items-center gap-2 text-xs text-muted">
                    {job.source && (
                        job.sourceUrl ? (
                            <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">
                                via {job.source}
                            </a>
                        ) : (
                            <span>via {job.source}</span>
                        )
                    )}
                    {job.posted && <span>{new Date(job.posted).toLocaleDateString()}</span>}
                </span>
            </div>
        </article>
    );
}

export default JobCard;
