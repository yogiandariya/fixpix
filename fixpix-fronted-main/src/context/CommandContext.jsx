import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { useImage } from './ImageContext';
import { COMMAND_REGISTRY, RECIPES, getQueueSummary, getConflicts } from '../data/CommandRegistry';
import useCanvasStore from '../store/canvasStore';
import { apiEndpoints } from '../lib/api';
import { authenticatedFetch } from '../lib/authFetch';
import useToastStore from '../store/toastStore';
import { buildCustomFilterCSS, applyFilterToImage, FILTER_PRESETS } from '../lib/filterEngine';

const CommandContext = createContext(null);

/**
 * CommandProvider v2.0
 * Unified state management for the Intelligent Command System
 */
export const CommandProvider = ({ children }) => {
    const {
        settings,
        updateSettings,
        isProcessing,
        setIsMasking,
        setIsCropping,
        currentProject,
        setProcessedImage,
        setOriginalImage: setContextOriginalImage 
    } = useImage();
    

    // Zustand Store (Source of Truth for the Editor session)
    const originalImage = useCanvasStore(state => state.originalImage);
    const selectedImage = originalImage; // Direct alias for logic compatibility

    // Processing state for UI feedback (GenerateButton, ToolCard)
    const [processingState, setProcessingState] = React.useState({
        currentStep: null,
        completed: [],
        total: 0,
        progress: 0
    });

    // ─────────────────────────────────────────────────────────────
    // STATE: Interaction Logic
    // ─────────────────────────────────────────────────────────────

    const [activeMode, setActiveMode] = useState(null); // 'eraser', 'crop', null
    const [expandedZone, setExpandedZone] = useState('create');

    // ─────────────────────────────────────────────────────────────
    // STATE: Tool Shared State
    // ─────────────────────────────────────────────────────────────

    const [brushSize, setBrushSize] = useState(30);
    const [brushSoftness, setBrushSoftness] = useState(50);

    // ─────────────────────────────────────────────────────────────
    // STATE: AI Operations Queue (Type B)
    // ─────────────────────────────────────────────────────────────
    // Structure: { 'faceRestoration': true, 'upscaleX': 4, ... }

    const [pendingQueue, setPendingQueue] = useState({});

    // ─────────────────────────────────────────────────────────────
    // STATE: AI Insights (Smart AI Copilot)
    // ─────────────────────────────────────────────────────────────

    const [aiInsights, setAiInsights] = useState({
        analyzing: false,
        analyzed: false,
        summary: "",
        type: "",
        subjects: { people: 0, animals: 0, objects: 0 },
        scene: "",
        mood: "",
        quality: { sharpness: "fair", lighting: "balanced", color: "natural", noise: "low", blur_level: "none" },
        scores: { detail: 0, light: 0, color: 0 },
        recommendations: [],
        message: "",
        chatHistory: []
    });

    // ─────────────────────────────────────────────────────────────
    // ACTIONS: AI Insights & Chat
    // ─────────────────────────────────────────────────────────────

    /**
     * Analyze image and generate smart insights via Advanced AI Intelligence
     */
    const analyzeImage = useCallback(async (imageInput) => {
        if (!imageInput) {
            console.warn("Analysis Attempted without Image");
            return;
        }

        setAiInsights(prev => ({ 
            ...prev, 
            analyzing: true, 
            analyzed: false, 
            message: "Neural engines firing up...",
            summary: "" // Clear previous summary
        }));

        try {
            console.log("🚀 Starting Neural Analysis for:", typeof imageInput);
            let finalImageData = imageInput;

            // 🛠️ HEAL: If input is a File or Blob, convert to Base64
            if (imageInput instanceof File || imageInput instanceof Blob || (typeof imageInput === 'string' && imageInput.startsWith('blob:'))) {
                 const convertToBase64 = (blob) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                };

                let blobToConvert = imageInput;
                if (typeof imageInput === 'string' && imageInput.startsWith('blob:')) {
                    const response = await fetch(imageInput);
                    blobToConvert = await response.blob();
                }
                
                finalImageData = await convertToBase64(blobToConvert);
            }

            const token = localStorage.getItem('access_token');
            const targetUrl = apiEndpoints.intelligence.analyzeImage;
            
            const req = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ imageBuffer: finalImageData })
            });

            if (!req.ok) {
                const errorData = await req.json().catch(() => ({}));
                throw new Error(errorData.message || `Neural Hub Error (${req.status})`);
            }

            const res = await req.json();
            const analysis = res.data || {};
            
            setAiInsights({
                analyzing: false,
                analyzed: true,
                summary: analysis.summary || "Image analyzed successfully.",
                type: analysis.type || "General",
                subjects: analysis.subjects || { people: 0, animals: 0, objects: 0 },
                scene: analysis.scene || "Standard",
                mood: analysis.mood || "Neutral",
                quality: analysis.quality || { sharpness: "good", lighting: "balanced", color: "natural" },
                scores: { 
                    detail: analysis.dna_scores?.sharpness || 80, 
                    light: analysis.dna_scores?.lighting || 80, 
                    color: analysis.dna_scores?.color || 80 
                },
                recommendations: analysis.suggested_tools || [],
                message: "",
                chatHistory: [] 
            });

        } catch (err) {
            console.error("Neural Analysis Failed:", err);
            setAiInsights(prev => ({
                ...prev,
                analyzing: false,
                analyzed: true,
                message: `Neural Engine Unreachable: ${err.message}`
            }));
        }
    }, []);

    // ─────────────────────────────────────────────────────────────
    // ACTIONS: Queue Management
    // ─────────────────────────────────────────────────────────────

    /**
     * Re-implemented executeBackendProcess locally
     */
    const executeBackendProcess = useCallback(async (payload, onStatusUpdate) => {
        if (!currentProject?.id) {
             throw new Error("No active project found. Please upload an image first.");
        }

        try {
            if (onStatusUpdate) onStatusUpdate({ status: 'processing' });
            
            const response = await authenticatedFetch(apiEndpoints.processImage(currentProject.id), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || "Server failed to start the restoration task.");
            }

            const finalProject = await response.json();
            
            if (onStatusUpdate) onStatusUpdate({ status: 'completed' });
            
            const resultUrl = finalProject.processed_image;
            if (resultUrl) {
                const cacheBustUrl = `${resultUrl}?v=${Date.now()}`;
                setProcessedImage(cacheBustUrl);
                // Also sync with Central Canvas Store
                useCanvasStore.getState().pushEdit(cacheBustUrl, "AI Magic Box", "batch", payload);
            }
            
            return finalProject;
        } catch (e) {
            console.error("Backend Process Failed:", e);
            throw e;
        }
    }, [currentProject, authenticatedFetch, setProcessedImage]);

    /**
     * Toggle a Queue-based tool (Type B)
     */
    const toggleCommand = useCallback((commandId, value) => {
        setPendingQueue(prev => {
            const newState = { ...prev };

            if (value !== false && value !== null && value !== undefined) {
                newState[commandId] = value;
            } else {
                delete newState[commandId];
            }
            return newState;
        });
    }, []);


    /**
     * Update a Live tool (Type A)
     */
    const updateLiveCommand = useCallback((commandId, value) => {
        const tool = COMMAND_REGISTRY[commandId];
        const param = tool?.apiParam || commandId;
        updateSettings(param, value);
    }, [updateSettings]);

    /**
     * Apply a Recipe (Type D - Macro)
     */
    const applyRecipe = useCallback((recipeId) => {
        const recipe = RECIPES[recipeId];
        if (!recipe) return;

        setPendingQueue(prev => {
            const newState = { ...prev };
            recipe.commands.forEach(cmd => {
                newState[cmd.id] = cmd.value;
            });
            return newState;
        });
    }, []);

    /**
     * Execute a Recipe immediately (Type D - Macro)
     */
    const executeRecipe = useCallback(async (recipeId) => {
        const recipe = RECIPES[recipeId];
        if (!recipe || commitLockRef.current) return;
        
        if (!originalImage) {
            useToastStore.getState().warning('Please upload an image first 📸');
            return;
        }

        commitLockRef.current = true;

        // 1. Sync UI Queue for visual feedback
        const recipeCommands = {};
        recipe.commands.forEach(cmd => {
            recipeCommands[cmd.id] = cmd.value;
        });
        setPendingQueue(recipeCommands);

        // 2. Prepare Payload for processing
        const payload = {};
        recipe.commands.forEach(cmd => {
            const tool = COMMAND_REGISTRY[cmd.id];
            payload[tool?.apiParam || cmd.id] = cmd.value;
        });

        // 3. Trigger processing
        setProcessingState({
            currentStep: recipe.commands[0].id,
            completed: [],
            total: recipe.commands.length,
            progress: 0
        });

        try {
            await executeBackendProcess(payload, (statusData) => {
                setProcessingState(prev => ({
                    ...prev,
                    progress: statusData.status === 'completed' ? 100 : 50
                }));
            });
            
            setProcessingState({
                currentStep: null,
                completed: recipe.commands.map(c => c.id),
                total: recipe.commands.length,
                progress: 100
            });
        } catch (err) {
            console.error('Recipe execution failure:', err);
            setProcessingState({ currentStep: null, completed: [], total: 0, progress: 0 });
        } finally {
            commitLockRef.current = false;
        }
    }, [originalImage, executeBackendProcess]);

    /**
     * Dynamic "Master Fix" - builds a custom recipe based on AI Detections
     */
    const executeDynamicFix = useCallback(async () => {
        if (!aiInsights.analyzed || commitLockRef.current) return;
        if (!originalImage) {
            useToastStore.getState().warning('Please upload an image first 📸');
            return;
        }

        const suggestedTools = aiInsights.suggestedTools || [];
        const masterRecipeId = aiInsights.masterRecipe;

        // Start with Master Recipe if one exists
        const payload = {};
        const activeTools = [];

        if (masterRecipeId && RECIPES[masterRecipeId]) {
            RECIPES[masterRecipeId].commands.forEach(cmd => {
                const tool = COMMAND_REGISTRY[cmd.id];
                payload[tool?.apiParam || cmd.id] = cmd.value;
                activeTools.push(cmd.id);
            });
        }

        // Layer on specific tool suggestions from AI DNA Analysis
        suggestedTools.forEach(t => {
            const tool = COMMAND_REGISTRY[t.tool];
            if (tool && !activeTools.includes(t.tool)) {
                // Determine smart value based on tool type
                const val = tool.id === 'upscaleX' ? 2 : (tool.id === 'faceRestoration' ? 0.6 : true);
                payload[tool.apiParam || t.tool] = val;
                activeTools.push(t.tool);
            }
        });

        if (activeTools.length === 0) {
            // Default "Auto Enhance" if no specific issues detected
            payload['autoEnhance'] = true;
            activeTools.push('autoEnhance');
        }

        commitLockRef.current = true;

        // 1. Sync UI Queue
        const recipeCommands = {};
        activeTools.forEach(tid => {
            const val = payload[COMMAND_REGISTRY[tid]?.apiParam || tid];
            recipeCommands[tid] = val;
        });
        setPendingQueue(recipeCommands);

        // 2. Trigger processing
        setProcessingState({
            currentStep: activeTools[0],
            completed: [],
            total: activeTools.length,
            progress: 0
        });

        try {
            await executeBackendProcess(payload, (statusData) => {
                // Update UI steps based on backend status
                setProcessingState(prev => ({
                    ...prev,
                    currentStep: statusData.status === 'completed' ? null : activeTools[0],
                    progress: statusData.status === 'completed' ? 100 : 50
                }));
            });
            
            setProcessingState({
                currentStep: null,
                completed: activeTools,
                total: activeTools.length,
                progress: 100
            });
        } catch (err) {
            console.error('Dynamic AI Fix failure:', err);
            setProcessingState({ currentStep: null, completed: [], total: 0, progress: 0 });
        } finally {
            commitLockRef.current = false;
        }
    }, [aiInsights, originalImage, executeBackendProcess]);

    /**
     * Natural Language Processor for AI Copilot Chat
     */
    const processChatCommand = useCallback(async (query) => {
        if (!query.trim()) return;

        const userMsg = { id: Date.now(), text: query, sender: 'user', timestamp: new Date() };
        
        // Add user message to history immediately for UI responsiveness
        setAiInsights(prev => ({ 
            ...prev, 
            chatHistory: [...(prev.chatHistory || []), userMsg]
        }));

        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${NODE_API_URL}/api/chatbot/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    message: query,
                    metadata: {
                        selectedImage,
                        history: aiInsights.chatHistory // Send previous history for context
                    }
                })
            });

            if (!res.ok) throw new Error("Chat Engine Failed");
            const data = await res.json();

            const assistantMsg = { 
                id: Date.now() + 1, 
                text: data.reply, 
                sender: 'bot', 
                timestamp: new Date() 
            };

            setAiInsights(prev => ({ 
                ...prev, 
                message: data.reply,
                chatHistory: [...(prev.chatHistory || []), assistantMsg]
            }));

            // Handle potential actions (tool triggers)
            if (data.actions && data.actions.length > 0) {
                data.actions.forEach(action => {
                    const tool = getToolById(action.tool || action.id);
                    if (tool) {
                        toggleCommand(tool.id, true);
                    }
                });
            }

        } catch (err) {
            console.error("Chat Failed", err);
            const errorMsg = { 
                id: Date.now() + 1, 
                text: "I'm having trouble connecting to my neural core. Please try again.", 
                sender: 'bot', 
                timestamp: new Date() 
            };
            setAiInsights(prev => ({ 
                ...prev, 
                chatHistory: [...(prev.chatHistory || []), errorMsg]
            }));
        }
    }, [selectedImage, aiInsights.chatHistory, toggleCommand]);

    /**
     * Clear all pending commands
     */
    const clearQueue = useCallback(() => {
        setPendingQueue({});
    }, []);

    // ─────────────────────────────────────────────────────────────
    // ACTIONS: Focus Mode (Type C)
    // ─────────────────────────────────────────────────────────────

    const enterMode = useCallback((modeName) => {
        setActiveMode(modeName);
        if (modeName === 'eraser') {
            setIsMasking(true);
            setIsCropping(false);
        } else if (modeName === 'crop') {
            setIsCropping(true);
            setIsMasking(false);
        }
    }, [setIsMasking, setIsCropping]);

    const exitMode = useCallback(() => {
        setActiveMode(null);
        setIsMasking(false);
        setIsCropping(false);
    }, [setIsMasking, setIsCropping]);

    /**
     * Direct Trigger: AI-driven tool activation
     */
    const triggerFeature = useCallback((featureId) => {
        // 1. Dynamic Zone Lookup from Registry
        const tool = COMMAND_REGISTRY[featureId];
        if (tool?.zone) {
            setExpandedZone(tool.zone);
        }

        // 2. Map AI ID to Layout Navigation ID
        const layoutMap = {
            'faceRestoration': 'face-restore',
            'upscaleX': 'super-res',
            'magic_eraser': 'magic-eraser',
            'removeBackground': 'remove-bg',
            'changeBackground': 'change-bg',
            'styleTransfer': 'smart-filters',
            'editImage': 'edit-image',
            'textToImage': 'text-to-image',
            'crop': 'crop'
        };

        const layoutId = layoutMap[featureId] || featureId;

        // 3. Trigger Global Navigation Proxy (Opens Popups/Modals)
        if (window.setActiveFeatureProxy) {
            window.setActiveFeatureProxy(layoutId);
        }

        // 4. Mode/Command Fallback
        if (tool?.type === 'mode') {
            enterMode(tool.modeName);
        } else {
            toggleCommand(featureId, true);
        }

        // 5. Status Feedback
        useToastStore.getState().success(`Opening ${tool?.label || featureId.replace(/([A-Z])/g, ' $1').toLowerCase()}...`);
    }, [toggleCommand, enterMode]);

    /**
     * Instant Apply: Chat-driven filter application (Bypasses Popups)
     */
    const applyFilterDirectly = useCallback(async (filterId) => {
        if (!selectedImage) {
            useToastStore.getState().warning("Please upload an image first 📸");
            return;
        }

        const allPresets = Object.values(FILTER_PRESETS).flat();
        const preset = allPresets.find(p => p.id === filterId);
        
        if (!preset) {
            console.error("Unknown Filter Preset:", filterId);
            return;
        }

        try {
            useToastStore.getState().success(`Applying ${preset.name}...`);
            
            // 1. Generate CSS
            const finalCss = buildCustomFilterCSS(preset.css, { strength: 100 });
            
            // 2. Resolve image source (handle blobs/files)
            let imageUrl = selectedImage;
            let blobUrl = null;
            if (imageUrl instanceof File || imageUrl instanceof Blob) {
                blobUrl = URL.createObjectURL(imageUrl);
                imageUrl = blobUrl;
            }

            // 3. Bake Filter
            const filteredDataUrl = await applyFilterToImage(imageUrl, finalCss);
            
            if (blobUrl) URL.revokeObjectURL(blobUrl);

            // 4. Push to history
            const res = await useCanvasStore.getState().pushEdit(filteredDataUrl, preset.name, 'ai-filters', {
                filterId,
                type: 'direct-ai'
            });

            useToastStore.getState().success(`${preset.name} Applied! ✨`);
            return res;
        } catch (err) {
            console.error("Instant Filter Failed:", err);
            useToastStore.getState().error("Neural Filter Engine encountered a glitch.");
        }
    }, [selectedImage]);


    // ─────────────────────────────────────────────────────────────
    // ACTIONS: Execution (Generate)
    // ─────────────────────────────────────────────────────────────

    // Execution lock — prevents double-click and loop re-entry
    const commitLockRef = useRef(false);

    const commitCommands = useCallback(async () => {
        const queueKeys = Object.keys(pendingQueue);
        if (queueKeys.length === 0) return;

        if (commitLockRef.current) return;
        commitLockRef.current = true;

        if (!originalImage) {
            useToastStore.getState().warning('Please upload an image first 📸');
            commitLockRef.current = false;
            return;
        }

        const payload = {};
        Object.entries(pendingQueue).forEach(([cmdId, val]) => {
            const tool = COMMAND_REGISTRY[cmdId];
            const key = tool?.apiParam || cmdId;
            payload[key] = val;
        });

        setProcessingState({
            currentStep: queueKeys[0],
            completed: [],
            total: queueKeys.length,
            progress: 0
        });

        updateSettings(payload);

        try {
            await executeBackendProcess(payload, (statusData) => {
                setProcessingState(prev => ({
                    ...prev,
                    progress: statusData.status === 'completed' ? 100 : 50
                }));
            });

            setProcessingState({
                currentStep: null,
                completed: queueKeys,
                total: queueKeys.length,
                progress: 100
            });
        } catch (err) {
            console.error('Generate error:', err);
            setProcessingState({ currentStep: null, completed: [], total: 0, progress: 0 });
        } finally {
            commitLockRef.current = false;
        }

        // NOTE: Do NOT clear pendingQueue here.
        // Tools must stay selected after Generate so the user
        // can see what was applied and re-run or adjust.
    }, [pendingQueue, executeBackendProcess, updateSettings, originalImage]);

    // ─────────────────────────────────────────────────────────────
    // DERIVED STATE
    // ─────────────────────────────────────────────────────────────

    const hasPendingChanges = Object.keys(pendingQueue).length > 0;
    const pendingCount = Object.keys(pendingQueue).length;
    const queueSummary = useMemo(() => getQueueSummary(pendingQueue), [pendingQueue]);
    const conflicts = useMemo(() => getConflicts(pendingQueue), [pendingQueue]);

    // ─────────────────────────────────────────────────────────────
    // EFFECT: Sync Zustand Image -> ImageContext
    // ─────────────────────────────────────────────────────────────
    
    React.useEffect(() => {
        if (originalImage && typeof setContextOriginalImage === 'function') {
            setContextOriginalImage(originalImage);
        }
    }, [originalImage, setContextOriginalImage]);

    // ─────────────────────────────────────────────────────────────
    // EFFECT: Reset & Auto-Analyze
    // ─────────────────────────────────────────────────────────────

    React.useEffect(() => {
        setAiInsights({
            analyzing: false,
            analyzed: false,
            description: "",
            scene: "",
            scores: { detail: 0, light: 0, color: 0 },
            tags: [],
            issues: [],
            facesDetected: 0,
            suggestedTools: [],
            masterRecipe: null,
            workflows: [],
            authenticity: "",
            message: "",
            chatHistory: []
        });
    }, [selectedImage]); // Correct dependency

    // Auto-Analyze when entering Restoration Lab
    React.useEffect(() => {
        if (expandedZone === 'restore' && !aiInsights.analyzed && !aiInsights.analyzing && selectedImage) {
            analyzeImage(selectedImage);
        }
    }, [expandedZone, aiInsights.analyzed, aiInsights.analyzing, analyzeImage, selectedImage]);

    // ─────────────────────────────────────────────────────────────
    // CONTEXT VALUE
    // ─────────────────────────────────────────────────────────────

    const value = useMemo(() => ({
        // Mode
        activeMode,
        enterMode,
        exitMode,

        // Zone
        expandedZone,
        setExpandedZone,
        activeSection: expandedZone, // Alias for UI components

        // Tool State
        brushSize,
        setBrushSize,
        brushSoftness,
        setBrushSoftness,

        // Queue (Type B)
        pendingQueue,
        toggleCommand,
        triggerFeature,
        clearQueue,
        hasPendingChanges,
        pendingCount,
        queueSummary,
        conflicts,
        commitCommands,
        processingState,

        // Live (Type A)
        updateLiveCommand,

        // Recipe (Type D)
        applyRecipe,
        executeRecipe,
        executeDynamicFix,

        // AI Insights
        aiInsights,
        analyzeImage,
        processChatCommand,
        applyFilterDirectly,
        
        // Image State (Exposing for Copilot rescans)
        selectedImage
    }), [
        activeMode, enterMode, exitMode,
        expandedZone,
        brushSize,
        brushSoftness,
        pendingQueue, toggleCommand, triggerFeature, clearQueue, hasPendingChanges, pendingCount, queueSummary, conflicts, commitCommands, processingState,
        updateLiveCommand,
        applyRecipe,
        executeRecipe,
        executeDynamicFix,
        aiInsights, analyzeImage, processChatCommand, applyFilterDirectly,
        selectedImage
    ]);

    return (
        <CommandContext.Provider value={value}>
            {children}
        </CommandContext.Provider>
    );
};

export const useCommand = () => useContext(CommandContext) || {};

