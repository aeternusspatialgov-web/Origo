
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from './components/Canvas';
import { Sidebar } from './components/Sidebar';
import { Documentation } from './components/Documentation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Board, CanvasItem } from './types';
import { LanguageProvider, useLanguage, tStatic } from './utils/i18n';
import { ORIGO_INITIAL_ITEMS } from './constants';
import { usePersistence } from './hooks/usePersistence';

const DEFAULT_BOARD: Board = {
    id: 'b_demo',
    title: tStatic('demoTitle'),
    description: tStatic('demoDescription'),
    module: 'origo',
    lastEdited: Date.now(),
    itemCount: ORIGO_INITIAL_ITEMS.length,
    items: ORIGO_INITIAL_ITEMS,
    isFavorite: false
};

// --- TOAST COMPONENT ---
interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => (
  <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-medium shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 ${
    type === 'success'
      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
      : 'bg-red-500/20 border border-red-500/40 text-red-300'
  }`}>
    {message}
  </div>
);

type CanvasPersistenceMode = 'default' | 'deferred' | 'flush';

// --- INNER APP (inside LanguageProvider, has access to t()) ---
const AppContent: React.FC = () => {
  const { t } = useLanguage();

  const [currentBoard, setCurrentBoard] = useState<Board>(DEFAULT_BOARD);
  const [boardVersion, setBoardVersion] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const getBoardStateRef = useRef<() => { items: CanvasItem[] } | null>(null);
  const currentBoardRef = useRef<Board>(DEFAULT_BOARD);
  const liveItemsRef = useRef<CanvasItem[]>(DEFAULT_BOARD.items);
  const isDirtyRef = useRef(false);

  const getLiveBoard = useCallback((): Board => {
      const latestItems = getBoardStateRef.current?.().items ?? liveItemsRef.current ?? currentBoardRef.current.items;
      return {
          ...currentBoardRef.current,
          items: latestItems,
          itemCount: latestItems.length
      };
  }, []);

  const getLiveSessionSnapshot = useCallback(() => ({
      board: getLiveBoard(),
      isDirty: isDirtyRef.current
  }), [getLiveBoard]);

  const {
      loadBackup,
      openFile,
      saveFile,
      resetHandle,
      queueSessionPersist,
      flushSessionPersist
  } = usePersistence(currentBoard, getLiveSessionSnapshot);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [toast, setToast] = useState<ToastProps | null>(null);

  useEffect(() => {
      currentBoardRef.current = currentBoard;
  }, [currentBoard]);

  useEffect(() => {
      isDirtyRef.current = isDirty;
  }, [isDirty]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // --- INITIALIZATION ---
  useEffect(() => {
      const init = async () => {
          try {
              const backup = await loadBackup();
              if (backup) {
                  setCurrentBoard(backup.board);
                  currentBoardRef.current = backup.board;
                  liveItemsRef.current = backup.board.items;
                  isDirtyRef.current = backup.meta?.isDirty ?? backup.board.id !== 'b_demo';
                  setBoardVersion(v => v + 1);
                  setIsDirty(isDirtyRef.current);
              }
          } catch (e) {
              console.error("Init failed", e);
          }
          setIsInitialized(true);
      };
      init();
  }, []);

  // --- ACTIONS ---

  const handleNewFileRequest = () => {
      if (isDirty && currentBoard.id !== 'b_demo') {
          if (!confirm(tStatic('unsavedChangesConfirm'))) return;
      }

      const newBoard: Board = {
          id: Math.random().toString(36).substr(2, 9),
          title: tStatic('newBoardTitle'),
          description: '',
          module: 'origo',
          lastEdited: Date.now(),
          itemCount: 0,
          items: []
      };

      setCurrentBoard(newBoard);
      currentBoardRef.current = newBoard;
      liveItemsRef.current = newBoard.items;
      isDirtyRef.current = false;
      setBoardVersion(v => v + 1);
      resetHandle();
      setIsDirty(false);
      setIsSidebarOpen(false);
      flushSessionPersist({ force: true });
  };

  const handleOpenFileRequest = async () => {
      if (isDirty && currentBoard.id !== 'b_demo') {
          if (!confirm(tStatic('unsavedChangesConfirm'))) return;
      }

      try {
          const board = await openFile();
          if (board) {
              setCurrentBoard(board);
              currentBoardRef.current = board;
              liveItemsRef.current = board.items;
              isDirtyRef.current = false;
              setBoardVersion(v => v + 1);
              setIsDirty(false);
              setIsSidebarOpen(false);
              flushSessionPersist({ force: true });
          }
      } catch (e) {
          console.error("Open file failed", e);
          showToast(tStatic('fileCorrupted'), 'error');
      }
  };

  const handleSaveFile = async () => {
      const liveBoard = getLiveBoard();
      const boardToSave = {
          ...liveBoard,
          lastEdited: Date.now()
      };

      try {
          const success = await saveFile(boardToSave);
          if (success) {
              isDirtyRef.current = false;
              setIsDirty(false);
              setCurrentBoard(boardToSave);
              currentBoardRef.current = boardToSave;
              liveItemsRef.current = boardToSave.items;
              flushSessionPersist({ force: true });
              showToast(t('saveSuccess'));
          }
      } catch (e) {
          console.error("Save file failed", e);
          showToast(t('saveError'), 'error');
      }
  };

  const handleCanvasChange = useCallback(({
      items,
      persistenceMode = 'default'
  }: {
      items: CanvasItem[];
      persistenceMode?: CanvasPersistenceMode;
  }) => {
      liveItemsRef.current = items;
      currentBoardRef.current = {
          ...currentBoardRef.current,
          items,
          itemCount: items.length,
          lastEdited: Date.now()
      };

      isDirtyRef.current = true;
      setIsDirty(prev => (prev ? prev : true));
      if (persistenceMode === 'flush') {
          flushSessionPersist();
          return;
      }

      if (persistenceMode === 'deferred') {
          queueSessionPersist({ debounceMs: 220 });
          return;
      }

      queueSessionPersist({ debounceMs: 120 });
  }, [flushSessionPersist, queueSessionPersist]);

  const handleUpdateBoardTitle = (newTitle: string) => {
      const updatedBoard = {
          ...currentBoardRef.current,
          title: newTitle,
          lastEdited: Date.now()
      };

      currentBoardRef.current = updatedBoard;
      liveItemsRef.current = updatedBoard.items;
      isDirtyRef.current = true;
      setCurrentBoard(updatedBoard);
      setIsDirty(true);
      flushSessionPersist({ force: true });
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-canvas-bg text-zinc-100 font-sans animate-in fade-in duration-700">

       {/* Sidebar Container */}
       <div
          className={`h-full border-r border-zinc-800 bg-[#09090b] shadow-2xl transition-all duration-300 ease-in-out absolute left-0 top-0 z-[100] md:relative md:z-auto`}
          style={{
              width: '280px',
              transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
              marginLeft: isSidebarOpen ? 0 : '-280px'
          }}
       >
          <Sidebar
             currentBoard={currentBoard}
             isDirty={isDirty}
             onNewFile={handleNewFileRequest}
             onOpenFromDisk={handleOpenFileRequest}
             onSaveFile={handleSaveFile}
             onClose={() => setIsSidebarOpen(false)}
             onOpenDocs={() => setIsDocsOpen(true)}
             onOpenOnboarding={() => {}}
             onGoToLanding={() => { window.location.href = '/'; }}
          />
      </div>

       {/* Main Canvas Area */}
       <div
          className={`relative h-full transition-all duration-300 ease-in-out overflow-hidden flex flex-col`}
          style={{ width: isSidebarOpen ? 'calc(100vw - 280px)' : '100vw' }}
       >
           {isInitialized && (
               <ErrorBoundary>
                   <Canvas
                      key={`${currentBoard.id}_${boardVersion}`}
                      initialItems={currentBoard.items}
                      onToggleMenu={() => setIsSidebarOpen(prev => !prev)}
                      isMenuOpen={isSidebarOpen}
                      boardTitle={currentBoard.title}
                      isDirty={isDirty && currentBoard.id !== 'b_demo'}
                      onUpdateBoardTitle={handleUpdateBoardTitle}
                      onDataChange={handleCanvasChange}
                      onRegisterGetState={(getter: any) => { getBoardStateRef.current = getter; }}
                   />
               </ErrorBoundary>
           )}

           {isDocsOpen && <Documentation onClose={() => setIsDocsOpen(false)} />}
       </div>

       {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

// --- ROOT APP ---
const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
