/**
 * Test setup for Next-Lite
 */
const { JSDOM } = require('jsdom');
const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { act } = require('react-dom/test-utils');

// Create a fake DOM environment for tests
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost:3000',
  pretendToBeVisual: true,
  runScripts: 'dangerously',
});

// Set up global variables
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.fetch = jest.fn();
global.Request = dom.window.Request;
global.Response = dom.window.Response;
global.Headers = dom.window.Headers;
global.location = dom.window.location;
global.history = dom.window.history;

// Mock console methods
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock process.env
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  NEXT_LITE_TEST: 'true',
};

// Mock CSS modules
jest.mock('*.module.css', () => {
  return new Proxy({}, {
    get: (target, key) => key,
  });
});

// Export testing utilities
module.exports = {
  React,
  render,
  screen,
  fireEvent,
  waitFor,
  act,
};
