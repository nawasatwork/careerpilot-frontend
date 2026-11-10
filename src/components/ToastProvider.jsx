import { useCallback, useMemo, useRef, useState } from 'react';
import { ToastContext } from '../lib/toastContext';
import { ToastRegion } from './Toast';

let nextId = 0;

function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef(new Map());

    const dismiss = useCallback((id) => {
        setToasts((list) => list.filter((toast) => toast.id !== id));
        const timer = timers.current.get(id);
        if (timer) {
            window.clearTimeout(timer);
            timers.current.delete(id);
        }
    }, []);

    const toast = useCallback(
        (message, options = {}) => {
            const id = ++nextId;
            const kind = options.kind || 'success';
            // Keep at most three on screen so they never stack over the page.
            setToasts((list) => [...list.slice(-2), { id, message, kind }]);
            const timer = window.setTimeout(() => dismiss(id), options.duration ?? 4200);
            timers.current.set(id, timer);
            return id;
        },
        [dismiss]
    );

    const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastRegion toasts={toasts} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
}

export default ToastProvider;
