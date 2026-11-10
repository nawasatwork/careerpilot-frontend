function Input({ className = '', ...props }) {
    return (
        <input
            className={`block w-full rounded-lg border border-border bg-bg px-3 py-2 text-base text-fg transition-colors placeholder:text-muted focus:border-accent sm:text-sm ${className}`}
            {...props}
        />
    );
}

export default Input;
