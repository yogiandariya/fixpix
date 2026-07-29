import { useEffect, useState } from 'react';

const MOBILE_QUERY = '(max-width: 767px)';
const TABLET_QUERY = '(max-width: 1023px)';

export const useBreakpoint = () => {
    const getMatches = () => {
        if (typeof window === 'undefined') {
            return { isMobile: false, isTablet: false };
        }

        return {
            isMobile: window.matchMedia(MOBILE_QUERY).matches,
            isTablet: window.matchMedia(TABLET_QUERY).matches,
        };
    };

    const [breakpoint, setBreakpoint] = useState(getMatches);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mobileMedia = window.matchMedia(MOBILE_QUERY);
        const tabletMedia = window.matchMedia(TABLET_QUERY);

        const handleChange = () => setBreakpoint(getMatches());

        mobileMedia.addEventListener('change', handleChange);
        tabletMedia.addEventListener('change', handleChange);

        return () => {
            mobileMedia.removeEventListener('change', handleChange);
            tabletMedia.removeEventListener('change', handleChange);
        };
    }, []);

    return breakpoint;
};

export default useBreakpoint;
