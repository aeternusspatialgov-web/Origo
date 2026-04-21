import React, { useMemo } from 'react';
import { CanvasItem, PersonItem, TeamItem, EvidenceItem } from '../../types';
import { sanitizeColor } from '../../utils/visuals';

export interface SceneViewportBounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
}

interface ConnectionsLayerProps {
    items: CanvasItem[];
    selectedId: string | null;
    replayDate: number | null;
    viewportBounds: SceneViewportBounds | null;
    zoomLevel: number;
    navigationMode?: boolean;
}

type ConnGeometry =
  | { kind: 'person-team'; key: string; path: string; color: string; personId: string; teamId: string }
  | { kind: 'speaker'; key: string; path: string; endX: number; endY: number; evidenceId: string; speakerId: string }
  | { kind: 'link'; key: string; path: string; color: string; evidenceId: string; targetId: string };

type ConnectionDetailMode = 'full' | 'compact' | 'minimal';

const intersectsBounds = (
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
    bounds: SceneViewportBounds
) => !(maxX < bounds.left || minX > bounds.right || maxY < bounds.top || minY > bounds.bottom);

const getConnectionDetailMode = (zoomLevel: number): ConnectionDetailMode => {
    if (zoomLevel < 0.38) return 'minimal';
    if (zoomLevel < 0.72) return 'compact';
    return 'full';
};

export const ConnectionsLayer: React.FC<ConnectionsLayerProps> = React.memo(({ items, selectedId, replayDate, viewportBounds, zoomLevel, navigationMode = false }) => {
    const detailMode = useMemo(() => getConnectionDetailMode(zoomLevel), [zoomLevel]);
    const geometries = useMemo((): ConnGeometry[] => {
        if (!viewportBounds || viewportBounds.width <= 0 || viewportBounds.height <= 0) return [];

        const itemById = new Map<string, CanvasItem>();
        const people: PersonItem[] = [];
        const evidences: EvidenceItem[] = [];

        items.forEach(item => {
            itemById.set(item.id, item);
            if (item.type === 'PERSON') people.push(item as PersonItem);
            if (item.type === 'EVIDENCE') evidences.push(item as EvidenceItem);
        });

        const result: ConnGeometry[] = [];
        const localX = (x: number) => x - viewportBounds.left;
        const localY = (y: number) => y - viewportBounds.top;
        const isVisibleAtReplay = (item?: CanvasItem) =>
            !!item && (!replayDate || !item.createdAt || item.createdAt <= replayDate);

        people.forEach(person => {
            if (!isVisibleAtReplay(person) || !person.teamId) return;

            const team = itemById.get(person.teamId);
            if (!team || team.type !== 'TEAM' || !isVisibleAtReplay(team)) return;

            const sx = person.x + person.width / 2;
            const sy = person.y + person.height / 2;
            const ex = team.x + team.width / 2;
            const ey = team.y + team.height / 2;

            if (!intersectsBounds(Math.min(sx, ex), Math.max(sx, ex), Math.min(sy, ey), Math.max(sy, ey), viewportBounds)) {
                return;
            }

            result.push({
                kind: 'person-team',
                key: `pt-${person.id}-${team.id}`,
                path: `M ${localX(sx)} ${localY(sy)} L ${localX(ex)} ${localY(ey)}`,
                color: sanitizeColor((team as TeamItem).color, '#4f46e5'),
                personId: person.id,
                teamId: team.id,
            });
        });

        evidences.forEach(evidence => {
            if (!isVisibleAtReplay(evidence) || !evidence.speakerId) return;

            const speaker = itemById.get(evidence.speakerId);
            if (!speaker || !isVisibleAtReplay(speaker)) return;

            const sx = evidence.x + evidence.width / 2;
            const sy = evidence.y + evidence.height / 2;
            const ex = speaker.x + speaker.width / 2;
            const ey = speaker.y + speaker.height / 2;
            const cp1x = sx + (ex - sx) * 0.3;
            const cp1y = sy - 40;
            const cp2x = sx + (ex - sx) * 0.7;
            const cp2y = ey - 40;
            const minX = Math.min(sx, ex, cp1x, cp2x);
            const maxX = Math.max(sx, ex, cp1x, cp2x);
            const minY = Math.min(sy, ey, cp1y, cp2y);
            const maxY = Math.max(sy, ey, cp1y, cp2y);

            if (!intersectsBounds(minX, maxX, minY, maxY, viewportBounds)) return;

            result.push({
                kind: 'speaker',
                key: `sp-${evidence.id}-${evidence.speakerId}`,
                path: `M ${localX(sx)} ${localY(sy)} C ${localX(cp1x)} ${localY(cp1y)}, ${localX(cp2x)} ${localY(cp2y)}, ${localX(ex)} ${localY(ey)}`,
                endX: localX(ex),
                endY: localY(ey),
                evidenceId: evidence.id,
                speakerId: evidence.speakerId,
            });
        });

        evidences.forEach(evidence => {
            if (!isVisibleAtReplay(evidence) || !evidence.linkedEntityIds?.length) return;

            let color = sanitizeColor(evidence.color, '#f59e0b');
            if (evidence.sentiment === 'positive') color = '#10b981';
            if (evidence.sentiment === 'negative') color = '#ef4444';

            const sx = evidence.x + evidence.width / 2;
            const sy = evidence.y + evidence.height / 2;

            evidence.linkedEntityIds.forEach(targetId => {
                if (targetId === evidence.speakerId) return;

                const target = itemById.get(targetId);
                if (!target || !isVisibleAtReplay(target)) return;

                const ex = target.x + target.width / 2;
                const ey = target.y + target.height / 2;
                const mx = sx + (ex - sx) / 2;
                const minX = Math.min(sx, ex, mx);
                const maxX = Math.max(sx, ex, mx);
                const minY = Math.min(sy, ey);
                const maxY = Math.max(sy, ey);

                if (!intersectsBounds(minX, maxX, minY, maxY, viewportBounds)) return;

                result.push({
                    kind: 'link',
                    key: `lk-${evidence.id}-${targetId}`,
                    path: `M ${localX(sx)} ${localY(sy)} C ${localX(mx)} ${localY(sy)}, ${localX(mx)} ${localY(ey)}, ${localX(ex)} ${localY(ey)}`,
                    color,
                    evidenceId: evidence.id,
                    targetId,
                });
            });
        });

        return result;
    }, [items, replayDate, viewportBounds]);

    if (!viewportBounds || viewportBounds.width <= 0 || viewportBounds.height <= 0) return null;

    return (
        <svg
            className="absolute pointer-events-none z-0 overflow-hidden"
            style={{
                left: viewportBounds.left,
                top: viewportBounds.top,
                width: viewportBounds.width,
                height: viewportBounds.height,
            }}
        >
            {geometries.map(conn => {
                if (conn.kind === 'person-team') {
                    const isActive = selectedId === conn.personId || selectedId === conn.teamId;
                    const opacity = navigationMode
                        ? (isActive ? 0.38 : 0.12)
                        : detailMode === 'minimal'
                            ? (isActive ? 1 : 0.7)
                            : detailMode === 'compact'
                                ? (isActive ? 0.65 : 0.18)
                                : (isActive ? 0.6 : 0.07);
                    const strokeWidth = navigationMode
                        ? (isActive ? 1.6 : 1.1)
                        : detailMode === 'minimal'
                            ? (isActive ? 2.4 : 2)
                            : detailMode === 'compact'
                                ? (isActive ? 2.1 : 1.35)
                                : (isActive ? 2 : 1);
                    const showHighlight = !navigationMode && detailMode === 'minimal' && isActive;
                    return (
                        <g key={conn.key} data-conn-a={conn.personId} data-conn-b={conn.teamId} opacity={opacity}>
                            {showHighlight && (
                                <path
                                    d={conn.path}
                                    fill="none"
                                    stroke={conn.color}
                                    strokeWidth={strokeWidth + 4}
                                    strokeDasharray="6 6"
                                    strokeLinecap="round"
                                    opacity={0.18}
                                />
                            )}
                            <path d={conn.path} fill="none" stroke={conn.color} strokeWidth={strokeWidth} strokeDasharray={navigationMode ? undefined : '6 6'} />
                        </g>
                    );
                }

                if (conn.kind === 'speaker') {
                    const isActive = selectedId === conn.evidenceId || selectedId === conn.speakerId;
                    const opacity = navigationMode
                        ? (isActive ? 0.46 : 0.16)
                        : detailMode === 'minimal'
                            ? (isActive ? 1 : 0.78)
                            : detailMode === 'compact'
                                ? (isActive ? 0.75 : 0.2)
                                : (isActive ? 0.7 : 0.1);
                    const strokeWidth = navigationMode
                        ? (isActive ? 1.7 : 1.15)
                        : detailMode === 'minimal'
                            ? (isActive ? 2.4 : 2)
                            : detailMode === 'compact'
                                ? (isActive ? 2.15 : 1.4)
                                : (isActive ? 2 : 1);
                    const showEndpoint = navigationMode ? isActive : (detailMode === 'minimal' || isActive);
                    const showHighlight = !navigationMode && detailMode === 'minimal' && isActive;
                    return (
                        <g key={conn.key} data-conn-a={conn.evidenceId} data-conn-b={conn.speakerId} opacity={opacity}>
                            {showHighlight && (
                                <path
                                    d={conn.path}
                                    fill="none"
                                    stroke="#f59e0b"
                                    strokeWidth={strokeWidth + 4}
                                    strokeLinecap="round"
                                    opacity={0.18}
                                />
                            )}
                            <path d={conn.path} fill="none" stroke="#f59e0b" strokeWidth={strokeWidth} strokeLinecap="round" />
                            {showHighlight && <circle cx={conn.endX} cy={conn.endY} r={7} fill="#f59e0b" opacity={0.16} />}
                            {showEndpoint && <circle cx={conn.endX} cy={conn.endY} r={detailMode === 'minimal' ? (isActive ? 4.5 : 4) : 4} fill="#f59e0b" />}
                            {showEndpoint && <circle cx={conn.endX} cy={conn.endY} r={detailMode === 'minimal' ? 2.2 : 2} fill="#09090b" />}
                        </g>
                    );
                }

                const isActive = selectedId === conn.evidenceId || selectedId === conn.targetId;
                if (navigationMode && !isActive) return null;

                const opacity = navigationMode
                    ? 0.34
                    : detailMode === 'minimal'
                        ? (isActive ? 1 : 0.72)
                        : detailMode === 'compact'
                            ? (isActive ? 0.75 : 0.16)
                            : (isActive ? 0.7 : 0.06);
                const strokeWidth = navigationMode
                    ? 1.2
                    : detailMode === 'minimal'
                        ? (isActive ? 1.85 : 1.5)
                        : detailMode === 'compact'
                            ? (isActive ? 1.6 : 1.2)
                            : (isActive ? 1.5 : 1);
                const showHighlight = !navigationMode && detailMode === 'minimal' && isActive;
                return (
                    <g key={conn.key} data-conn-a={conn.evidenceId} data-conn-b={conn.targetId} opacity={opacity}>
                        {showHighlight && (
                            <path
                                d={conn.path}
                                fill="none"
                                stroke={conn.color}
                                strokeWidth={strokeWidth + 3}
                                strokeDasharray="4 4"
                                strokeLinecap="round"
                                opacity={0.16}
                            />
                        )}
                        <path d={conn.path} fill="none" stroke={conn.color} strokeWidth={strokeWidth} strokeDasharray={navigationMode ? undefined : '4 4'} />
                    </g>
                );
            })}
        </svg>
    );
});
