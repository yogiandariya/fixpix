/**
 * intentDetector.js
 * Hybrid logic: Rule-based keyword matching + AI fallback (Backend API).
 * Now supports direct tool mapping and parameter extraction.
 */

const KEYWORD_INTENTS = {
  // Navigation & General
  news: ['news', 'latest', 'updates', 'trending'],
  projects: ['projects', 'my work', 'saved', 'gallery'],
  settings: ['settings', 'config', 'account', 'profile'],
  home: ['home', 'dashboard', 'start', 'greeting', 'hello', 'hi'],
  
  // Tool-Specific (Rules)
  remove_bg: ['remove background', 'bg removal', 'cutout', 'transparent', 'background', 'bg', 'isolate', 'subject'],
  enhance: ['enhance', 'fix', 'improve', 'quality', 'sharpen', 'restore', 'hd', 'upscale', 'resolution', 'clear', 'blur'],
  colorize: ['colorize', 'color', 'b&w', 'vintage', 'old photo', 'grayscale', 'black and white'],
  style: ['style', 'filter', 'artistic', 'transform', 'anime', 'painting', 'cartoon', 'sketch'],
  face: ['face', 'portrait', 'smile', 'eyes', 'expressions', 'skin', 'beauty'],
};

// Map rule-based intents to actual tool IDs used in useChatbot/api
const INTENT_TO_TOOL = {
    enhance: 'superResolution',
    remove_bg: 'removeBg',
    colorize: 'colorize',
    style: 'styleTransfer',
    face: 'restoreFace'
};

import { apiEndpoints } from '../../lib/api';

export const detectIntent = async (text, history = []) => {
  const lowerText = text.toLowerCase().trim();

  // 1. Rule-based detection (fast shortcuts) - Only for direct tool triggers
  const toolShortcuts = {
    'removeBg': ['remove background', 'bg removal', 'clear background', 'transparent', 'isolate', 'cutout', 'bg remove'],
    'superResolution': ['enhance', 'upscale', 'hd', 'fix quality', 'sharpen', 'higher resolution', 'clear image', 'blurry'],
    'colorize': ['colorize', 'color it', 'make it color', 'b&w to color', 'vintage'],
    'restoreFace': ['fix face', 'restore face', 'enhance face', 'portrait fix', 'face restoration']
  };

  for (const [toolId, keywords] of Object.entries(toolShortcuts)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return { 
        type: 'action',
        tool: toolId,
        message: `I've detected you want to use the ${toolId.replace(/([A-Z])/g, ' $1').trim()} tool. Initializing neural process...`
      };
    }
  }

  // 2. Navigation & Utility Shortcuts 
  const navShortcuts = {
    'news': ['latest news', 'ai news', 'trending', 'updates'],
    'projects': ['my projects', 'saved work', 'gallery', 'history'],
    'batch': ['batch process', 'multiple images', 'bulk'],
    'restoration': ['editor', 'lab', 'start editing', 'canvas']
  };

  for (const [page, keywords] of Object.entries(navShortcuts)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return { 
        type: 'navigate',
        page: page,
        message: `Sure! Taking you to the ${page} section now.`
      };
    }
  }

  // 3. AI Multi-Role Assistant (Backend - POWERFUL MODE)
  try {
    const response = await fetch(apiEndpoints.intelligence.chatbotIntent, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, history }),
    });

    if (response.ok) {
      const data = await response.json();
      return data; 
    }
  } catch (error) {
    console.error('AI Assistant failed:', error);
  }

  return { 
    type: 'chat',
    message: "I'm having a connection issue with my neural engine, so I'm running in 'local mode' for now. How can I help you with your project?"
  };
};

