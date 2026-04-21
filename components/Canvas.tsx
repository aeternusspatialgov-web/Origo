import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { CanvasItem, ItemType } from '../types';
import { ORIGO_INITIAL_ITEMS } from '../constants';
import { useBoardLogic } from '../hooks/useBoardLogic';
import { useCanvasInteraction } from '../hooks/useCanvasInteraction';

import { Toolbar, OrigoAIIcon } from './Toolbar';
import { useLanguage } from '../utils/i18n';
import { Inspector } from './Inspector';
import { OrigoSynthesisReport } from './OrigoSynthesisReport';
import { GridLayer } from './CanvasLayers/GridLayer';
import { ConnectionsLayer, SceneViewportBounds } from './CanvasLayers/ConnectionsLayer';
import { ItemsLayer } from './CanvasLayers/ItemsLayer';
import { runCorrelationEngine } from '../utils/correlationEngine';

export interface DiagnosticBadge {
  isSPOF: boolean;
  spofScore: number;
  isCriticalLoad: boolean;
  hasContradiction: boolean;
  hasPerceptionGap: boolean;
  perceptionGapType?: 'blind_spot' | 'impostor';
}

import { Hand, MousePointer2, Plus, Minus, Check, X as XIcon, Menu } from 'lucide-react';

interface CanvasProps {
    initialItems?: CanvasItem[];
    onToggleMenu?: () => void;
    isMenuOpen?: boolean;
    boardTitle?: string;
    isDirty?: boolean;
    onUpdateBoardTitle?: (newTitle: string) => void;
    onDeleteBoard?: () => void;
    onDataChange?: (state: { items: CanvasItem[]; persistenceMode?: 'default' | 'deferred' | 'flush' }) => void;
    onRegisterGetState?: (getter: () => { items: CanvasItem[] }) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
    initialItems = ORIGO_INITIAL_ITEMS,
    onToggleMenu,
    isMenuOpen,
    boardTitle = '',
    isDirty = false,
    onUpdateBoardTitle,
    onDeleteBoard,
    onDataChange,
    onRegisterGetState
}) => {
  void onDeleteBoard;

  const [isDragging, setIsDragging] = useState(false);
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState(() => ({
      width: typeof window !== 'undefined' ? window.innerWidth : 0,
      height: typeof window !== 'undefined' ? window.innerHeight : 0,
  }));

  const [isSystemicAnalysisOpen, setIsSystemicAnalysisOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const hasMountedItemsRef = useRef(false);

  const board = useBoardLogic(initialItems);

  const interaction = useCanvasInteraction({
      board,
      isDragging,
      setIsDragging,
      isInteractionBlocked: isSystemicAnalysisOpen
  });
  const previousDragModeRef = useRef<typeof interaction.dragState.mode>(null);

  const diagnosticsMapRef = useRef<Map<string, DiagnosticBadge>>(new Map());
  const diagnosticsMap = useMemo(() => {
    if (isDragging) return diagnosticsMapRef.current;

    const map = new Map<string, DiagnosticBadge>();
    if (board.items.length === 0) {
      diagnosticsMapRef.current = map;
      return map;
    }

    const blank = (): DiagnosticBadge => ({
      isSPOF: false,
      spofScore: 0,
      isCriticalLoad: false,
      hasContradiction: false,
      hasPerceptionGap: false
    });

    const report = runCorrelationEngine(board.items);

    report.spofs.forEach(spof => {
      const current = map.get(spof.entityId) ?? blank();
      map.set(spof.entityId, { ...current, isSPOF: true, spofScore: spof.score });
    });

    report.cognitiveLoad.forEach(load => {
      if (load.load !== 'critical') return;
      const current = map.get(load.entityId) ?? blank();
      map.set(load.entityId, { ...current, isCriticalLoad: true });
    });

    report.contradictions.forEach(contradiction => {
      if (!contradiction.entityId) return;
      const current = map.get(contradiction.entityId) ?? blank();
      map.set(contradiction.entityId, { ...current, hasContradiction: true });
    });

    report.directedContradictions.forEach(contradiction => {
      const currentA = map.get(contradiction.speakerAId) ?? blank();
      map.set(contradiction.speakerAId, { ...currentA, hasContradiction: true });

      const currentB = map.get(contradiction.speakerBId) ?? blank();
      map.set(contradiction.speakerBId, { ...currentB, hasContradiction: true });
    });

    report.perceptionGaps.forEach(gap => {
      const current = map.get(gap.entityId) ?? blank();
      map.set(gap.entityId, { ...current, hasPerceptionGap: true, perceptionGapType: gap.gap });
    });

    diagnosticsMapRef.current = map;
    return map;
  }, [board.items, isDragging]);

  const visibleItems = useMemo(() => {
    const sourceItems = board.visibleItems;
    const collapsedTeamIds = new Set<string>();
    const personTeamById = new Map<string, string>();
    const query = searchQuery.trim().toLowerCase();

    sourceItems.forEach((item: CanvasItem) => {
      if (item.type === 'TEAM' && (item as any).isCollapsed) {
        collapsedTeamIds.add(item.id);
      }
      if (item.type === 'PERSON' && (item as any).teamId) {
        personTeamById.set(item.id, (item as any).teamId);
      }
    });

    return sourceItems.filter(item => {
      if (item.type === 'PERSON' && (item as any).teamId && collapsedTeamIds.has((item as any).teamId)) {
        return false;
      }

      if (item.type === 'EVIDENCE') {
        const links = (item as any).linkedEntityIds || [];
        if (links.length > 0) {
          let hasVisibleLinkedEntity = false;

          for (const linkId of links) {
            if (collapsedTeamIds.has(linkId)) continue;

            const linkedTeamId = personTeamById.get(linkId);
            if (linkedTeamId && collapsedTeamIds.has(linkedTeamId)) continue;

            hasVisibleLinkedEntity = true;
            break;
          }

          if (!hasVisibleLinkedEntity) return false;
        }
      }

      if (typeFilter !== 'all' && item.type !== typeFilter) return false;

      if (query) {
        const titleMatch = item.title?.toLowerCase().includes(query);
        const contentMatch = (item as any).content?.toLowerCase().includes(query);
        const roleMatch = (item as any).role?.toLowerCase().includes(query);
        if (!titleMatch && !contentMatch && !roleMatch) return false;
      }

      if (sentimentFilter !== 'all' && item.type === 'EVIDENCE') {
        if ((item as any).sentiment !== sentimentFilter) return false;
      }

      return true;
    });
  }, [board.visibleItems, searchQuery, sentimentFilter, typeFilter]);

  const origoData = useMemo(() => ({ visibleItems }), [visibleItems]);
  const selectedItem = useMemo(
    () => board.visibleItems.find((item: CanvasItem) => item.id === interaction.selectedId) || null,
    [board.visibleItems, interaction.selectedId]
  );
  const sceneViewportBounds = useMemo<SceneViewportBounds | null>(() => {
      if (!viewportSize.width || !viewportSize.height || interaction.camera.z <= 0) return null;

      const overscanScreen = interaction.dragState.mode ? 200 : 320;
      const overscanWorld = overscanScreen / interaction.camera.z;
      const left = (-interaction.camera.x / interaction.camera.z) - overscanWorld;
      const top = (-interaction.camera.y / interaction.camera.z) - overscanWorld;
      const width = (viewportSize.width / interaction.camera.z) + overscanWorld * 2;
      const height = (viewportSize.height / interaction.camera.z) + overscanWorld * 2;

      return {
          left,
          top,
          right: left + width,
          bottom: top + height,
          width,
          height,
      };
  }, [viewportSize, interaction.camera, interaction.dragState.mode]);
  const sceneItems = useMemo(() => {
      if (!sceneViewportBounds) return visibleItems;

      return visibleItems.filter(item => {
          if (item.id === interaction.selectedId) return true;

          const itemRight = item.x + item.width;
          const itemBottom = item.y + item.height;
          return !(
              itemRight < sceneViewportBounds.left ||
              item.x > sceneViewportBounds.right ||
              itemBottom < sceneViewportBounds.top ||
              item.y > sceneViewportBounds.bottom
          );
      });
  }, [visibleItems, sceneViewportBounds, interaction.selectedId]);

  useEffect(() => {
      if (!onRegisterGetState) return;
      onRegisterGetState(() => ({ items: board.items }));
  }, [onRegisterGetState, board.items]);

  useEffect(() => {
      const element = containerRef.current;
      if (!element) return;

      const updateViewportSize = () => {
          setViewportSize({
              width: element.clientWidth,
              height: element.clientHeight,
          });
      };

      updateViewportSize();

      const observer = new ResizeObserver(updateViewportSize);
      observer.observe(element);

      return () => observer.disconnect();
  }, []);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

          if (e.ctrlKey || e.metaKey) {
              if (e.key === 'z') {
                  e.preventDefault();
                  if (e.shiftKey) {
                      board.redo();
                  } else {
                      board.undo();
                  }
              }

              if (e.key === 'y') {
                  e.preventDefault();
                  board.redo();
              }
          }

          if ((e.key === 'Delete' || e.key === 'Backspace') && interaction.selectedId) {
              e.preventDefault();
              board.deleteItem(interaction.selectedId);
              interaction.setSelectedId(null);
          }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board.undo, board.redo, board.deleteItem, interaction.selectedId, interaction.setSelectedId]);

  useEffect(() => {
      if (!onDataChange) return;

      if (!hasMountedItemsRef.current) {
          hasMountedItemsRef.current = true;
          return;
      }

      const persistenceMode =
          interaction.dragState.mode === 'MOVE_ITEM' || interaction.dragState.mode === 'RESIZE_ITEM'
              ? 'deferred'
              : 'default';

      onDataChange({ items: board.items, persistenceMode });
  }, [board.items, interaction.dragState.mode, onDataChange]);

  useEffect(() => {
      if (!onDataChange) return;

      const previousMode = previousDragModeRef.current;
      const currentMode = interaction.dragState.mode;
      const finishedStructuralDrag =
          (previousMode === 'MOVE_ITEM' || previousMode === 'RESIZE_ITEM') &&
          currentMode === null;

      previousDragModeRef.current = currentMode;

      if (!finishedStructuralDrag) return;

      onDataChange({ items: board.items, persistenceMode: 'flush' });
  }, [board.items, interaction.dragState.mode, onDataChange]);

  const handleAddItem = useCallback((type: ItemType) => {
      const viewport = containerRef.current?.getBoundingClientRect();
      const newId = board.addItem(
          type,
          interaction.cameraRef.current,
          viewport ? { width: viewport.width, height: viewport.height } : undefined
      );
      interaction.setSelectedId(newId);
  }, [board.addItem, interaction.cameraRef, interaction.setSelectedId]);

  const handleToggleSystemicAnalysis = useCallback(() => {
      setIsSystemicAnalysisOpen(prev => !prev);
  }, []);

  const handleDeselect = useCallback(() => {
      interaction.setSelectedId(null);
  }, [interaction.setSelectedId]);

  const startEditingTitle = () => {
      setTempTitle(boardTitle);
      setIsEditingTitle(true);
      setIsBoardMenuOpen(false);
  };

  const saveTitle = () => {
      if (tempTitle.trim() && onUpdateBoardTitle) {
          onUpdateBoardTitle(tempTitle);
      }
      setIsEditingTitle(false);
  };

  const cancelEditingTitle = () => {
      setIsEditingTitle(false);
  };

  const isEmpty = board.items.length === 0;

  return (
    <div className="w-full h-full bg-canvas-bg overflow-hidden relative font-sans text-zinc-200 selection:bg-blue-500/30">
      {onToggleMenu && (
          <div className="absolute top-4 left-4 z-[60] flex items-center">
              <div className="flex items-center h-12 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl px-2 gap-1">
                  <button
                      onClick={onToggleMenu}
                      className={`p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ${isMenuOpen ? 'bg-blue-900/20 text-blue-400' : ''}`}
                      title={t('fileMenu')}
                  >
                     {isMenuOpen ? <XIcon size={18} /> : <Menu size={18} />}
                  </button>
                  <div className="w-px h-5 bg-zinc-800 mx-1"></div>
                  <div className="flex items-center gap-3 px-2 group cursor-default select-none">
                      <OrigoAIIcon size={20} className="text-zinc-200 group-hover:text-white transition-colors" />
                      <span className="font-mono font-semibold text-sm tracking-widest text-zinc-100 leading-none group-hover:text-white transition-colors uppercase">
                          ORIGO
                      </span>
                  </div>
                  <div className="w-px h-5 bg-zinc-800 mx-1"></div>
                  <div className="flex items-center gap-1 px-1">
                      {isEditingTitle ? (
                          <div className="flex items-center gap-1 animate-in fade-in duration-200">
                              <input
                                  autoFocus
                                  className="bg-zinc-800 border border-blue-500/50 rounded px-2 py-1 text-sm text-white focus:outline-none w-48 font-medium"
                                  value={tempTitle}
                                  onChange={e => setTempTitle(e.target.value)}
                                  onKeyDown={e => e.key === 'Enter' && saveTitle()}
                                  onBlur={saveTitle}
                              />
                              <button onClick={saveTitle} className="p-1 hover:text-green-400 text-zinc-400 transition-colors">
                                  <Check size={14} />
                              </button>
                              <button onClick={cancelEditingTitle} className="p-1 hover:text-red-400 text-zinc-400 transition-colors" onMouseDown={e => e.preventDefault()}>
                                  <XIcon size={14} />
                              </button>
                          </div>
                      ) : (
                          <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-zinc-300 px-2 truncate max-w-[200px] cursor-pointer hover:text-white" onClick={startEditingTitle} title={t('renameFile')}>
                                  {boardTitle}
                              </span>
                              {isDirty && (
                                  <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" title={t('unsavedChanges')} />
                              )}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      <Toolbar
          onAdd={handleAddItem}
          onToggleSystemicAnalysis={handleToggleSystemicAnalysis}
          isSystemicAnalysisOpen={isSystemicAnalysisOpen}
          onUndo={board.undo}
          onRedo={board.redo}
          canUndo={board.canUndo}
          canRedo={board.canRedo}
      />

      <Inspector
          selectedItem={selectedItem}
          items={board.visibleItems}
          onUpdate={board.updateItem}
          onDelete={board.deleteItem}
          onDeselect={handleDeselect}
          onDuplicate={board.createItems}
      />

      <OrigoSynthesisReport
          isOpen={isSystemicAnalysisOpen}
          onClose={() => setIsSystemicAnalysisOpen(false)}
          items={board.items}
          companyName={boardTitle}
      />

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl">
         <button onClick={() => interaction.setInteractionMode('PAN')} className={`p-2 rounded hover:bg-zinc-800 transition-colors ${interaction.interactionMode === 'PAN' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400'}`} title={t('toolPan')}>
             <Hand size={18} />
         </button>
         <button onClick={() => interaction.setInteractionMode('SELECT')} className={`p-2 rounded hover:bg-zinc-800 transition-colors ${interaction.interactionMode === 'SELECT' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400'}`} title={t('toolSelect')}>
             <MousePointer2 size={18} />
         </button>
         <div className="w-px h-6 bg-zinc-800 mx-1" />
         <button onClick={() => interaction.handleZoom(-0.1)} className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors" title={t('zoomOut')}>
             <Minus size={18} />
         </button>
         <button onClick={() => interaction.handleZoom(0.1)} className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors" title={t('zoomIn')}>
             <Plus size={18} />
         </button>
      </div>

      <div
          ref={containerRef}
          className={`absolute inset-0 ${interaction.interactionMode === 'PAN' || interaction.dragState.mode === 'PAN_CANVAS' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'} select-none`}
          onWheel={interaction.handleWheel}
          onMouseDown={interaction.handleMouseDown}
      >
        <GridLayer gridRef={interaction.gridElRef} />

        <div ref={interaction.transformElRef} className={`absolute origin-top-left ${interaction.dragState.mode === 'PAN_CANVAS' ? 'will-change-transform' : ''}`}>
          <ConnectionsLayer
              items={origoData.visibleItems}
              selectedId={interaction.selectedId}
              replayDate={null}
              viewportBounds={sceneViewportBounds}
              zoomLevel={interaction.camera.z}
              navigationMode={!!interaction.dragState.mode}
          />

          <ItemsLayer
              items={sceneItems}
              selectedId={interaction.selectedId}
              interactionMode={interaction.interactionMode}
              onItemMouseDown={interaction.handleItemMouseDown}
              diagnosticsMap={diagnosticsMap}
              zoomLevel={interaction.camera.z}
          />
        </div>
      </div>

      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <p className="text-zinc-600 text-sm font-medium animate-in fade-in duration-500">
            {t('canvasEmptyHint')}
          </p>
        </div>
      )}

      <div className="absolute top-4 right-16 z-[60] flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-2">
              <div className="relative">
                  <input
                      type="text"
                      placeholder={t('searchPlaceholder')}
                      className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 w-52"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                  />
              </div>
              <div className="w-px h-5 bg-zinc-800 mx-1"></div>
              <select
                  className="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
              >
                  <option value="all">{t('typeFilterAll')}</option>
                  <option value="TEAM">{t('typeFilterTeam')}</option>
                  <option value="PERSON">{t('typeFilterPerson')}</option>
                  <option value="EVIDENCE">{t('typeFilterEvidence')}</option>
                  <option value="NOTE">{t('typeFilterNote')}</option>
              </select>
              <select
                  className="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
                  value={sentimentFilter}
                  onChange={e => setSentimentFilter(e.target.value)}
              >
                  <option value="all">{t('allEvidences')}</option>
                  <option value="positive">{t('positiveEvidences')}</option>
                  <option value="neutral">{t('neutralEvidences')}</option>
                  <option value="negative">{t('negativeEvidences')}</option>
              </select>
          </div>
    </div>
  );
};
