'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

/**
 * Hydrate a React component on the client
 * @param {React.Component} Component - React component to hydrate
 * @param {string} containerId - ID of the container element
 */
function hydrate(Component, containerId = 'root') {
  // Get the container element
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Container element with ID "${containerId}" not found`);
    return;
  }
  
  // Get initial props from the server
  let initialProps = {};
  const dataElement = document.getElementById('__NEXT_LITE_DATA__');
  
  if (dataElement) {
    try {
      initialProps = JSON.parse(dataElement.textContent);
    } catch (error) {
      console.error('Error parsing initial props:', error);
    }
  }
  
  // Create the component element with initial props
  const element = React.createElement(Component, initialProps);
  
  // Hydrate the component
  ReactDOM.hydrate(element, container);
}

module.exports = {
  hydrate
};
