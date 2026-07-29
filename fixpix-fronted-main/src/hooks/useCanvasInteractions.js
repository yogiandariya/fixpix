import { useEffect, useCallback, useRef } from 'react';
import useCanvasStore from '../store/canvasStore';

export const useCanvasInteractions = (viewportRef) => {
  const zoom = useCanvasStore(state => state.zoom);
  const offset = useCanvasStore(state => state.offset);
  const setZoom = useCanvasStore(state => state.setZoom);
  const setOffset = useCanvasStore(state => state.setOffset);
  const viewMode = useCanvasStore(state => state.viewMode);
  const setViewMode = useCanvasStore(state => state.setViewMode);
  
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const isSpacePressed = useRef(false);

  // 1. Zoom Logic (Cursor Centric)
  const handleZoom = useCallback((delta, clientX, clientY) => {
    if (!viewportRef.current) return;
    
    const rect = viewportRef.current.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    // Calculate mouse position relative to the current scaled image
    const zoomIn = delta < 0;
    const factor = zoomIn ? 1.1 : 0.9;
    const newZoom = Math.min(5, Math.max(0.1, zoom * factor));

    if (newZoom === zoom) return;

    // Adjust offset to keep point under cursor
    const dx = (mouseX - offset.x) / zoom;
    const dy = (mouseY - offset.y) / zoom;
    
    const newOffsetX = mouseX - dx * newZoom;
    const newOffsetY = mouseY - dy * newZoom;

    setZoom(newZoom);
    setOffset({ x: newOffsetX, y: newOffsetY });
    setViewMode('custom');
  }, [zoom, offset, setZoom, setOffset, setViewMode, viewportRef]);

  // 2. Wheel Event (Zoom/Scroll)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      // If Ctrl is held (or trackpad pinch), zoom
      if (e.ctrlKey || Math.abs(e.deltaY) < 50) {
        handleZoom(-e.deltaY, e.clientX, e.clientY);
      } else {
        // Normal scroll = Pan (DISABLED per user request to keep image fixed)
        // setOffset({
        //   x: offset.x - e.deltaX,
        //   y: offset.y - e.deltaY
        // });
        // setViewMode('custom');
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [handleZoom, offset, setOffset, setViewMode, viewportRef]);

  // 3. Mouse Panning (Spacebar or Middle Click)
  useEffect(() => {
    const onKeyDown = (e) => { if (e.code === 'Space') isSpacePressed.current = true; };
    const onKeyUp = (e) => { if (e.code === 'Space') isSpacePressed.current = false; };
    
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    
    const el = viewportRef.current;
    if (!el) return;

    const onMouseDown = (e) => {
      if (isSpacePressed.current || e.button === 1) {
        isDragging.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        el.style.cursor = 'grabbing';
      }
    };

    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      
      setOffset({
        x: offset.x + dx,
        y: offset.y + dy
      });
      setViewMode('custom');
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging.current = false;
      el.style.cursor = isSpacePressed.current ? 'grab' : 'auto';
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [offset, setOffset, setViewMode, viewportRef]);

  // 4. Double Click Toggle
  const handleDoubleClick = useCallback((e) => {
    if (viewMode === 'fit') {
      // Zoom to 100% at click position
      handleZoom(0, e.clientX, e.clientY); // Logic for 100% can be refined
      setViewMode('actual');
      setZoom(1.0);
    } else {
      setViewMode('fit');
    }
  }, [viewMode, setViewMode, setZoom, handleZoom]);

  return { handleZoom, handleDoubleClick };
};
