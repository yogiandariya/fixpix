/**
 * routeHandler.js
 * Logic to navigate using react-router-dom and handle deep links.
 */
import { saveLastAction } from './memoryManager';

export const handleNavigation = (intentData, navigate) => {
  const intent = typeof intentData === 'string' ? intentData : intentData.intent;
  const tool = typeof intentData === 'string' ? null : intentData.tool;
  const customRoute = typeof intentData === 'object' ? intentData.route : null;

  switch (intent) {
    case 'home':
      navigate('/');
      saveLastAction('home', null, '/');
      break;
    case 'news':
      navigate('/ai-news');
      saveLastAction('news', null, '/ai-news');
      break;
    case 'editor':
      navigate('/app/restoration');
      saveLastAction('editor', null, '/app/restoration');
      break;
    case 'batch':
      navigate('/app/batch');
      saveLastAction('batch', null, '/app/batch');
      break;
    case 'projects':
      navigate('/app/projects');
      saveLastAction('projects', null, '/app/projects');
      break;
    case 'settings':
      navigate('/app/settings');
      saveLastAction('settings', null, '/app/settings');
      break;
    case 'enhance':
      const enhanceTool = tool || 'enhance';
      navigate(`/app/restoration?tool=${enhanceTool}`);
      saveLastAction('enhance', enhanceTool, `/app/restoration?tool=${enhanceTool}`);
      break;
    case 'remove_bg':
      const rbTool = tool || 'removeBg'; // Normalize to removeBg for AIStudioTools.jsx
      navigate(`/app/restoration?tool=${rbTool}`);
      saveLastAction('remove_bg', rbTool, `/app/restoration?tool=${rbTool}`);
      break;
    case 'colorize':
      const colorizeTool = tool || 'colorize';
      navigate(`/app/restoration?tool=${colorizeTool}`);
      saveLastAction('colorize', colorizeTool, `/app/restoration?tool=${colorizeTool}`);
      break;
    case 'style':
      const styleTool = tool || 'styleTransfer'; // Normalize
      navigate('/app/restoration?tool=' + styleTool);
      saveLastAction('style', styleTool, '/app/restoration?tool=' + styleTool);
      break;
    case 'go_back':
      navigate(-1);
      break;
    default:
      if (customRoute) {
        navigate(customRoute);
      } else {
        navigate('/');
      }
      break;
  }
};
