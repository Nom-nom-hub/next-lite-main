/**
 * Performance monitoring tools for Next-Lite
 */

/**
 * Performance metrics
 */
const metrics = {
  // Page load metrics
  ttfb: 0, // Time to First Byte
  fcp: 0, // First Contentful Paint
  lcp: 0, // Largest Contentful Paint
  fid: 0, // First Input Delay
  cls: 0, // Cumulative Layout Shift
  
  // Build metrics
  buildTime: 0,
  buildMemory: 0,
  
  // Runtime metrics
  renderTime: {},
  hydrationTime: 0,
  routeChangeTime: {},
  
  // Custom metrics
  custom: {}
};

/**
 * Initialize performance monitoring
 */
function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;
  
  // Create a PerformanceObserver to monitor LCP
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    metrics.lcp = lastEntry.startTime;
  });
  
  lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  
  // Create a PerformanceObserver to monitor FID
  const fidObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const firstEntry = entries[0];
    metrics.fid = firstEntry.processingStart - firstEntry.startTime;
  });
  
  fidObserver.observe({ type: 'first-input', buffered: true });
  
  // Create a PerformanceObserver to monitor CLS
  const clsObserver = new PerformanceObserver((entryList) => {
    let clsValue = 0;
    
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    
    metrics.cls = clsValue;
  });
  
  clsObserver.observe({ type: 'layout-shift', buffered: true });
  
  // Measure TTFB
  const navigationEntries = performance.getEntriesByType('navigation');
  if (navigationEntries.length > 0) {
    metrics.ttfb = navigationEntries[0].responseStart;
  }
  
  // Measure FCP
  const paintEntries = performance.getEntriesByType('paint');
  const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
  if (fcpEntry) {
    metrics.fcp = fcpEntry.startTime;
  }
  
  // Report metrics to analytics if configured
  window.addEventListener('load', () => {
    setTimeout(() => {
      reportMetrics();
    }, 1000);
  });
}

/**
 * Report performance metrics
 */
function reportMetrics() {
  if (typeof window === 'undefined') return;
  
  // Check if analytics endpoint is configured
  const config = window.__NEXT_LITE_CONFIG__ || {};
  const analyticsEndpoint = config.analyticsEndpoint;
  
  if (!analyticsEndpoint) return;
  
  // Send metrics to analytics endpoint
  fetch(analyticsEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: window.location.href,
      metrics,
      timestamp: Date.now()
    }),
    // Use beacon API if available for more reliable sending on page unload
    keepalive: true
  }).catch(error => {
    console.error('Failed to report metrics:', error);
  });
}

/**
 * Measure render time for a component
 * @param {string} componentName - Component name
 * @param {Function} callback - Function to measure
 * @returns {any} - Result of the callback
 */
function measureRenderTime(componentName, callback) {
  const startTime = performance.now();
  const result = callback();
  const endTime = performance.now();
  
  metrics.renderTime[componentName] = endTime - startTime;
  
  return result;
}

/**
 * Record a custom metric
 * @param {string} name - Metric name
 * @param {number} value - Metric value
 */
function recordCustomMetric(name, value) {
  metrics.custom[name] = value;
}

/**
 * Get all performance metrics
 * @returns {Object} - Performance metrics
 */
function getMetrics() {
  return { ...metrics };
}

module.exports = {
  initPerformanceMonitoring,
  measureRenderTime,
  recordCustomMetric,
  getMetrics,
  reportMetrics
};