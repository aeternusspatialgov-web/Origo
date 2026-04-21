
export type ItemType = 'NOTE' | 'TEAM' | 'PERSON' | 'EVIDENCE';

export interface Camera {
  x: number;
  y: number;
  z: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

// --- Board / Universe ---

export interface Board {
  id: string;
  title: string;
  description?: string;
  module?: 'origo'; // NEW: Module type
  lastEdited: number;
  itemCount: number;
  items: CanvasItem[];
  isFavorite?: boolean;
}

// --- Top Level Items ---

export interface BaseCanvasItem {
  id: string;
  type: ItemType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isSelected: boolean;
  createdAt?: number; 
}

export interface NoteItem extends BaseCanvasItem {
  type: 'NOTE';
  title: string;
  content: string;
  color: string;
}

// --- Origo Specific Items ---

export interface TeamItem extends BaseCanvasItem {
  type: 'TEAM';
  title: string;
  color: string;
  description?: string;
  linkedTeamIds?: string[];
  isCollapsed?: boolean;
}

export interface PersonItem extends BaseCanvasItem {
  type: 'PERSON';
  title: string;
  role: string;
  color: string;
  teamId?: string;
  avatarUrl?: string;
  skills?: string[];
}

export interface EvidenceItem extends BaseCanvasItem {
  type: 'EVIDENCE';
  title: string;
  content: string;
  color: string;
  source?: string; // legacy — kept for compatibility
  speakerId?: string; // PersonItem id — who gave this testimony
  sentiment?: 'positive' | 'neutral' | 'negative';
  linkedEntityIds?: string[]; // Teams, People related to this testimony
}

export type CanvasItem = NoteItem | TeamItem | PersonItem | EvidenceItem;

// --- Interaction ---
