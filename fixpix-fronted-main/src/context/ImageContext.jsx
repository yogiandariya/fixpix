import React, { createContext, useContext, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import html2canvas from 'html2canvas';
import AuthContext from './AuthContext';
import { apiEndpoints, NODE_API_URL } from '../lib/api';
import { useModal } from './ModalContext';
import { authenticatedFetch } from '../lib/authFetch';
import useCanvasStore from '../store/canvasStore';

export const ImageContext = createContext(null);

export const ImageProvider = ({ children }) => {
    // AI HUB SSOT FIX: Proxying core state to canvasStore
    const originalImage = useCanvasStore(s => s.originalImage);
    const isProcessing = useCanvasStore(s => s.isProcessing);
    const history = useCanvasStore(s => s.history);
    const historyIndex = useCanvasStore(s => s.historyIndex);
    
    // Derived from history
    const processedImage = historyIndex >= 0 ? history[historyIndex]?.imageUrl : null;
    const generatedImage = null; // Deprecated in favor of history entries

    const [currentProject, setCurrentProject] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [isMasking, setIsMasking] = useState(false);
    const [maskImage, setMaskImage] = useState(null);

    // ─── Frame & Sticker System State ───
    const [activeFrame, setActiveFrame] = useState(null);
    const [frameScale, setFrameScale] = useState(100);
    const [stickers, setStickers] = useState([]);
    const [isExporting, setIsExporting] = useState(false);
    const exportRef = useRef(null);

    // ─── AI Generation State ───
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStatus, setGenerationStatus] = useState('');
    const [generationError, setGenerationError] = useState(null);
    const [generationLimits, setGenerationLimits] = useState(null);

    const { openModal, closeModal } = useModal();
    const authContext = useContext(AuthContext);

    // Cleanup object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (originalImage && typeof originalImage === 'string' && originalImage.startsWith('blob:')) {
                URL.revokeObjectURL(originalImage);
            }
        };
    }, [originalImage]);

    const fetchProjects = useCallback(async () => {
        try {
            const response = await authenticatedFetch(apiEndpoints.images, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                return Array.isArray(data) ? data : data.results || [];
            } else {
                console.error("Failed to fetch projects");
                return [];
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
            return [];
        }
    }, []);

    const loadProject = useCallback((project) => {
        if (!project) return;
        setCurrentProject(project);

        // Map backend path to full URL
        let imgUrl = project.original_image;
        if (imgUrl && !imgUrl.startsWith('http')) {
            imgUrl = `${NODE_API_URL}${imgUrl}`;
        }
        
        let processedUrl = project.processed_image;
        if (processedUrl && !processedUrl.startsWith('http')) {
            processedUrl = `${NODE_API_URL}${processedUrl}`;
        }

        // AI HUB FIX: Always use canvasStore as the target for project loads
        useCanvasStore.getState().setOriginalImage(imgUrl, 'load-project');
        if (processedUrl) {
            useCanvasStore.getState().pushEdit(processedUrl, 'Loaded Project', 'project-load', {});
        }
        
        setIsCropping(false);
        setIsMasking(false);
        setMaskImage(null);
        setGenerationStatus('');
        setGenerationError(null);
    }, []);

    const resetProject = useCallback(() => {
        setCurrentProject(null);
        useCanvasStore.getState().reset();
        setIsCropping(false);
        setIsMasking(false);
        setMaskImage(null);
        setGenerationStatus('');
        setGenerationError(null);
    }, []);

    const setOriginalImage = useCallback((img) => {
        useCanvasStore.getState().setOriginalImage(img);
    }, []);

    const setProcessedImage = useCallback((img) => {
        useCanvasStore.getState().pushEdit(img, 'Manual Update', 'manual', {});
    }, []);

    // ─── Composition & Export Engine ───
    const captureComposition = useCallback(async (options = {}) => {
        if (!exportRef.current) return null;
        
        setIsExporting(true);
        await new Promise(r => setTimeout(r, 100));

        try {
            const canvas = await html2canvas(exportRef.current, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                scale: 2, // High resolution export
                logging: false,
                ...options
            });
            return canvas.toDataURL('image/png');
        } catch (error) {
            console.error('Capture failed:', error);
            return null;
        } finally {
            setIsExporting(false);
        }
    }, []);

    const contextValue = useMemo(() => ({
        selectedImage: originalImage,
        originalImage,
        processedImage,
        generatedImage,
        isProcessing,
        loadProject,
        currentProject,
        isCropping,
        setIsCropping,
        isMasking,
        setIsMasking,
        maskImage,
        setMaskImage,
        setOriginalImage,
        isGenerating,
        generationStatus,
        generationError,
        generationLimits,
        setGenerationError,
        resetProject,
        setProcessedImage,
        activeFrame,
        setActiveFrame,
        frameScale,
        setFrameScale,
        stickers,
        setStickers,
        isExporting,
        setIsExporting,
        exportRef,
        captureComposition,
        fetchProjects
    }), [
        originalImage, processedImage, generatedImage, isProcessing,
        loadProject, currentProject, isCropping, isMasking, maskImage,
        isGenerating, generationStatus, generationError, generationLimits,
        resetProject, activeFrame, frameScale, stickers, isExporting,
        captureComposition, fetchProjects
    ]);

    return (
        <ImageContext.Provider value={contextValue}>
            {children}
        </ImageContext.Provider>
    );
};

export const useImage = () => {
    const context = useContext(ImageContext);
    if (!context) {
        throw new Error('useImage must be used within an ImageProvider');
    }
    return context;
};
