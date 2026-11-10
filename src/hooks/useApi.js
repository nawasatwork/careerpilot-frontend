import { useCallback, useEffect, useRef, useState } from 'react';

// Uniform loading/error/data state for one async operation.
// `run` is stable, so it is safe to call from a useEffect dependency list.
export function useApi(asyncFn) {
    const fnRef = useRef(asyncFn);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Keep the latest callback in a ref without touching it during render.
    useEffect(() => {
        fnRef.current = asyncFn;
    });

    const run = useCallback(async (...args) => {
        setLoading(true);
        setError('');
        try {
            const result = await fnRef.current(...args);
            setData(result);
            return result;
        } catch (err) {
            setError(err?.response?.data?.error || err?.message || 'Request failed');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, run };
}
