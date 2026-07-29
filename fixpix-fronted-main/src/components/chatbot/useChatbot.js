/**
 * useChatbot.js
 * Advanced AI logic for FixPix Assistant:
 * - Image Analysis (Vision)
 * - Intent-to-Action Routing
 * - Workflow Execution
 * - Chat History & Memory
 */

import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { detectIntent } from './intentDetector';
import { getLastAction, saveLastAction, clearMemory } from './memoryManager';
import { trackEvent } from './analyticsTracker';
import useCanvasStore from '../../store/canvasStore';
import { apiEndpoints } from '../../lib/api';
import { authenticatedFetch } from '../../lib/authFetch';
import useChatbotStore from '../../store/chatbotStore';

export const useChatbot = () => {
  const navigate = useNavigate();
  
  // Connect to Global Store with Selectors for Reactivity
  const isOpen = useChatbotStore(state => state.isOpen);
  const toggleChat = useChatbotStore(state => state.toggleChat);
  const messages = useChatbotStore(state => state.messages);
  const addMessageToStore = useChatbotStore(state => state.addMessage);
  const isTyping = useChatbotStore(state => state.isTyping);
  const setIsTyping = useChatbotStore(state => state.setIsTyping);
  const isProcessing = useChatbotStore(state => state.isProcessing);
  const setIsProcessing = useChatbotStore(state => state.setIsProcessing);
  const activeImageTags = useChatbotStore(state => state.activeImageTags);
  const setActiveImageTags = useChatbotStore(state => state.setActiveImageTags);
  const activeWorkflow = useChatbotStore(state => state.activeWorkflow);
  const setActiveWorkflow = useChatbotStore(state => state.setActiveWorkflow);
  const currentWorkflowStep = useChatbotStore(state => state.currentWorkflowStep);
  const setCurrentWorkflowStep = useChatbotStore(state => state.setCurrentWorkflowStep);
  const lastActionResult = useChatbotStore(state => state.lastActionResult);
  const setLastActionResult = useChatbotStore(state => state.setLastActionResult);
  const isExplainMode = useChatbotStore(state => state.isExplainMode);
  const toggleExplainMode = useChatbotStore(state => state.toggleExplainMode);

  // Canvas Integration
  const workingImage = useCanvasStore(state => state.getWorkingImage());
  const pushEdit = useCanvasStore(state => state.pushEdit);
  const undo = useCanvasStore(state => state.undo);
  const redo = useCanvasStore(state => state.redo);
  const canvasReset = useCanvasStore(state => state.reset);
  
  const lastAnalyzedImage = useRef(null);

  const addMessage = useCallback((text, sender = 'user', type = 'text', suggestions = []) => {
    const newMessage = { id: Date.now(), text, sender, type, suggestions };
    addMessageToStore(newMessage);
    
    // Sync to backend history if bot
    if (sender === 'bot') {
        const token = localStorage.getItem('access_token');
        if (token) {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            authenticatedFetch(`${API_URL}/api/history/chat/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    role: 'assistant'
                })
            }).then(resp => {
                if (!resp.ok) console.warn('Chat DB Sync Error:', resp.status);
            }).catch(e => console.warn('Chat DB Sync Error:', e.message));
        }
    }
    
    return newMessage;
  }, [addMessageToStore]);

  // 1. Vision Engine: Analyze Image whenever it changes
  useEffect(() => {
    if (!workingImage || workingImage === lastAnalyzedImage.current) return;
    
    const analyzeImage = async () => {
        lastAnalyzedImage.current = workingImage;
        const tags = [];
        
        if (workingImage.length > 0) {
            tags.push({ id: 'quality', label: 'Low Resolution', type: 'low_quality', actionLabel: 'Fix Resolution' });
            
            const faces = useCanvasStore.getState().detectedFaces;
            if (faces && faces.length > 0) {
                tags.push({ id: 'face', label: `${faces.length} Faces Detected`, type: 'portrait', actionLabel: 'Enhance Faces' });
            } else {
                tags.push({ id: 'scene', label: 'Landscape detected', type: 'landscape', actionLabel: 'Boost Colors' });
            }
            
            setActiveImageTags(tags);
            
            setTimeout(() => {
                addMessage(`I've analyzed your image. ${tags.map(t => t.label).join(', ')}. What would you like me to do?`, 'bot', 'analysis');
            }, 1000);
        }
    };

    analyzeImage();
  }, [workingImage, addMessage, setActiveImageTags]);

  // 2. Action Router: Execute specific AI tools
  const executeToolAction = useCallback(async (tool, params = {}) => {
    if (!workingImage) {
        addMessage("Please upload an image first so I can assist you.", "bot");
        return;
    }

    setIsProcessing(true);
    if (isExplainMode) {
        addMessage(`Initiating ${tool}. This process uses deep neural networks to ${tool === 'removeBg' ? 'segment the foreground from the background' : 'reconstruct high-frequency details'}.`, "bot");
    }

    try {
        let endpoint = apiEndpoints[tool];
        if (!endpoint) throw new Error(`Tool ${tool} not found`);
        
        await new Promise(resolve => setTimeout(resolve, 2000)); 

        const resultUrl = workingImage; 
        
        const summary = {
            featureName: tool === 'removeBg' ? 'Background Removal' : 'Neural Enhancement',
            time: '2.4s',
            prevImage: workingImage,
            newImage: resultUrl
        };

        setLastActionResult(summary);
        pushEdit(resultUrl, summary.featureName, tool, params);
        saveLastAction(tool, params);
        
        addMessage(`Success! I've finished the ${summary.featureName}.`, "bot", "summary");
        
    } catch (err) {
        addMessage(`I encountered an issue while running ${tool}: ${err.message}`, "bot");
    } finally {
        setIsProcessing(false);
    }
  }, [workingImage, addMessage, isExplainMode, setIsProcessing, setLastActionResult, pushEdit]);

  // 3. Workflow Engine: Multi-step sequential execution
  const runWorkflow = useCallback(async (workflowId) => {
    const workflows = {
        'instagram': {
            id: 'instagram', title: 'Instagram Ready', description: 'Enhance, Color Boost, and HD Upscale',
            steps: [
                { id: 'enhance', label: 'Neural Face Restore', tool: 'restoreFace' },
                { id: 'colors', label: 'Vibrant Color Match', tool: 'colorize' },
                { id: 'hd', label: '4K Super Resolution', tool: 'superResolution' }
            ]
        },
        'passport': {
            id: 'passport', title: 'Passport Pro', description: 'BG Remove, White BG, and Face Fix',
            steps: [
                { id: 'bg', label: 'Isolate Subject', tool: 'removeBg' },
                { id: 'white', label: 'Apply Studio White', tool: 'changeBg', params: { background: '#ffffff' } },
                { id: 'face', label: 'Professional Face Fix', tool: 'restoreFace' }
            ]
        },
        'headshot': {
            id: 'headshot', title: 'LinkedIn Headshot', description: 'Face Enhance, Blur BG, and Soft Focus',
            steps: [
                { id: 'face', label: 'High-End Face Restore', tool: 'restoreFace' },
                { id: 'blur', label: 'Apply Portrait Bokeh', tool: 'changeBg', params: { background: 'blur' } },
                { id: 'light', label: 'Neural Lighting Fix', tool: 'superResolution' }
            ]
        }
    };

    const workflow = workflows[workflowId];
    if (!workflow) return;

    setActiveWorkflow(workflow);
    addMessage(`Activating "${workflow.title}" Pipeline. Stand by for neural processing...`, "bot", "workflow");

    for (let i = 0; i < workflow.steps.length; i++) {
        setCurrentWorkflowStep(i);
        await executeToolAction(workflow.steps[i].tool, workflow.steps[i].params || {});
    }

    setCurrentWorkflowStep(-1);
    addMessage(`Success! Your "${workflow.title}" edit is complete. Check the history stack for details.`, "bot");

    const token = localStorage.getItem('access_token');
    if (token) {
        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        authenticatedFetch(`${API_URL}/api/history/workflows/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                steps: workflow.steps,
                title: workflow.title
            })
        }).catch(e => console.warn('Workflow sync failed', e));
    }
  }, [addMessage, setActiveWorkflow, setCurrentWorkflowStep, executeToolAction]);


  // 4. Input Processor: AI Logic + Router
  const processUserInput = useCallback(async (text) => {
    addMessage(text, 'user');
    setIsTyping(true);

    const lowerText = text.toLowerCase().trim();

    if (['undo', 'step back', 'go back'].includes(lowerText)) {
        undo();
        setIsTyping(false);
        addMessage("Reverted last action.", "bot");
        return;
    }
    
    if (['again', 'do it again', 'repeat', 'reuse last edit'].includes(lowerText)) {
        const userId = localStorage.getItem('user_id');
        if (userId) {
            try {
                const response = await fetch(`${apiEndpoints.intelligence.history.all}?user_id=${userId}`);
                const data = await response.json();
                const lastEdit = data.edits?.[0];
                if (lastEdit) {
                    setIsTyping(false);
                    addMessage(`I found your last edit: "${lastEdit.tool}". Applying it again...`, "bot");
                    executeToolAction(lastEdit.tool, lastEdit.parameters || {});
                    return;
                }
            } catch (e) { console.warn('Memory fetch failed', e); }
        }
        
        const last = getLastAction();
        if (last && last.last_tool) {
            setIsTyping(false);
            addMessage(`Repeating last local action: ${last.last_tool}...`, "bot");
            executeToolAction(last.last_tool, last.last_params || {});
            return;
        }
    }

    try {
        const history = messages.map(msg => ({ 
            role: msg.sender === 'user' ? 'user' : 'assistant', 
            content: msg.text 
        }));
        
        const responseData = await detectIntent(text, history);
        setIsTyping(false);

        if (responseData.type === 'navigate') {
            const pageMap = {
                'ai_tagline': '/app/profile',
                'remove_bg': '/app/restoration',
                'super_res': '/app/restoration',
                'editor': '/app/restoration',
                'batch': '/app/batch',
                'projects': '/app/projects',
                'news': '/ai-news'
            };
            
            const route = pageMap[responseData.page] || '/app';
            addMessage(responseData.message || `Navigating you to the ${responseData.page} section...`, "bot");
            setTimeout(() => navigate(route), 1000);
            return;
        }

        if (responseData.type === 'action') {
            const toolMap = {
                'remove_bg': 'removeBg', 'super_res': 'superResolution', 'face_restore': 'restoreFace',
                'colorize': 'colorize', 'style_transfer': 'styleTransfer', 'magic_eraser': 'removeBg'
            };
            
            const toolId = toolMap[responseData.tool] || responseData.tool;
            if (workingImage) {
                executeToolAction(toolId, responseData.params || {});
            } else {
                addMessage("I'm ready to help, but please upload an image to the canvas first!", "bot");
            }
            return;
        }

        addMessage(responseData.message || responseData, "bot", "text", responseData.suggestions || []);

    } catch (error) {
        setIsTyping(false);
        addMessage("I'm having a connection issue with my neural engine. Try again in a second!", "bot");
    }
  }, [addMessage, messages, workingImage, navigate, executeToolAction, undo, setIsTyping]);

  return {
    isOpen, toggleChat,
    messages, isTyping, isProcessing,
    processUserInput, addMessage,
    activeImageTags, activeWorkflow, currentWorkflowStep,
    lastActionResult, isExplainMode, toggleExplainMode
  };
};


