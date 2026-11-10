import { Component } from 'react';

// Catches render errors anywhere below and shows a recovery screen
// instead of React's default blank page.
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error('UI error:', error, info?.componentStack);
    }

    render() {
        if (this.state.error) {
            return (
                <div className="grid min-h-screen place-items-center px-4">
                    <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
                        <h1 className="text-lg font-semibold text-fg">Something went wrong</h1>
                        <p className="mt-2 text-sm text-muted">
                            The page hit an unexpected error. Reload to keep going.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
                        >
                            Reload page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
