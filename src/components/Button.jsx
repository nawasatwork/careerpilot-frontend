const VARIANTS = {
    primary: 'bg-accent text-accent-fg shadow-sm shadow-accent/25 hover:bg-accent-hover',
    secondary: 'border border-border bg-surface-2 text-fg hover:border-accent/60',
    ghost: 'text-muted hover:bg-surface-2 hover:text-fg',
    danger: 'bg-danger text-white hover:brightness-110',
};

const SIZES = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
};

function Button({ variant = 'primary', size = 'md', type = 'button', className = '', children, ...props }) {
    return (
        <button
            type={type}
            className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-[background-color,border-color,color,opacity,transform] duration-150 active:scale-[.98] disabled:pointer-events-none disabled:opacity-50 ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
