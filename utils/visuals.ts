
// --- COLOR UTILS ---
export const VIBRANT_COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', 
    '#ec4899', '#f43f5e'
];

export const sanitizeColor = (color: string | undefined, defaultColor: string): string => {
    if (!color) return defaultColor;
    const c = color.toLowerCase().trim();
    // Check for black/dark variants that are invisible on dark bg
    if (
        c === '#000000' || 
        c === '#000' || 
        c === 'black' || 
        c === 'rgb(0,0,0)' || 
        c === 'rgb(0, 0, 0)' ||
        c === 'rgba(0,0,0,1)' ||
        c === 'rgba(0, 0, 0, 1)'
    ) {
        // Return a random vibrant color instead of black
        return VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
    }
    return color;
};
