import React from 'react';
import { Layers, StickyNote, MessageSquareQuote, UserRound, Globe, Undo2, Redo2 } from 'lucide-react';
import { ItemType } from '../types';
import { useLanguage, Language } from '../utils/i18n';

// --- SYNTHESIS ICON — inner brand signature: 3 outer dots + spokes → center, no triangle ---
export const SynthesisIcon = ({ size = 20, className = '', isActive = false }: { size?: number; className?: string; isActive?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {isActive && (
      <style>{`
        @keyframes origo-flow {
          from { stroke-dashoffset: 16; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    )}
    {/* Spokes: each outer vertex → center (12, 13.5) */}
    <line x1="12" y1="2.5"  x2="12" y2="13.5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.6" strokeLinecap="round"
      style={isActive ? { animation: 'origo-flow 1.2s linear infinite', animationDelay: '0s' } : undefined} />
    <line x1="2"  y1="21.5" x2="12" y2="13.5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.6" strokeLinecap="round"
      style={isActive ? { animation: 'origo-flow 1.2s linear infinite', animationDelay: '0.4s' } : undefined} />
    <line x1="22" y1="21.5" x2="12" y2="13.5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.6" strokeLinecap="round"
      style={isActive ? { animation: 'origo-flow 1.2s linear infinite', animationDelay: '0.8s' } : undefined} />
    {/* Outer vertex dots */}
    <circle cx="12" cy="2.5"  r="1.5" fill="currentColor" />
    <circle cx="2"  cy="21.5" r="1.5" fill="currentColor" />
    <circle cx="22" cy="21.5" r="1.5" fill="currentColor" />
    {/* Center dot */}
    <circle cx="12" cy="13.5" r="2.2" fill="currentColor" />
  </svg>
);

// --- ORIGO ICON — dashed triangle + inner spokes + vertex & center dots ---
const OrigoAIIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Dashed outer triangle */}
    <path
      d="M12 2.5L2 21.5H22L12 2.5Z"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeDasharray="2.4 1.8"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Dashed inner spokes: center → each vertex */}
    <line x1="12" y1="13.5" x2="12"  y2="2.5"  stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 1.6" strokeLinecap="round" />
    <line x1="12" y1="13.5" x2="2"   y2="21.5" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 1.6" strokeLinecap="round" />
    <line x1="12" y1="13.5" x2="22"  y2="21.5" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 1.6" strokeLinecap="round" />
    {/* Vertex dots */}
    <circle cx="12" cy="2.5"  r="1.5" fill="currentColor" />
    <circle cx="2"  cy="21.5" r="1.5" fill="currentColor" />
    <circle cx="22" cy="21.5" r="1.5" fill="currentColor" />
    {/* Center dot */}
    <circle cx="12" cy="13.5" r="1.9" fill="currentColor" />
  </svg>
);

// --- ORIGO HORIZONTAL LOGO ---
export const OrigoLogoHorizontal = ({ iconSize = 20, className = '' }: { iconSize?: number; className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <OrigoAIIcon size={iconSize} />
    <span
      className="font-bold text-white tracking-[0.18em] uppercase leading-none"
      style={{ fontSize: Math.round(iconSize * 0.55) }}
    >
      ORIGO
    </span>
  </div>
);

interface ToolbarProps {
  onAdd: (type: ItemType) => void;
  onToggleSystemicAnalysis?: () => void;
  isSystemicAnalysisOpen?: boolean;
  onToggleLanguage?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

interface TooltipProps {
  label: string;
  children?: React.ReactNode;
}

const Tooltip = ({ label, children }: TooltipProps) => (
  <div className="group relative flex items-center">
    {children}
    <div className="absolute left-full ml-3 px-2 py-1 bg-zinc-900 border border-zinc-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
      {label}
    </div>
  </div>
);

export const Toolbar = React.memo(function Toolbar({
  onAdd,
  onToggleSystemicAnalysis,
  isSystemicAnalysisOpen,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: ToolbarProps) {
  const { t, lang, setLang } = useLanguage();

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      <div className="bg-canvas-surface border border-canvas-border p-2 rounded-xl shadow-2xl flex flex-col gap-1">

        <Tooltip label={t('team')}>
          <button
            onClick={() => onAdd('TEAM')}
            className="p-3 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 transition-colors"
          >
            <Layers size={20} />
          </button>
        </Tooltip>

        <Tooltip label={t('person')}>
          <button
            onClick={() => onAdd('PERSON')}
            className="p-3 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            <UserRound size={20} />
          </button>
        </Tooltip>

        <Tooltip label={t('evidence')}>
          <button
            onClick={() => onAdd('EVIDENCE')}
            className="p-3 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <MessageSquareQuote size={20} />
          </button>
        </Tooltip>

        <div className="h-px bg-canvas-border w-full my-1" />

        <Tooltip label={t('systemicSynthesis')}>
          <button
            onClick={onToggleSystemicAnalysis}
            className={`p-3 rounded-lg transition-all ${
              isSystemicAnalysisOpen
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                : 'hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400'
            }`}
          >
            <SynthesisIcon size={20} isActive={isSystemicAnalysisOpen} />
          </button>
        </Tooltip>

        <div className="h-px bg-canvas-border w-full my-1" />

        <Tooltip label={t('note')}>
          <button
            onClick={() => onAdd('NOTE')}
            className="p-3 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <StickyNote size={20} />
          </button>
        </Tooltip>

        <div className="h-px bg-canvas-border w-full my-1" />

        <Tooltip label={t('undo')}>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-3 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Undo2 size={18} />
          </button>
        </Tooltip>

        <Tooltip label={t('redo')}>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-3 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Redo2 size={18} />
          </button>
        </Tooltip>

      </div>

      {/* LANGUAGE TOGGLE */}
      <div className="bg-canvas-surface border border-canvas-border rounded-xl shadow-2xl overflow-hidden">
        <Tooltip label={t('language')}>
          <button
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            className="w-full flex flex-col items-center gap-0.5 px-3 py-2.5 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <Globe size={14} />
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase">
              {lang === 'pt' ? 'PT' : 'EN'}
            </span>
          </button>
        </Tooltip>
      </div>

    </div>
  );
});

export { OrigoAIIcon };
