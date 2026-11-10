const TONES = {
    danger: 'border-danger/30 bg-danger/10 text-danger',
    warn: 'border-warn/30 bg-warn/10 text-warn',
    info: 'border-border bg-surface-2 text-fg'
};

function Alert({ children, tone = 'danger', className = '' }) {
    return (
        <div role="alert" className={`rounded-lg border px-4 py-3 text-sm ${TONES[tone]} ${className}`}>
            {children}
        </div>
    );
}

export default Alert;
