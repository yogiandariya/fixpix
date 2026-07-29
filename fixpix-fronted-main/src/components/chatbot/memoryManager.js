/**
 * memoryManager.js
 * Manages chatbot persistence using localStorage.
 * Enhanced to store tool parameters for "Repeat" functionality.
 */

const STORAGE_KEY = 'fixpix_chatbot_memory';

export const saveLastAction = (tool, params = {}) => {
  const memory = {
    last_tool: tool,
    last_params: params,
    timestamp: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
};

export const getLastAction = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to parse chatbot memory:', e);
    return null;
  }
};

export const clearMemory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

