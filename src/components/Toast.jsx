const ICONS = {
    success: '✓',
    error: '✕',
    info: 'i'
};

export function ToastRegion({ toasts, onDismiss }) {
    return (
        <div
            aria-live="polite"
            aria-atomic="false"
            className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end"
        >
            {toasts.map((toast) => {
                const isError = toast.kind === 'error';
                return (
                    <div
                        key={toast.id}
                        role="status"
                        className={`animate-rise pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-xl backdrop-blur ${
                            isError
                                ? 'border-danger/40 bg-danger/15 text-danger'
                                : 'border-accent/40 bg-surface/95 text-fg'
                        }`}
                    >
                        <span
                            aria-hidden="true"
                            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                                isError ? 'bg-danger/20' : 'bg-accent/20 text-accent'
                            }`}
                        >
                            {ICONS[isError ? 'error' : 'success']}
                        </span>
                        <p className="flex-1 leading-snug">{toast.message}</p>
                        <button
                            type="button"
                            onClick={() => onDismiss(toast.id)}
                            aria-label="Dismiss notification"
                            className="shrink-0 rounded text-muted transition-colors hover:text-fg"
                        >
                            ×
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default ToastRegion;
