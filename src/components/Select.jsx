function Select({ className = '', children, ...props }) {
    return (
        <select
            className={`block w-full rounded-lg border border-border bg-bg px-3 py-2 text-base text-fg transition-colors focus:border-accent sm:text-sm ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}

export default Select;
