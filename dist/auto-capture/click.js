import { TraceForge } from "../TraceForge.js";
// Debounce timer to prevent tracking multiple rapid clicks on the same element
let clickDebounceTimer = null;
let lastClickedElement = null;
const getElementPath = (el) => {
    const path = [];
    let current = el;
    while (current && current.nodeType === Node.ELEMENT_NODE) {
        let selector = current.nodeName.toLowerCase();
        if (current.id) {
            selector += `#${current.id}`;
            path.unshift(selector);
            break;
        }
        else {
            let sibling = current;
            let nth = 1;
            while (sibling.previousElementSibling) {
                sibling = sibling.previousElementSibling;
                if (sibling.nodeName.toLowerCase() === selector) {
                    nth++;
                }
            }
            if (nth !== 1) {
                selector += `:nth-of-type(${nth})`;
            }
        }
        path.unshift(selector);
        current = current.parentElement;
    }
    return path.join(" > ");
};
const getInteractiveParent = (element) => {
    const interactiveSelectors = ['a', 'button', 'input', 'select', 'textarea', '[role="button"]', '[role="link"]'];
    let current = element;
    while (current && current !== document.body) {
        // Check if the current element matches any interactive selector
        if (interactiveSelectors.some(selector => current?.matches(selector))) {
            return current;
        }
        // Also check if it has a custom data-tf-name (developer explicitly wants to track it)
        if (current.hasAttribute('data-tf-name')) {
            return current;
        }
        current = current.parentElement;
    }
    return null;
};
const clickHandler = (event) => {
    if (!TraceForge.isInitialized())
        return;
    const target = event.target;
    if (!target)
        return;
    const interactiveElement = getInteractiveParent(target);
    if (!interactiveElement)
        return;
    // Ignore if explicitly told to
    if (interactiveElement.closest('[data-tf-ignore]'))
        return;
    // Debounce rapid clicks on the same element
    if (lastClickedElement === interactiveElement && clickDebounceTimer) {
        return;
    }
    lastClickedElement = interactiveElement;
    if (clickDebounceTimer)
        clearTimeout(clickDebounceTimer);
    clickDebounceTimer = setTimeout(() => {
        lastClickedElement = null;
    }, 500);
    const tagName = interactiveElement.tagName.toLowerCase();
    // Extract text content, truncate if necessary
    let text = (interactiveElement.textContent || interactiveElement.getAttribute('value') || '').trim();
    text = text.replace(/\s+/g, ' ').substring(0, 100); // Clean up whitespace and truncate
    const payload = {
        tagName,
        text,
        path: getElementPath(interactiveElement)
    };
    if (tagName === 'a') {
        payload.href = interactiveElement.getAttribute('href');
    }
    // Developer-defined explicit name
    const tfName = interactiveElement.getAttribute('data-tf-name');
    if (tfName) {
        payload.name = tfName;
    }
    // Find all data-tf-* attributes
    for (let i = 0; i < interactiveElement.attributes.length; i++) {
        const attr = interactiveElement.attributes[i];
        if (attr && attr.name.startsWith('data-tf-') && attr.name !== 'data-tf-name' && attr.name !== 'data-tf-ignore') {
            const key = attr.name.replace('data-tf-', '');
            payload[key] = attr.value;
        }
    }
    TraceForge.track('click', payload);
};
export const initClickTracking = () => {
    if (typeof document !== 'undefined') {
        document.addEventListener('click', clickHandler, true); // useCapture to ensure it runs early
    }
};
//# sourceMappingURL=click.js.map