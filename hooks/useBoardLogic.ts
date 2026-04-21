
import { useState, useCallback } from 'react';
import { CanvasItem, ItemType } from '../types';

const MAX_HISTORY_DEPTH = 50;

interface HistoryState {
    items: CanvasItem[];
}

export const useBoardLogic = (initialItems: CanvasItem[] = []) => {
    const [items, setItems] = useState<CanvasItem[]>(initialItems);

    // --- UNDO / REDO STATE (Session) ---
    const [history, setHistory] = useState<HistoryState[]>([]);
    const [future, setFuture] = useState<HistoryState[]>([]);

    // --- HISTORY ACTIONS (Session Undo) ---

    // Captures CURRENT state as "Past" before a change happens
    const commitToHistory = useCallback(() => {
        setHistory(prev => {
            const newState = { items: JSON.parse(JSON.stringify(items)) };
            const newHistory = [...prev, newState];
            if (newHistory.length > MAX_HISTORY_DEPTH) newHistory.shift();
            return newHistory;
        });
        setFuture([]); // Clear future on new branch
    }, [items]);

    // Allows injecting a specific PAST state (used for Drag End)
    const registerSnapshot = useCallback((pastItems: CanvasItem[]) => {
        setHistory(prev => {
            const newState = { items: JSON.parse(JSON.stringify(pastItems)) };
            const newHistory = [...prev, newState];
            if (newHistory.length > MAX_HISTORY_DEPTH) newHistory.shift();
            return newHistory;
        });
        setFuture([]);
    }, []);

    const undo = useCallback(() => {
        if (history.length === 0) return;

        const previousState = history[history.length - 1];
        const newHistory = history.slice(0, -1);

        // Push CURRENT to future
        setFuture(prev => [{ items: JSON.parse(JSON.stringify(items)) }, ...prev]);

        // Restore PAST
        setHistory(newHistory);
        setItems(previousState.items);
    }, [history, items]);

    const redo = useCallback(() => {
        if (future.length === 0) return;

        const nextState = future[0];
        const newFuture = future.slice(1);

        // Push CURRENT to history
        setHistory(prev => [...prev, { items: JSON.parse(JSON.stringify(items)) }]);

        // Restore FUTURE
        setFuture(newFuture);
        setItems(nextState.items);
    }, [future, items]);

    // --- DATA ACTIONS ---

    const updateItem = useCallback((id: string, updates: any, commit = true) => {
        if (commit) {
            commitToHistory();
        }

        setItems(prev => {
            const updated = prev.map(item => item.id === id ? { ...item, ...updates } : item);
            return updated;
        });
    }, [commitToHistory]);

    const updateItemPositions = useCallback((updates: {id: string, x: number, y: number}[]) => {
        const updateMap = new Map(updates.map(u => [u.id, u]));

        setItems(prev => {
            return prev.map(item => {
                const update = updateMap.get(item.id);
                if (update) {
                    return { ...item, x: update.x, y: update.y };
                }
                return item;
            });
        });
    }, []);

    const logPersistentUpdate = useCallback((id: string, oldItemState: CanvasItem) => {
        // No-op: snapshot is captured before drag
    }, []);

    const deleteItem = useCallback((id: string, commit = true) => {
        if (commit) {
            commitToHistory();
        }
        setItems(prev => prev.filter(i => i.id !== id));
    }, [commitToHistory]);

    const createItems = useCallback((newItems: CanvasItem[], commit = true) => {
        if (commit) {
            commitToHistory();
        }
        setItems(prev => [...prev, ...newItems]);
    }, [commitToHistory]);

    const addItem = useCallback((type: ItemType, camera: {x: number, y: number, z: number}, viewport?: { width: number, height: number }) => {
        const viewportWidth = viewport?.width ?? window.innerWidth;
        const viewportHeight = viewport?.height ?? window.innerHeight;
        const newItem: any = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            x: (-camera.x + viewportWidth / 2) / camera.z,
            y: (-camera.y + viewportHeight / 2) / camera.z,
            width: 200,
            height: 60,
            zIndex: 10,
            isSelected: true,
            title: `Novo ${type}`,
            createdAt: Date.now(),
            color: '#3f3f46'
        };

        if (type === 'NOTE') {
            newItem.content = '';
            newItem.color = '#27272a';
            newItem.width = 240;
            newItem.height = 240;
        }
        if (type === 'TEAM') {
            newItem.color = '#4f46e5';
            newItem.width = 500;
            newItem.height = 300;
        }
        if (type === 'PERSON') {
            newItem.color = '#10b981';
            newItem.role = 'Membro';
            newItem.width = 280;
            newItem.height = 100;
        }
        if (type === 'EVIDENCE') {
            newItem.color = '#f59e0b';
            newItem.content = '';
            newItem.sentiment = 'neutral';
            newItem.width = 200;
            newItem.height = 120;
        }

        createItems([newItem]);
        return newItem.id;
    }, [createItems]);

    return {
        items,
        visibleItems: items,
        setItems,
        updateItem,
        updateItemPositions,
        deleteItem,
        createItems,
        addItem,
        undo,
        redo,
        canUndo: history.length > 0,
        canRedo: future.length > 0,
        registerSnapshot,
        commitToHistory,
        logPersistentUpdate
    };
};
