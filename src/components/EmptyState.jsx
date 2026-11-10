function EmptyState({ title, message, action }) {
    return (
        <div className="animate-rise rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-14 text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-lg text-accent">✦</div>
            <p className="font-semibold text-fg">{title}</p>
            {message && <p className="mx-auto mt-1 max-w-md text-sm text-muted">{message}</p>}
            {action && <div className="mt-6 flex justify-center">{action}</div>}
        </div>
    );
}

export default EmptyState;
