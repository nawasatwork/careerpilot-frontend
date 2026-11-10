import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Client-side navigation keeps the old scroll position; reset it and move focus
// to the new page so keyboard and screen-reader users are not stranded.
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        const main = document.getElementById('main');
        if (main) {
            main.focus({ preventScroll: true });
        }
    }, [pathname]);

    return null;
}

export default ScrollToTop;
