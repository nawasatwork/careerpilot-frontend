import Logo from './Logo';

// One shared shell for Login and Register so the two screens cannot drift apart.
function AuthShell({ heading, children, footer }) {
    return (
        <main
            id="main"
            tabIndex={-1}
            className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-10 focus:outline-none"
        >
            <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/15 blur-[100px]" />

            <div className="animate-rise relative w-full max-w-sm">
                <div className="mb-6 text-center">
                    <div className="mb-4 flex justify-center">
                        <Logo size={48} withWordmark={false} />
                    </div>
                    <h1 translate="no" className="text-xl font-bold uppercase tracking-[0.14em] text-fg">
                        CAREER PILOT
                    </h1>
                    <p className="mt-2 text-sm text-muted">{heading}</p>
                </div>

                {children}

                {footer && <div className="mt-4 text-center text-sm text-muted">{footer}</div>}
            </div>
        </main>
    );
}

export default AuthShell;
