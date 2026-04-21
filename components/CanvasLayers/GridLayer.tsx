
import React from 'react';

interface GridLayerProps {
    gridRef?: React.Ref<HTMLDivElement>;
}

// Grid is updated exclusively via DOM-direct writes in applyCamera().
// useLayoutEffect in useCanvasInteraction applies initial values before first paint.
// No React-controlled styles needed — the ref handles everything.
export const GridLayer: React.FC<GridLayerProps> = React.memo(({ gridRef }) => {
    return (
        <div
            ref={gridRef}
            className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage: `radial-gradient(#52525b 1px, transparent 1px)`,
                opacity: 0
            }}
        />
    );
});
