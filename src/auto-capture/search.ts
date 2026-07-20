import { TraceForge } from "../TraceForge.js";

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
const trackedSearchInputs = new WeakSet<HTMLInputElement>();

const getSearchQuery = (input: HTMLInputElement): string => {
  return input.value.trim();
};

const captureSearch = (query: string) => {
  if (query.length < 2) return; // Filter noise
  TraceForge.track('search', { query });
};

const handleInput = (event: Event) => {
  if (!TraceForge.isInitialized()) return;
  
  const target = event.target as HTMLInputElement;
  if (!target) return;

  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  searchDebounceTimer = setTimeout(() => {
    captureSearch(getSearchQuery(target));
  }, 1000); // 1s debounce for typing
};

const handleFormSubmit = (event: Event) => {
  if (!TraceForge.isInitialized()) return;
  
  const form = event.target as HTMLFormElement;
  if (!form) return;

  // Find the search input in the form
  const searchInput = form.querySelector('input[type="search"], input[data-tf-search]') as HTMLInputElement;
  if (searchInput) {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    captureSearch(getSearchQuery(searchInput));
  }
};

const bindSearchInput = (input: HTMLInputElement) => {
  if (trackedSearchInputs.has(input)) return;
  
  // Ignore if explicitly told to
  if (input.hasAttribute('data-tf-ignore')) return;

  trackedSearchInputs.add(input);
  input.addEventListener('input', handleInput);
  
  // If it's part of a form, bind to form submit as well
  if (input.form && !trackedSearchInputs.has(input.form as any)) {
    trackedSearchInputs.add(input.form as any);
    input.form.addEventListener('submit', handleFormSubmit);
  }
};

const scanForSearchInputs = () => {
  const inputs = document.querySelectorAll('input[type="search"], [role="search"] input, input[data-tf-search]');
  inputs.forEach((input) => {
    if (input instanceof HTMLInputElement) {
      bindSearchInput(input);
    }
  });
};

export const initSearchTracking = () => {
  if (typeof document === 'undefined') return;

  // Initial scan
  scanForSearchInputs();

  // Watch for dynamically added search inputs
  const observer = new MutationObserver((mutations) => {
    let shouldScan = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldScan = true;
        break;
      }
    }
    if (shouldScan) {
      scanForSearchInputs();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};
