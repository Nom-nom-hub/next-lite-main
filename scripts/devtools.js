/**
 * DevTools for Next-Lite
 * Provides tools for debugging and profiling Next-Lite applications
 */
const fs = require('fs-extra');
const path = require('path');
const WebSocket = require('ws');
const config = require('./config');

// DevTools state
let devToolsEnabled = false;
let devToolsPort = 8090;
let wss = null;
let clients = new Set();
let events = [];
let performance = {
  builds: [],
  requests: [],
  renders: [],
};

/**
 * Initialize DevTools
 * @param {Object} options - DevTools options
 */
function initDevTools(options = {}) {
  if (devToolsEnabled) {
    return;
  }
  
  devToolsEnabled = true;
  devToolsPort = options.port || 8090;
  
  console.log(`\n🛠️  Initializing Next-Lite DevTools on port ${devToolsPort}`);
  
  // Create WebSocket server for DevTools
  wss = new WebSocket.Server({ port: devToolsPort });
  
  wss.on('connection', (ws) => {
    console.log('DevTools client connected');
    clients.add(ws);
    
    // Send initial state
    ws.send(JSON.stringify({
      type: 'init',
      data: {
        events,
        performance,
        config: config,
      },
    }));
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        handleDevToolsMessage(data, ws);
      } catch (error) {
        console.error('Error handling DevTools message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('DevTools client disconnected');
      clients.delete(ws);
    });
  });
  
  // Create DevTools UI
  createDevToolsUI();
  
  console.log('DevTools initialized. Open http://localhost:3000/__devtools in your browser.');
}

/**
 * Handle DevTools messages
 * @param {Object} data - Message data
 * @param {WebSocket} ws - WebSocket client
 */
function handleDevToolsMessage(data, ws) {
  switch (data.type) {
    case 'clear-events':
      events = [];
      broadcastToDevTools({
        type: 'events-cleared',
      });
      break;
    
    case 'clear-performance':
      performance = {
        builds: [],
        requests: [],
        renders: [],
      };
      broadcastToDevTools({
        type: 'performance-cleared',
      });
      break;
    
    case 'get-file-content':
      const filePath = data.path;
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        ws.send(JSON.stringify({
          type: 'file-content',
          path: filePath,
          content,
        }));
      } else {
        ws.send(JSON.stringify({
          type: 'error',
          message: `File not found: ${filePath}`,
        }));
      }
      break;
    
    default:
      console.log('Unknown DevTools message type:', data.type);
  }
}

/**
 * Broadcast a message to all connected DevTools clients
 * @param {Object} message - Message to broadcast
 */
function broadcastToDevTools(message) {
  if (!devToolsEnabled || !wss) {
    return;
  }
  
  const messageStr = JSON.stringify(message);
  
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

/**
 * Log an event to DevTools
 * @param {string} type - Event type
 * @param {Object} data - Event data
 */
function logEvent(type, data) {
  if (!devToolsEnabled) {
    return;
  }
  
  const event = {
    id: events.length + 1,
    type,
    data,
    timestamp: new Date().toISOString(),
  };
  
  events.push(event);
  
  // Keep only the last 1000 events
  if (events.length > 1000) {
    events.shift();
  }
  
  broadcastToDevTools({
    type: 'event',
    event,
  });
}

/**
 * Log performance data to DevTools
 * @param {string} type - Performance type (build, request, render)
 * @param {Object} data - Performance data
 */
function logPerformance(type, data) {
  if (!devToolsEnabled) {
    return;
  }
  
  const perfData = {
    ...data,
    timestamp: new Date().toISOString(),
  };
  
  switch (type) {
    case 'build':
      performance.builds.push(perfData);
      // Keep only the last 100 builds
      if (performance.builds.length > 100) {
        performance.builds.shift();
      }
      break;
    
    case 'request':
      performance.requests.push(perfData);
      // Keep only the last 1000 requests
      if (performance.requests.length > 1000) {
        performance.requests.shift();
      }
      break;
    
    case 'render':
      performance.renders.push(perfData);
      // Keep only the last 1000 renders
      if (performance.renders.length > 1000) {
        performance.renders.shift();
      }
      break;
  }
  
  broadcastToDevTools({
    type: 'performance',
    category: type,
    data: perfData,
  });
}

/**
 * Create DevTools UI
 */
function createDevToolsUI() {
  // Create DevTools UI files
  const devToolsDir = path.join(process.cwd(), '.next', 'devtools');
  fs.ensureDirSync(devToolsDir);
  
  // Create DevTools HTML
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Next-Lite DevTools</title>
  <style>
    :root {
      --bg-color: #f5f5f5;
      --text-color: #333;
      --primary-color: #7928CA;
      --secondary-color: #FF0080;
      --border-color: #ddd;
      --card-bg: #fff;
      --error-color: #e53e3e;
      --warning-color: #dd6b20;
      --info-color: #3182ce;
      --success-color: #38a169;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 0;
      background-color: var(--bg-color);
      color: var(--text-color);
    }
    
    * {
      box-sizing: border-box;
    }
    
    .container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    
    .header {
      background-color: var(--primary-color);
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    
    .tabs {
      display: flex;
      background-color: var(--card-bg);
      border-bottom: 1px solid var(--border-color);
    }
    
    .tab {
      padding: 1rem;
      cursor: pointer;
      border-bottom: 2px solid transparent;
    }
    
    .tab.active {
      border-bottom-color: var(--primary-color);
      font-weight: 500;
    }
    
    .tab-content {
      flex: 1;
      overflow: auto;
      padding: 1rem;
    }
    
    .card {
      background-color: var(--card-bg);
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 1rem;
      padding: 1rem;
    }
    
    .card h2 {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.2rem;
    }
    
    .event-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .event-item {
      padding: 0.5rem;
      border-bottom: 1px solid var(--border-color);
    }
    
    .event-item:last-child {
      border-bottom: none;
    }
    
    .event-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    
    .event-type {
      font-weight: 500;
    }
    
    .event-time {
      color: #666;
      font-size: 0.9rem;
    }
    
    .event-data {
      font-family: monospace;
      font-size: 0.9rem;
      white-space: pre-wrap;
      background-color: #f8f8f8;
      padding: 0.5rem;
      border-radius: 4px;
      overflow: auto;
      max-height: 200px;
    }
    
    .performance-chart {
      height: 300px;
      margin-bottom: 1rem;
    }
    
    .button {
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 0.9rem;
    }
    
    .button:hover {
      opacity: 0.9;
    }
    
    .button-group {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #ccc;
    }
    
    .status-indicator.connected {
      background-color: var(--success-color);
    }
    
    .status-text {
      font-size: 0.9rem;
    }
    
    .error {
      color: var(--error-color);
    }
    
    .warning {
      color: var(--warning-color);
    }
    
    .info {
      color: var(--info-color);
    }
    
    .success {
      color: var(--success-color);
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1>Next-Lite DevTools</h1>
      <div class="status">
        <div id="status-indicator" class="status-indicator"></div>
        <span id="status-text" class="status-text">Disconnected</span>
      </div>
    </header>
    
    <div class="tabs">
      <div class="tab active" data-tab="events">Events</div>
      <div class="tab" data-tab="performance">Performance</div>
      <div class="tab" data-tab="network">Network</div>
      <div class="tab" data-tab="config">Configuration</div>
    </div>
    
    <div class="tab-content">
      <!-- Events Tab -->
      <div id="events-tab" class="tab-panel active">
        <div class="button-group">
          <button id="clear-events" class="button">Clear Events</button>
        </div>
        
        <div class="card">
          <h2>Events</h2>
          <ul id="event-list" class="event-list"></ul>
        </div>
      </div>
      
      <!-- Performance Tab -->
      <div id="performance-tab" class="tab-panel" style="display: none;">
        <div class="button-group">
          <button id="clear-performance" class="button">Clear Performance Data</button>
        </div>
        
        <div class="card">
          <h2>Build Performance</h2>
          <div id="build-chart" class="performance-chart"></div>
          <div id="build-stats"></div>
        </div>
        
        <div class="card">
          <h2>Request Performance</h2>
          <div id="request-chart" class="performance-chart"></div>
          <div id="request-stats"></div>
        </div>
        
        <div class="card">
          <h2>Render Performance</h2>
          <div id="render-chart" class="performance-chart"></div>
          <div id="render-stats"></div>
        </div>
      </div>
      
      <!-- Network Tab -->
      <div id="network-tab" class="tab-panel" style="display: none;">
        <div class="card">
          <h2>Network Requests</h2>
          <div id="network-list"></div>
        </div>
      </div>
      
      <!-- Configuration Tab -->
      <div id="config-tab" class="tab-panel" style="display: none;">
        <div class="card">
          <h2>Configuration</h2>
          <pre id="config-content"></pre>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    // DevTools client-side code
    (function() {
      // State
      let ws = null;
      let connected = false;
      let events = [];
      let performance = {
        builds: [],
        requests: [],
        renders: [],
      };
      let config = {};
      
      // DOM elements
      const statusIndicator = document.getElementById('status-indicator');
      const statusText = document.getElementById('status-text');
      const eventList = document.getElementById('event-list');
      const clearEventsButton = document.getElementById('clear-events');
      const clearPerformanceButton = document.getElementById('clear-performance');
      const configContent = document.getElementById('config-content');
      const tabs = document.querySelectorAll('.tab');
      const tabPanels = document.querySelectorAll('.tab-panel');
      
      // Connect to WebSocket server
      function connect() {
        ws = new WebSocket('ws://localhost:${devToolsPort}');
        
        ws.onopen = () => {
          console.log('Connected to DevTools server');
          connected = true;
          statusIndicator.classList.add('connected');
          statusText.textContent = 'Connected';
        };
        
        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          handleMessage(message);
        };
        
        ws.onclose = () => {
          console.log('Disconnected from DevTools server');
          connected = false;
          statusIndicator.classList.remove('connected');
          statusText.textContent = 'Disconnected';
          
          // Reconnect after 1 second
          setTimeout(connect, 1000);
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      }
      
      // Handle incoming messages
      function handleMessage(message) {
        switch (message.type) {
          case 'init':
            events = message.data.events;
            performance = message.data.performance;
            config = message.data.config;
            
            renderEvents();
            renderPerformance();
            renderConfig();
            break;
          
          case 'event':
            events.push(message.event);
            renderEvents();
            break;
          
          case 'performance':
            performance[message.category].push(message.data);
            renderPerformance();
            break;
          
          case 'events-cleared':
            events = [];
            renderEvents();
            break;
          
          case 'performance-cleared':
            performance = {
              builds: [],
              requests: [],
              renders: [],
            };
            renderPerformance();
            break;
          
          case 'file-content':
            // Handle file content
            break;
          
          case 'error':
            console.error('DevTools error:', message.message);
            break;
        }
      }
      
      // Render events
      function renderEvents() {
        eventList.innerHTML = '';
        
        if (events.length === 0) {
          eventList.innerHTML = '<li class="event-item">No events</li>';
          return;
        }
        
        // Render events in reverse order (newest first)
        events.slice().reverse().forEach(event => {
          const li = document.createElement('li');
          li.className = 'event-item';
          
          const header = document.createElement('div');
          header.className = 'event-header';
          
          const type = document.createElement('span');
          type.className = 'event-type';
          type.textContent = event.type;
          
          const time = document.createElement('span');
          time.className = 'event-time';
          time.textContent = new Date(event.timestamp).toLocaleTimeString();
          
          header.appendChild(type);
          header.appendChild(time);
          
          const data = document.createElement('pre');
          data.className = 'event-data';
          data.textContent = JSON.stringify(event.data, null, 2);
          
          li.appendChild(header);
          li.appendChild(data);
          
          eventList.appendChild(li);
        });
      }
      
      // Render performance data
      function renderPerformance() {
        // In a real implementation, this would use a charting library
        // like Chart.js to render performance charts
        document.getElementById('build-stats').textContent = 
          \`Total builds: \${performance.builds.length}\`;
        
        document.getElementById('request-stats').textContent = 
          \`Total requests: \${performance.requests.length}\`;
        
        document.getElementById('render-stats').textContent = 
          \`Total renders: \${performance.renders.length}\`;
      }
      
      // Render configuration
      function renderConfig() {
        configContent.textContent = JSON.stringify(config, null, 2);
      }
      
      // Clear events
      clearEventsButton.addEventListener('click', () => {
        if (connected) {
          ws.send(JSON.stringify({
            type: 'clear-events',
          }));
        }
      });
      
      // Clear performance data
      clearPerformanceButton.addEventListener('click', () => {
        if (connected) {
          ws.send(JSON.stringify({
            type: 'clear-performance',
          }));
        }
      });
      
      // Tab switching
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          // Deactivate all tabs
          tabs.forEach(t => t.classList.remove('active'));
          tabPanels.forEach(p => p.style.display = 'none');
          
          // Activate clicked tab
          tab.classList.add('active');
          const tabName = tab.getAttribute('data-tab');
          document.getElementById(\`\${tabName}-tab\`).style.display = 'block';
        });
      });
      
      // Initialize
      connect();
    })();
  </script>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(devToolsDir, 'index.html'), htmlContent);
}

/**
 * Create a middleware for DevTools
 * @returns {Function} - Middleware function
 */
function createDevToolsMiddleware() {
  return (req, res, next) => {
    // Handle DevTools routes
    if (req.url === '/__devtools') {
      // Redirect to DevTools UI
      res.writeHead(302, {
        'Location': '/__devtools/',
      });
      res.end();
      return;
    }
    
    if (req.url === '/__devtools/') {
      // Serve DevTools UI
      const devToolsPath = path.join(process.cwd(), '.next', 'devtools', 'index.html');
      if (fs.existsSync(devToolsPath)) {
        const content = fs.readFileSync(devToolsPath, 'utf8');
        res.writeHead(200, {
          'Content-Type': 'text/html',
        });
        res.end(content);
        return;
      }
    }
    
    // Log request for DevTools
    if (devToolsEnabled) {
      const start = Date.now();
      
      // Log request start
      logEvent('request-start', {
        method: req.method,
        url: req.url,
        headers: req.headers,
      });
      
      // Capture response
      const originalEnd = res.end;
      res.end = function(chunk, encoding) {
        // Call original end
        originalEnd.call(res, chunk, encoding);
        
        // Log request end
        const duration = Date.now() - start;
        
        logEvent('request-end', {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration,
        });
        
        logPerformance('request', {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration,
        });
      };
    }
    
    // Continue to next middleware
    next();
  };
}

module.exports = {
  initDevTools,
  logEvent,
  logPerformance,
  createDevToolsMiddleware,
};
