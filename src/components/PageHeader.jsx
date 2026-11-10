function PageHeader({ eyebrow, title, subtitle, action }) {
    return (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
                {eyebrow && (
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
                )}
                <h1 className="text-balance text-2xl font-bold tracking-tight text-fg sm:text-3xl">{title}</h1>
                {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

export default PageHeader;
