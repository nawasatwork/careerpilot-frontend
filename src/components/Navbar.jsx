import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from './Button';
import Logo from './Logo';
import { clearSession } from '../lib/auth';

const LINKS = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/jobs', label: 'Jobs' },
    { to: '/cover-letter', label: 'Cover Letter' },
    { to: '/interview-prep', label: 'Interview Prep' },
    { to: '/resume', label: 'Resume' },
    { to: '/resume-check', label: 'Resume Check' },
    { to: '/profile', label: 'Profile' },
];

function linkClass({ isActive }) {
    return `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        isActive ? 'bg-surface-2 text-fg' : 'text-muted hover:bg-surface-2 hover:text-fg'
    }`;
}

function Navbar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const toggleRef = useRef(null);

    // Close the mobile menu whenever the route changes.
    function closeMenu() {
        setOpen(false);
    }

    // Escape closes the menu and returns focus to the toggle.
    useEffect(() => {
        function onKeyDown(event) {
            if (event.key === 'Escape' && open) {
                setOpen(false);
                toggleRef.current?.focus();
            }
        }
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open]);

    function handleLogout() {
        clearSession();
        navigate('/login');
    }

    return (
        <header className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur">
            <nav className="mx-auto flex max-w-5xl items-center gap-1 px-4 py-3">
                <Logo className="shrink-0" size={34} />

                <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex">
                    {LINKS.map((link) => (
                        <NavLink key={link.to} to={link.to} className={linkClass}>
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                <div className="ms-auto hidden lg:block">
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>

                <button
                    ref={toggleRef}
                    type="button"
                    aria-expanded={open}
                    aria-controls="mobile-nav"
                    onClick={() => setOpen((value) => !value)}
                    className="ms-auto inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-2 text-fg transition-colors hover:border-accent/60 lg:hidden"
                >
                    <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
                        {open ? (
                            <>
                                <path d="M6 6l12 12" />
                                <path d="M18 6L6 18" />
                            </>
                        ) : (
                            <>
                                <path d="M4 7h16" />
                                <path d="M4 12h16" />
                                <path d="M4 17h16" />
                            </>
                        )}
                    </svg>
                </button>
            </nav>

            {open && (
                <div id="mobile-nav" className="border-t border-border bg-surface px-4 py-3 lg:hidden">
                    <div className="flex flex-col gap-1">
                        {LINKS.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                        isActive ? 'bg-surface-2 text-fg' : 'text-muted hover:bg-surface-2 hover:text-fg'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                        <Button variant="ghost" className="mt-1 justify-start" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;
