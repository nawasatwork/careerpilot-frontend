function Card({ className = '', children }) {
    return <div className={`elevate rounded-2xl border border-border bg-surface p-5 ${className}`}>{children}</div>;
}

export default Card;
