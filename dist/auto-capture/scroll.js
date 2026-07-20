import { TraceForge } from "../TraceForge.js";
let maxScrollDepth = 0;
const firedThresholds = new Set();
let scrollDebounceTimer = null;
let currentUrl = typeof window !== 'undefined' ? window.location.href : '';
const calculateScrollDepth = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
    const winHeight = window.innerHeight || document.documentElement.clientHeight;
    if (docHeight <= winHeight)
        return 100; // If page doesn't scroll, depth is 100%
    const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
    return Math.min(100, Math.max(0, scrollPercent));
};
const checkScrollThresholds = (depth) => {
    const thresholds = [25, 50, 75, 100];
    for (const threshold of thresholds) {
        if (depth >= threshold && !firedThresholds.has(threshold)) {
            firedThresholds.add(threshold);
            TraceForge.track('scroll', { depth: threshold });
        }
    }
};
const scrollHandler = () => {
    if (!TraceForge.isInitialized())
        return;
    // Reset if route changed (for SPAs)
    if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        maxScrollDepth = 0;
        firedThresholds.clear();
    }
    if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
    }
    scrollDebounceTimer = setTimeout(() => {
        const depth = calculateScrollDepth();
        if (depth > maxScrollDepth) {
            maxScrollDepth = depth;
            checkScrollThresholds(depth);
        }
    }, 500); // 500ms debounce
};
export const initScrollTracking = () => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        window.addEventListener('scroll', scrollHandler, { passive: true });
        // Initial check in case page is loaded already scrolled down or is short
        setTimeout(() => {
            const depth = calculateScrollDepth();
            maxScrollDepth = depth;
            checkScrollThresholds(depth);
        }, 1000); // Check 1s after init
    }
};
//# sourceMappingURL=scroll.js.map