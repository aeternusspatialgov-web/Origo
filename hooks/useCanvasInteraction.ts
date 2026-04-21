import React, { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { CanvasItem, Camera, Coordinates } from '../types';

type InteractionMode = 'SELECT' | 'PAN';
type ResizeDirection = 'nw' | 'ne' | 'sw' | 'se';

interface ExtendedDragState {
  mode: 'PAN_CANVAS' | 'MOVE_ITEM' | 'RESIZE_ITEM' | null;
  startScreenPos: Coordinates;
  startObjPos: Coordinates;
  startObjDim?: { w: number, h: number };
  targetId: string | null;
  resizeDir?: ResizeDirection;
  initialItemsSnapshot?: CanvasItem[];
}

interface UseCanvasInteractionProps {
    board: any; // Type from useBoardLogic
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
    isInteractionBlocked?: boolean;
    connectedIds?: Set<string> | null;
}

const DRAG_THRESHOLD = 5;
const GRID_SPACING = 40;
const CAMERA_ROUNDING_FACTOR = 100;

const roundCameraValue = (value: number) => Math.round(value * CAMERA_ROUNDING_FACTOR) / CAMERA_ROUNDING_FACTOR;

const wrapGridOffset = (value: number, spacing: number) => {
    if (!Number.isFinite(value) || !Number.isFinite(spacing) || spacing <= 0) return 0;
    const wrapped = value % spacing;
    return wrapped < 0 ? wrapped + spacing : wrapped;
};

export const useCanvasInteraction = ({
    board,
    isDragging,
    setIsDragging,
    isInteractionBlocked = false,
    connectedIds = null
}: UseCanvasInteractionProps) => {
    void connectedIds;

    const cameraRef = useRef<Camera>({ x: 995, y: 330, z: 0.7 });
    const [cameraState, setCameraState] = useState<Camera>(cameraRef.current);
    const transformElRef = useRef<HTMLDivElement | null>(null);
    const gridElRef = useRef<HTMLDivElement | null>(null);
    const pendingCameraRef = useRef<Camera>(cameraRef.current);
    const cameraPaintFrameRef = useRef<number | null>(null);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [interactionMode, setInteractionMode] = useState<InteractionMode>('SELECT');

    const [dragState, setDragState] = useState<ExtendedDragState>({
        mode: null,
        startScreenPos: { x: 0, y: 0 },
        startObjPos: { x: 0, y: 0 },
        targetId: null
    });

    const paintCamera = useCallback((camera: Camera) => {
        const roundedX = roundCameraValue(camera.x);
        const roundedY = roundCameraValue(camera.y);
        const roundedZ = roundCameraValue(camera.z);

        if (transformElRef.current) {
            transformElRef.current.style.transform = `translate3d(${roundedX}px, ${roundedY}px, 0) scale(${roundedZ})`;
        }

        if (gridElRef.current) {
            const gridSize = Math.max(1, roundCameraValue(GRID_SPACING * roundedZ));

            if (gridSize < 10) {
                gridElRef.current.style.opacity = '0';
            } else if (gridSize < 15) {
                gridElRef.current.style.opacity = String(0.2 * (gridSize - 10) / 5);
            } else {
                gridElRef.current.style.opacity = '0.2';
            }

            gridElRef.current.style.backgroundSize = `${gridSize}px ${gridSize}px`;
            gridElRef.current.style.backgroundPosition = `${roundCameraValue(wrapGridOffset(roundedX, gridSize))}px ${roundCameraValue(wrapGridOffset(roundedY, gridSize))}px`;
        }
    }, []);

    const applyCamera = useCallback((camera: Camera, options?: { immediate?: boolean }) => {
        cameraRef.current = camera;
        pendingCameraRef.current = camera;

        if (options?.immediate) {
            if (cameraPaintFrameRef.current !== null) {
                cancelAnimationFrame(cameraPaintFrameRef.current);
                cameraPaintFrameRef.current = null;
            }
            paintCamera(camera);
            setCameraState(prev => (
                prev.x === camera.x && prev.y === camera.y && prev.z === camera.z
                    ? prev
                    : { x: camera.x, y: camera.y, z: camera.z }
            ));
            return;
        }

        if (cameraPaintFrameRef.current !== null) return;

        cameraPaintFrameRef.current = window.requestAnimationFrame(() => {
            cameraPaintFrameRef.current = null;
            const current = pendingCameraRef.current;
            paintCamera(current);
            setCameraState(prev => (
                prev.x === current.x && prev.y === current.y && prev.z === current.z
                    ? prev
                    : { x: current.x, y: current.y, z: current.z }
            ));
        });
    }, [paintCamera]);

    const flushCamera = useCallback(() => {
        setCameraState(prev => {
            const current = cameraRef.current;
            if (prev.x === current.x && prev.y === current.y && prev.z === current.z) return prev;
            return { x: current.x, y: current.y, z: current.z };
        });
    }, []);

    useLayoutEffect(() => {
        applyCamera(cameraRef.current, { immediate: true });
    }, [applyCamera]);

    const flushTimerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
            if (cameraPaintFrameRef.current !== null) cancelAnimationFrame(cameraPaintFrameRef.current);
        };
    }, []);

    const handleZoom = useCallback((delta: number) => {
        const current = cameraRef.current;
        const newZoom = Math.min(Math.max(current.z + delta, 0.2), 3);
        applyCamera({ ...current, z: newZoom });
        flushCamera();
    }, [applyCamera, flushCamera]);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (isInteractionBlocked) return;

        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleZoom(e.deltaY > 0 ? -0.1 : 0.1);
            return;
        }

        const current = cameraRef.current;
        applyCamera({ x: current.x - e.deltaX, y: current.y - e.deltaY, z: current.z });

        if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
        flushTimerRef.current = window.setTimeout(() => {
            flushCamera();
            flushTimerRef.current = null;
        }, 100);
    }, [isInteractionBlocked, handleZoom, applyCamera, flushCamera]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (isInteractionBlocked) return;

        const target = e.target as HTMLElement;
        if (target.closest('.board-menu-trigger') || target.closest('.board-dropdown') || target.closest('button')) {
            return;
        }

        if (!target.closest('.canvas-item') && !target.closest('.backlog-panel')) {
            setSelectedId(null);
            if (e.button === 0 || e.button === 1) {
                const current = cameraRef.current;
                setDragState({
                    mode: 'PAN_CANVAS',
                    startScreenPos: { x: e.clientX, y: e.clientY },
                    startObjPos: { x: current.x, y: current.y },
                    targetId: null
                });
            }
        }
    }, [isInteractionBlocked]);

    const handleItemMouseDown = useCallback((e: React.MouseEvent, id: string, resizeDir?: ResizeDirection) => {
        if (interactionMode === 'PAN' || isInteractionBlocked) return;

        const item = board.visibleItems.find((candidate: CanvasItem) => candidate.id === id);
        if (!item) return;

        e.stopPropagation();

        const maxZ = Math.max(...board.visibleItems.map((candidate: CanvasItem) => candidate.zIndex), 10);
        if (item.zIndex < maxZ) {
            board.updateItem(id, { zIndex: maxZ + 1 }, false);
        }

        setSelectedId(id);
        setDragState({
            mode: resizeDir ? 'RESIZE_ITEM' : 'MOVE_ITEM',
            resizeDir,
            startScreenPos: { x: e.clientX, y: e.clientY },
            startObjPos: { x: item.x, y: item.y },
            startObjDim: { w: item.width, h: item.height },
            targetId: id,
            initialItemsSnapshot: JSON.parse(JSON.stringify(board.visibleItems))
        });
    }, [interactionMode, isInteractionBlocked, board]);

    const handleDragMove = useCallback((clientX: number, clientY: number) => {
        if (isInteractionBlocked || !dragState.mode) return;

        let dragActive = isDragging;
        if (!dragActive) {
            const thresholdX = Math.abs(clientX - dragState.startScreenPos.x);
            const thresholdY = Math.abs(clientY - dragState.startScreenPos.y);
            if (thresholdX > DRAG_THRESHOLD || thresholdY > DRAG_THRESHOLD) {
                dragActive = true;
                setIsDragging(true);
            } else {
                return;
            }
        }

        const dx = clientX - dragState.startScreenPos.x;
        const dy = clientY - dragState.startScreenPos.y;

        if (dragState.mode === 'PAN_CANVAS') {
            applyCamera({ ...cameraRef.current, x: dragState.startObjPos.x + dx, y: dragState.startObjPos.y + dy });
            return;
        }

        const worldDx = dx / cameraRef.current.z;
        const worldDy = dy / cameraRef.current.z;

        if (!dragState.targetId || interactionMode !== 'SELECT') return;

        const item = board.visibleItems.find((candidate: CanvasItem) => candidate.id === dragState.targetId);
        if (!item) return;

        if (dragState.mode === 'MOVE_ITEM') {
            board.updateItem(item.id, {
                x: dragState.startObjPos.x + worldDx,
                y: dragState.startObjPos.y + worldDy
            }, false);
            return;
        }

        if (dragState.mode === 'RESIZE_ITEM' && dragState.startObjDim && dragState.resizeDir) {
            const { w: startW, h: startH } = dragState.startObjDim;
            const { x: startX, y: startY } = dragState.startObjPos;
            let newX = startX;
            let newY = startY;
            let newW = startW;
            let newH = startH;

            if (dragState.resizeDir.includes('e')) newW = Math.max(20, startW + worldDx);
            if (dragState.resizeDir.includes('s')) newH = Math.max(20, startH + worldDy);
            if (dragState.resizeDir.includes('w')) {
                newW = Math.max(20, startW - worldDx);
                newX = startX + (startW - newW);
            }
            if (dragState.resizeDir.includes('n')) {
                newH = Math.max(20, startH - worldDy);
                newY = startY + (startH - newH);
            }

            board.updateItem(item.id, { x: newX, y: newY, width: newW, height: newH }, false);
        }
    }, [isDragging, isInteractionBlocked, dragState, interactionMode, board, setIsDragging, applyCamera]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        handleDragMove(e.clientX, e.clientY);
    }, [handleDragMove]);

    const finishDrag = useCallback(() => {
        if (!dragState.mode && !isDragging) return;

        if (isDragging && dragState.targetId && dragState.initialItemsSnapshot) {
            board.registerSnapshot(dragState.initialItemsSnapshot);

            const oldState = dragState.initialItemsSnapshot.find((item: CanvasItem) => item.id === dragState.targetId);
            if (oldState) {
                board.logPersistentUpdate(dragState.targetId, oldState);
            }
        }

        flushCamera();
        setDragState(prev => prev.mode
            ? { ...prev, mode: null, targetId: null, resizeDir: undefined, startObjDim: undefined, initialItemsSnapshot: undefined }
            : prev
        );
        setIsDragging(false);
    }, [isDragging, dragState, board, setIsDragging, flushCamera]);

    const handleMouseUp = useCallback(() => {
        finishDrag();
    }, [finishDrag]);

    useEffect(() => {
        if (!dragState.mode) return;

        const handleWindowMouseMove = (e: MouseEvent) => {
            handleDragMove(e.clientX, e.clientY);
        };

        const handleWindowMouseUp = () => {
            finishDrag();
        };

        window.addEventListener('mousemove', handleWindowMouseMove);
        window.addEventListener('mouseup', handleWindowMouseUp);
        window.addEventListener('blur', handleWindowMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove);
            window.removeEventListener('mouseup', handleWindowMouseUp);
            window.removeEventListener('blur', handleWindowMouseUp);
        };
    }, [dragState.mode, handleDragMove, finishDrag]);

    return {
        camera: cameraState,
        cameraRef,
        setCamera: (camera: Camera) => { applyCamera(camera); flushCamera(); },
        selectedId,
        setSelectedId,
        interactionMode,
        setInteractionMode,
        dragState,
        transformElRef,
        gridElRef,
        handleWheel,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleItemMouseDown,
        handleZoom
    };
};
