/**
 * Test Setup - Global configuration for Vitest tests
 */

import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => { },
    }),
});

// Mock IntersectionObserver
window.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock ResizeObserver
window.ResizeObserver = class ResizeObserver {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock URL.createObjectURL
window.URL.createObjectURL = () => 'mock-url';
window.URL.revokeObjectURL = () => { };
