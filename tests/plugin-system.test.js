/**
 * Tests for the plugin system
 */
const { registerPlugin, applyHooks, createPlugin, hooks } = require('../scripts/plugin-system');

describe('Plugin System', () => {
  beforeEach(() => {
    // Reset hooks
    Object.keys(hooks).forEach(key => {
      if (Array.isArray(hooks[key])) {
        hooks[key] = [];
      } else if (key === 'custom') {
        hooks.custom = {};
      }
    });
    
    // Reset console mocks
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });
  
  test('createPlugin creates a valid plugin', () => {
    const plugin = createPlugin({
      name: 'test-plugin',
      hooks: {
        beforeBuild: jest.fn(),
      },
      init: jest.fn(),
    });
    
    expect(plugin).toEqual({
      name: 'test-plugin',
      hooks: {
        beforeBuild: expect.any(Function),
      },
      init: expect.any(Function),
    });
  });
  
  test('registerPlugin registers a plugin', () => {
    const beforeBuildHook = jest.fn();
    const initFn = jest.fn();
    
    const plugin = {
      name: 'test-plugin',
      hooks: {
        beforeBuild: beforeBuildHook,
      },
      init: initFn,
    };
    
    registerPlugin(plugin);
    
    expect(console.log).toHaveBeenCalledWith('Registering plugin: test-plugin');
    expect(hooks.beforeBuild).toContain(beforeBuildHook);
    expect(initFn).toHaveBeenCalled();
  });
  
  test('registerPlugin handles invalid plugins', () => {
    registerPlugin(null);
    expect(console.warn).toHaveBeenCalledWith('Invalid plugin: missing name');
    
    registerPlugin({});
    expect(console.warn).toHaveBeenCalledWith('Invalid plugin: missing name');
  });
  
  test('registerPlugin handles unknown hooks', () => {
    const plugin = {
      name: 'test-plugin',
      hooks: {
        unknownHook: jest.fn(),
      },
    };
    
    registerPlugin(plugin);
    
    expect(console.warn).toHaveBeenCalledWith('Unknown hook: unknownHook');
  });
  
  test('registerPlugin handles custom hooks', () => {
    const customHook = jest.fn();
    
    const plugin = {
      name: 'test-plugin',
      hooks: {
        custom: {
          myCustomHook: customHook,
        },
      },
    };
    
    registerPlugin(plugin);
    
    expect(hooks.custom.myCustomHook).toContain(customHook);
  });
  
  test('applyHooks applies hooks in order', async () => {
    const hook1 = jest.fn(data => ({ ...data, hook1: true }));
    const hook2 = jest.fn(data => ({ ...data, hook2: true }));
    
    hooks.beforeBuild = [hook1, hook2];
    
    const result = await applyHooks('beforeBuild', { initial: true });
    
    expect(hook1).toHaveBeenCalledWith({ initial: true });
    expect(hook2).toHaveBeenCalledWith({ initial: true, hook1: true });
    expect(result).toEqual({ initial: true, hook1: true, hook2: true });
  });
  
  test('applyHooks handles errors', async () => {
    const hook1 = jest.fn(() => { throw new Error('Hook error'); });
    const hook2 = jest.fn(data => ({ ...data, hook2: true }));
    
    hooks.beforeBuild = [hook1, hook2];
    
    const result = await applyHooks('beforeBuild', { initial: true });
    
    expect(hook1).toHaveBeenCalledWith({ initial: true });
    expect(console.error).toHaveBeenCalledWith('Error applying hook beforeBuild:', expect.any(Error));
    expect(hook2).toHaveBeenCalledWith({ initial: true });
    expect(result).toEqual({ initial: true, hook2: true });
  });
  
  test('applyHooks handles custom hooks', async () => {
    const customHook1 = jest.fn(data => ({ ...data, customHook1: true }));
    const customHook2 = jest.fn(data => ({ ...data, customHook2: true }));
    
    hooks.custom.myCustomHook = [customHook1, customHook2];
    
    const result = await applyHooks('custom.myCustomHook', { initial: true });
    
    expect(customHook1).toHaveBeenCalledWith({ initial: true });
    expect(customHook2).toHaveBeenCalledWith({ initial: true, customHook1: true });
    expect(result).toEqual({ initial: true, customHook1: true, customHook2: true });
  });
});
