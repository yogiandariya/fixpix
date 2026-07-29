/**
 * analyticsTracker.js
 * Tracks chatbot usage and generates smart insights.
 */

const ANALYTICS_KEY = 'fixpix_chatbot_analytics';

const getInitialAnalytics = () => ({
  total_commands: 0,
  features: {},
  recent: [],
});

export const trackEvent = (type, data = {}) => {
  const analytics = getAnalytics();
  
  if (type === 'intent_detected') {
    analytics.total_commands += 1;
    const intent = data.intent;
    if (intent) {
      analytics.features[intent] = (analytics.features[intent] || 0) + 1;
      analytics.recent = [intent, ...analytics.recent.filter(i => i !== intent)].slice(0, 5);
    }
  }

  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
};

export const getAnalytics = () => {
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : getInitialAnalytics();
  } catch (e) {
    return getInitialAnalytics();
  }
};

export const getTopFeature = () => {
  const analytics = getAnalytics();
  const features = analytics.features;
  let top = null;
  let max = 0;

  for (const [feature, count] of Object.entries(features)) {
    if (count > max) {
      max = count;
      top = feature;
    }
  }
  return top ? { name: top, count: max } : null;
};

export const getSmartInsights = () => {
  const top = getTopFeature();
  if (top && top.count >= 3) {
    const featureLabels = {
      enhance: 'Enhance Image',
      remove_bg: 'Remove Background',
      colorize: 'Colorize Photo',
      news: 'AI News',
      style: 'Style Transfer',
    };
    const label = featureLabels[top.name] || top.name;
    return `You often use ${label} → want to open it?`;
  }
  return null;
};
