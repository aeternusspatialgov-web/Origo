
import { useState, useEffect, useCallback, useRef } from 'react';
import { Board } from '../types';
import {
    saveSessionToDB,
    loadSessionFromDB,
    saveFileHandle,
    getFileHandle,
    saveRecentEntry,
    getRecentFilesList
} from '../utils/storage';
import { tStatic } from '../utils/i18n';

// --- TYPES FOR FILE SYSTEM ACCESS API ---
interface FileSystemHandle {
    kind: 'file' | 'directory';
    name: string;
}

interface FileSystemFileHandle extends FileSystemHandle {
    kind: 'file';
    getFile(): Promise<File>;
    createWritable(): Promise<FileSystemWritableFileStream>;
    queryPermission(descriptor?: any): Promise<PermissionState>;
    requestPermission(descriptor?: any): Promise<PermissionState>;
}

interface FileSystemWritableFileStream extends WritableStream {
    write(data: any): Promise<void>;
    seek(position: number): Promise<void>;
    truncate(size: number): Promise<void>;
    close(): Promise<void>;
}

declare global {
    interface Window {
        showOpenFilePicker(options?: any): Promise<FileSystemFileHandle[]>;
        showSaveFilePicker(options?: any): Promise<FileSystemFileHandle>;
    }
}

interface PersistenceState {
    fileHandle: FileSystemFileHandle | null;
    fileName: string | null;
    isAutoSaving: boolean;
    recentFiles: Board[];
}

interface SessionMeta {
    lastActive: number;
    hasHandle: boolean;
    isDirty: boolean;
}

interface SessionSnapshot {
    board: Board;
    isDirty: boolean;
}

interface BackupPayload {
    board: Board;
    meta: SessionMeta | null;
}

export const usePersistence = (currentBoard: Board, getLiveSession?: () => SessionSnapshot) => {
    const [state, setState] = useState<PersistenceState>({
        fileHandle: null,
        fileName: null,
        isAutoSaving: false,
        recentFiles: []
    });

    const lastSavedBoardStr = useRef<string>("");
    const currentBoardRef = useRef<Board>(currentBoard);
    const getLiveSessionRef = useRef<typeof getLiveSession>(getLiveSession);
    const fileHandleRef = useRef<FileSystemFileHandle | null>(null);
    const pendingPersistFrameRef = useRef<number | null>(null);
    const pendingPersistTimeoutRef = useRef<number | null>(null);
    const isPersistingRef = useRef(false);
    const shouldPersistAgainRef = useRef(false);
    const hasPendingSessionMutationRef = useRef(false);

    useEffect(() => {
        currentBoardRef.current = currentBoard;
    }, [currentBoard]);

    useEffect(() => {
        getLiveSessionRef.current = getLiveSession;
    }, [getLiveSession]);

    useEffect(() => {
        fileHandleRef.current = state.fileHandle;
    }, [state.fileHandle]);

    // --- INITIALIZATION ---
    useEffect(() => {
        refreshRecents();
    }, []);

    const refreshRecents = async () => {
        try {
            const list = await getRecentFilesList();
            const sorted = list.sort((a, b) => b.lastEdited - a.lastEdited);
            setState(prev => ({ ...prev, recentFiles: sorted as Board[] }));
        } catch (e) {
            console.error("Failed to load recents", e);
        }
    };

    // --- INTERNAL: ADD TO RECENTS & PERSIST HANDLE ---
    const addToRecents = async (board: Board, handle?: FileSystemFileHandle) => {
        const entry = {
            id: board.id,
            title: board.title,
            lastEdited: Date.now(),
            itemCount: board.items.length
        };

        try {
            await saveRecentEntry(entry);
            if (handle) {
                await saveFileHandle(board.id, handle);
            }
            setState(prev => {
                const others = prev.recentFiles.filter(f => f.id !== board.id);
                const newItem = { ...entry, items: [] } as unknown as Board;
                return {
                    ...prev,
                    recentFiles: [newItem, ...others]
                };
            });
        } catch (e) {
            console.error("Failed to update recents/handles", e);
        }
    };

    const buildLiveSession = useCallback((): { board: Board; meta: SessionMeta; serialized: string } => {
        const liveSession = getLiveSessionRef.current?.();
        const liveBoard = liveSession?.board ?? currentBoardRef.current;
        const normalizedBoard: Board = {
            ...liveBoard,
            itemCount: liveBoard.items.length
        };
        const meta: SessionMeta = {
            lastActive: Date.now(),
            hasHandle: !!fileHandleRef.current,
            isDirty: liveSession?.isDirty ?? false
        };

        return {
            board: normalizedBoard,
            meta,
            serialized: JSON.stringify({ board: normalizedBoard, meta })
        };
    }, []);

    const persistSessionSnapshot = useCallback(async (options?: { force?: boolean }) => {
        if (isPersistingRef.current) {
            shouldPersistAgainRef.current = true;
            return;
        }

        if (!hasPendingSessionMutationRef.current && !options?.force) {
            return;
        }

        const snapshot = buildLiveSession();
        if (!options?.force && snapshot.serialized === lastSavedBoardStr.current) {
            hasPendingSessionMutationRef.current = false;
            return;
        }

        isPersistingRef.current = true;
        setState(prev => (prev.isAutoSaving ? prev : { ...prev, isAutoSaving: true }));

        try {
            await saveSessionToDB('current_session', snapshot.board);
            await saveSessionToDB('session_meta', snapshot.meta);
            lastSavedBoardStr.current = snapshot.serialized;
            hasPendingSessionMutationRef.current = false;
        } catch (err) {
            console.error("Session persist failed", err);
        } finally {
            isPersistingRef.current = false;
            setState(prev => (prev.isAutoSaving ? { ...prev, isAutoSaving: false } : prev));

            if (shouldPersistAgainRef.current) {
                shouldPersistAgainRef.current = false;
                void persistSessionSnapshot();
            }
        }
    }, [buildLiveSession]);

    const clearPendingPersistTimers = useCallback(() => {
        if (pendingPersistFrameRef.current !== null) {
            window.cancelAnimationFrame(pendingPersistFrameRef.current);
            pendingPersistFrameRef.current = null;
        }

        if (pendingPersistTimeoutRef.current !== null) {
            window.clearTimeout(pendingPersistTimeoutRef.current);
            pendingPersistTimeoutRef.current = null;
        }
    }, []);

    const queueSessionPersist = useCallback((options?: { immediate?: boolean; force?: boolean; debounceMs?: number }) => {
        hasPendingSessionMutationRef.current = true;

        const runPersist = () => {
            pendingPersistFrameRef.current = null;
            pendingPersistTimeoutRef.current = null;
            void persistSessionSnapshot({ force: options?.force });
        };

        if (options?.immediate) {
            clearPendingPersistTimers();
            runPersist();
            return;
        }

        if ((options?.debounceMs ?? 0) > 0) {
            if (pendingPersistTimeoutRef.current !== null) {
                window.clearTimeout(pendingPersistTimeoutRef.current);
            }

            pendingPersistTimeoutRef.current = window.setTimeout(runPersist, options?.debounceMs);
            return;
        }

        if (pendingPersistFrameRef.current !== null) {
            return;
        }

        pendingPersistFrameRef.current = window.requestAnimationFrame(runPersist);
    }, [clearPendingPersistTimers, persistSessionSnapshot]);

    const flushSessionPersist = useCallback((options?: { force?: boolean }) => {
        if (!hasPendingSessionMutationRef.current && !options?.force) {
            return;
        }

        clearPendingPersistTimers();
        void persistSessionSnapshot({ force: options?.force ?? true });
    }, [clearPendingPersistTimers, persistSessionSnapshot]);

    useEffect(() => {
        const flushOnLifecycleBoundary = () => {
            flushSessionPersist();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                flushOnLifecycleBoundary();
            }
        };

        window.addEventListener('pagehide', flushOnLifecycleBoundary);
        window.addEventListener('beforeunload', flushOnLifecycleBoundary);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearPendingPersistTimers();
            window.removeEventListener('pagehide', flushOnLifecycleBoundary);
            window.removeEventListener('beforeunload', flushOnLifecycleBoundary);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [clearPendingPersistTimers, flushSessionPersist]);

    // --- RECOVERY ---
    const loadBackup = useCallback(async (): Promise<BackupPayload | null> => {
        try {
            const [data, meta] = await Promise.all([
                loadSessionFromDB('current_session'),
                loadSessionFromDB('session_meta')
            ]);

            if (data) {
                const handle = await getFileHandle(data.id);
                if (handle) {
                    fileHandleRef.current = handle;
                    setState(prev => ({ ...prev, fileHandle: handle, fileName: handle.name }));
                }
                return {
                    board: data as Board,
                    meta: (meta as SessionMeta | null) ?? null
                };
            }
        } catch (e) {
            console.error("Failed to load backup", e);
        }
        return null;
    }, []);

    // --- FILE OPERATIONS ---

    const getFileContent = (board: Board) => {
        return JSON.stringify({
            meta: {
                version: "2.0",
                app: "Origo",
                exportedAt: new Date().toISOString()
            },
            board
        }, null, 2);
    };

    const parseFileContent = async (text: string): Promise<Board> => {
        try {
            const json = JSON.parse(text);
            if (json.meta && json.board) {
                return json.board;
            }
            return json as Board;
        } catch (e) {
            throw new Error(tStatic('fileCorrupted'));
        }
    };

    // 1. SAVE = ALWAYS TRIGGER "SAVE AS"
    const saveFile = async (boardOverride?: Board): Promise<boolean> => {
        return await saveAs(boardOverride);
    };

    // 2. SAVE AS (The Single Source of Truth)
    const saveAs = async (boardOverride?: Board): Promise<boolean> => {
        const boardToSave = boardOverride || currentBoard;
        const content = getFileContent(boardToSave);
        let nativeSuccess = false;

        const sanitizedTitle = boardToSave.title
            .replace(/[^a-z0-9\s-_]/gi, '')
            .trim()
            .replace(/\s+/g, '_')
            .toLowerCase();

        const suggestedName = `${sanitizedTitle || 'universo'}.origo`;

        // Try Native API First (Chromium-based browsers)
        if (typeof window.showSaveFilePicker === 'function') {
            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName,
                    types: [{
                        description: 'Origo Universe File',
                        accept: { 'application/json': ['.origo', '.json'] }
                    }]
                });

                const writable = await handle.createWritable();
                await writable.write(content);
                await writable.close();

                fileHandleRef.current = handle;
                setState(prev => ({ ...prev, fileHandle: handle, fileName: handle.name }));
                await addToRecents(boardToSave, handle);

                nativeSuccess = true;
                return true;
            } catch (err: any) {
                if (err.name === 'AbortError') return false; // User cancelled
                console.warn("Native Save Picker Failed:", err);
            }
        }

        // Fallback: Legacy Download
        if (!nativeSuccess) {
            try {
                const blob = new Blob([content], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = suggestedName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                await addToRecents(boardToSave);
                return true;
            } catch (e) {
                console.error("Fallback Save Failed", e);
                return false;
            }
        }

        return false;
    };

    // 3. OPEN FROM DISK
    const openFile = async (): Promise<Board | null> => {
        if (typeof window.showOpenFilePicker === 'function') {
            try {
                const [handle] = await window.showOpenFilePicker({
                    types: [{
                        description: 'Origo Universe File',
                        accept: { 'application/json': ['.origo', '.json'] }
                    }],
                    multiple: false
                });

                const file = await handle.getFile();
                const text = await file.text();
                const board = await parseFileContent(text);

                fileHandleRef.current = handle;
                setState(prev => ({ ...prev, fileHandle: handle, fileName: file.name }));
                await addToRecents(board, handle);

                return board;
            } catch (err: any) {
                if (err.name === 'AbortError') return null;
                console.warn("Native Open Picker Error:", err);
            }
        }

        // Fallback Input
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.origo,.json';
            input.style.display = 'none';
            document.body.appendChild(input);

            input.onchange = async (e: any) => {
                const file = e.target.files?.[0];
                if (!file) { resolve(null); return; }
                const reader = new FileReader();
                reader.onload = async (re) => {
                    try {
                        const board = await parseFileContent(re.target?.result as string);
                        fileHandleRef.current = null;
                        setState(prev => ({ ...prev, fileHandle: null, fileName: file.name }));
                        await addToRecents(board);
                        resolve(board);
                    } catch (err) {
                        console.error(tStatic('fileReadError'), err);
                        resolve(null);
                    }
                };
                reader.readAsText(file);
                document.body.removeChild(input);
            };
            input.click();
        });
    };

    // 4. LOAD RECENT (From Sidebar)
    const loadRecent = async (recentMetadata: Board): Promise<Board | null> => {
        const handle = await getFileHandle(recentMetadata.id);

        if (handle) {
            try {
                const perm = await handle.queryPermission({ mode: 'read' });
                if (perm !== 'granted') {
                    const request = await handle.requestPermission({ mode: 'read' });
                    if (request !== 'granted') throw new Error("Permission denied");
                }

                const file = await handle.getFile();
                const text = await file.text();
                const board = await parseFileContent(text);

                fileHandleRef.current = handle;
                setState(prev => ({ ...prev, fileHandle: handle, fileName: file.name }));
                await addToRecents(board, handle);
                return board;

            } catch (e) {
                console.warn("Handle expired or file moved.", e);
                const asciiRecoveryMessage = 'Arquivo nao encontrado. Localizar manualmente?';
                const shouldRecoverAscii = window.confirm(`"${recentMetadata.title}" - ${asciiRecoveryMessage}`);
                if (shouldRecoverAscii) {
                    return openFile();
                }
                return null;
                /*
                const recoveryMessage = tStatic('fileCorrupted').replace(
                    'Arquivo corrompido ou formato inválido.',
                    'arquivo não encontrado. Localizar manualmente?'
                );
                const shouldRecover = window.confirm(`"${recentMetadata.title}" - ${recoveryMessage}`);
                if (shouldRecover) {
                    return openFile();
                }
                return null;
                const confirmOpen = window.confirm(`"${recentMetadata.title}" — ${tStatic('fileCorrupted').replace('Arquivo corrompido ou formato inválido.', 'arquivo não encontrado. Localizar manualmente?')}`);
                if (confirmOpen) {
                    return openFile();
                }
                return null;
                */
            }
        } else {
            const confirmOpen = window.confirm(`"${recentMetadata.title}" — abrir manualmente?`);
            if (confirmOpen) {
                return openFile();
            }
            return null;
        }
    };

    const resetHandle = () => {
        fileHandleRef.current = null;
        setState({ fileHandle: null, fileName: null, isAutoSaving: false, recentFiles: state.recentFiles });
    };

    return {
        ...state,
        saveFile,
        saveAs,
        openFile,
        loadRecent,
        loadBackup,
        resetHandle,
        queueSessionPersist,
        flushSessionPersist
    };
};
