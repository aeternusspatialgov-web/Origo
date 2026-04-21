import React, { useMemo } from 'react';
import { CanvasItem } from '../../types';
import { Grip } from 'lucide-react';
import { DiagnosticBadge } from '../Canvas';

import { TeamItemRenderer } from '../renderers/TeamItemRenderer';
import { PersonItemRenderer } from '../renderers/PersonItemRenderer';
import { EvidenceItemRenderer } from '../renderers/EvidenceItemRenderer';

interface ItemsLayerProps {
    items: CanvasItem[];
    selectedId: string | null;
    interactionMode: string;
    onItemMouseDown: (e: React.MouseEvent, id: string, resizeDir?: any) => void;
    diagnosticsMap?: Map<string, DiagnosticBadge>;
    zoomLevel: number;
}

type DetailMode = 'full' | 'compact' | 'minimal';

const getDetailMode = (zoomLevel: number): DetailMode => {
    if (zoomLevel < 0.38) return 'minimal';
    if (zoomLevel < 0.72) return 'compact';
    return 'full';
};

const CompactItem: React.FC<{
    item: CanvasItem;
    teamColor?: string;
    detailMode: DetailMode;
}> = ({ item, teamColor, detailMode }) => {
    const isMinimal = detailMode === 'minimal';

    if (item.type === 'TEAM') {
        return (
            <div className={`w-full h-full rounded-xl border border-zinc-700/60 bg-zinc-950/95 overflow-hidden ${isMinimal ? '' : 'shadow-md'}`}>
                <div className={isMinimal ? 'w-full h-full' : 'h-1.5 w-full'} style={{ backgroundColor: (item as any).color || '#4f46e5' }} />
                {!isMinimal && (
                    <div className="px-3 py-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-200 truncate">{item.title}</div>
                    </div>
                )}
            </div>
        );
    }

    if (item.type === 'PERSON') {
        return (
            <div className={`w-full h-full rounded-xl border bg-zinc-950/95 overflow-hidden ${isMinimal ? '' : 'shadow-md'}`} style={{ borderColor: `${teamColor || '#3f3f46'}66` }}>
                <div className="absolute top-0 left-0 bottom-0 w-1.5" style={{ backgroundColor: teamColor || '#3f3f46' }} />
                {!isMinimal && (
                    <div className="h-full flex items-center px-3 pl-5">
                        <div className="min-w-0">
                            <div className="text-[10px] font-semibold text-zinc-200 truncate">{item.title}</div>
                            <div className="text-[9px] text-zinc-500 uppercase tracking-wider truncate">{(item as any).role || 'Pessoa'}</div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (item.type === 'EVIDENCE') {
        const sentiment = (item as any).sentiment;
        const accentColor = sentiment === 'positive' ? '#10b981' : sentiment === 'negative' ? '#ef4444' : '#f59e0b';
        return (
            <div className={`w-full h-full rounded-lg border border-zinc-700/60 bg-zinc-950/95 overflow-hidden ${isMinimal ? '' : 'shadow-md'}`}>
                <div className={isMinimal ? 'w-full h-full' : 'h-1.5 w-full'} style={{ backgroundColor: accentColor }} />
                {!isMinimal && (
                    <div className="px-2.5 py-2">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-300 truncate">{item.title}</div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`w-full h-full rounded-lg border border-zinc-700 bg-zinc-900/90 overflow-hidden ${isMinimal ? '' : 'shadow-md'}`}>
            {!isMinimal && (
                <div className="px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Note</div>
                    <div className="text-[10px] text-zinc-300 truncate">{(item as any).content || item.title}</div>
                </div>
            )}
        </div>
    );
};

export const ItemsLayer: React.FC<ItemsLayerProps> = React.memo(({ items, selectedId, interactionMode, onItemMouseDown, diagnosticsMap, zoomLevel }) => {
    const { sortedItems, teamColorMap, detailMode } = useMemo(() => {
        const sorted = [...items].sort((a, b) => a.zIndex - b.zIndex);
        const colorMap = new Map<string, string>();
        items.forEach(item => {
            if (item.type === 'TEAM') colorMap.set(item.id, (item as any).color || '#4f46e5');
        });
        return {
            sortedItems: sorted,
            teamColorMap: colorMap,
            detailMode: getDetailMode(zoomLevel)
        };
    }, [items, zoomLevel]);

    const isPanMode = interactionMode === 'PAN';
    const isInteractive = !isPanMode;
    const showHandles = isInteractive && detailMode === 'full';

    return (
        <div className={isPanMode ? 'pointer-events-none' : undefined}>
            {sortedItems.map((item: CanvasItem) => {
                const isSelected = selectedId === item.id;

                return (
                    <div
                        key={item.id}
                        data-item-id={item.id}
                        className={`absolute canvas-item flex flex-col group ${isSelected ? 'ring-1 ring-blue-500 z-50' : detailMode === 'full' ? 'hover:ring-1 hover:ring-white/20' : ''} ${item.type === 'NOTE' && detailMode === 'full' ? 'border border-zinc-700 rounded-lg shadow-xl' : ''}`}
                        style={{
                            left: item.x,
                            top: item.y,
                            width: item.width,
                            height: item.height,
                            zIndex: item.zIndex,
                            backgroundColor: item.type === 'NOTE' && detailMode === 'full' ? (item as any).color || '#27272a' : undefined,
                        }}
                        onMouseDown={e => onItemMouseDown(e, item.id)}
                    >
                        {showHandles && (
                            <div className="absolute top-0 left-0 right-0 h-4 cursor-grab active:cursor-grabbing z-50 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Grip size={12} className="text-white/50 mt-0.5" />
                            </div>
                        )}

                        {showHandles && (
                            <div className="absolute bottom-0 right-0 w-5 h-5 z-50 cursor-se-resize opacity-0 group-hover:opacity-100 flex items-center justify-center text-white/50 hover:text-white" onMouseDown={e => onItemMouseDown(e, item.id, 'se')}>
                                <div className="w-1.5 h-1.5 border-r border-b border-current" />
                            </div>
                        )}

                        {detailMode === 'full' && item.type === 'TEAM' && <TeamItemRenderer item={item as any} diagnostic={diagnosticsMap?.get(item.id)} />}
                        {detailMode === 'full' && item.type === 'PERSON' && (
                            <PersonItemRenderer
                                item={item as any}
                                teamColor={teamColorMap.get((item as any).teamId)}
                                diagnostic={diagnosticsMap?.get(item.id)}
                            />
                        )}
                        {detailMode === 'full' && item.type === 'EVIDENCE' && <EvidenceItemRenderer item={item as any} />}
                        {detailMode === 'full' && item.type === 'NOTE' && (
                            <div className="p-4 h-full flex flex-col overflow-hidden">
                                <div className="text-[10px] text-zinc-500 font-mono mb-2 uppercase tracking-wider">Note</div>
                                <div className="whitespace-pre-wrap text-sm text-zinc-300 font-medium leading-relaxed">{(item as any).content}</div>
                            </div>
                        )}

                        {detailMode !== 'full' && (
                            <CompactItem
                                item={item}
                                teamColor={teamColorMap.get((item as any).teamId)}
                                detailMode={detailMode}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
});
