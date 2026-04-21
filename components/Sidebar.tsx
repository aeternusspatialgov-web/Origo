import React from 'react';
import { Save, HardDrive, Plus, Terminal, Cpu, Disc, LogOut } from 'lucide-react';
import { Board } from '../types';
import { useLanguage } from '../utils/i18n';
import { OrigoLogoHorizontal } from './Toolbar';

interface SidebarProps {
  currentBoard: Board;
  isDirty: boolean;
  onNewFile: () => void;
  onSaveFile: () => void;
  onClose: () => void;
  onOpenDocs: () => void;
  onOpenOnboarding: () => void;
  onOpenFromDisk?: () => void;
  onGoToLanding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentBoard, isDirty, onNewFile, onSaveFile,
  onOpenDocs, onOpenFromDisk, onGoToLanding,
}) => {
  const { t } = useLanguage();
  const isDemo = currentBoard.id === 'b_demo';

  return (
    <div className="w-full h-full bg-[#050505] border-r border-zinc-900 flex flex-col relative z-50">

      {/* HEADER */}
      <div className="p-6 border-b border-zinc-900">
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${isDirty && !isDemo ? 'bg-amber-500' : 'bg-emerald-500'} shadow-[0_0_8px_rgba(16,185,129,0.2)]`} />
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            {isDemo ? t('sandboxMode') : t('activeSession')}
          </span>
        </div>
        <h3 className="text-zinc-100 font-medium text-lg leading-tight mb-3 truncate font-sans tracking-tight">
          {currentBoard.title}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono uppercase tracking-wider">ORIGO</span>
          <span className="text-[9px] text-zinc-600 font-mono">{currentBoard.items.length} {t('entities')}</span>
        </div>
      </div>

      {/* NAV */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">

        <div>
          <div className="px-2 mb-3 flex items-center gap-2">
            <Disc size={10} className="text-zinc-700" />
            <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest font-mono">{t('dataMemory')}</span>
          </div>
          <div className="space-y-1">
            <button onClick={onNewFile} className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-100 transition-all group">
              <Plus size={14} className="text-zinc-600 group-hover:text-zinc-100 transition-colors" />
              <span className="text-xs font-medium">{t('newUniverse')}</span>
            </button>
            <button onClick={onOpenFromDisk} disabled={!onOpenFromDisk} className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-100 transition-all group ${!onOpenFromDisk ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <HardDrive size={14} className="text-zinc-600 group-hover:text-zinc-100 transition-colors" />
              <span className="text-xs font-medium">{t('loadDisk')}</span>
            </button>
            <button onClick={onSaveFile} className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-100 transition-all group">
              <div className="flex items-center gap-3">
                <Save size={14} className="text-zinc-600 group-hover:text-zinc-100 transition-colors" />
                <span className="text-xs font-medium">{t('persistData')}</span>
              </div>
              {isDirty && !isDemo && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
            </button>
          </div>
        </div>

        <div>
          <div className="px-2 mb-3 flex items-center gap-2">
            <Cpu size={10} className="text-zinc-700" />
            <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest font-mono">{t('protocols')}</span>
          </div>
          <div className="space-y-1">
            <button onClick={onOpenDocs} className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-100 transition-all group">
              <Terminal size={14} className="text-zinc-600 group-hover:text-zinc-100 transition-colors" />
              <span className="text-xs font-medium">{t('systemManual')}</span>
            </button>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="border-t border-zinc-900 bg-[#050505]">
        {onGoToLanding && (
          <div className="px-4 pt-3 pb-1">
            <button
              onClick={onGoToLanding}
              className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-zinc-900/50 text-zinc-600 hover:text-zinc-400 transition-all group"
            >
              <LogOut size={14} className="group-hover:text-zinc-400 transition-colors" />
              <span className="text-xs font-medium">{t('backToHome')}</span>
            </button>
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center justify-between px-1 opacity-40 hover:opacity-100 transition-opacity">
            <OrigoLogoHorizontal iconSize={12} className="text-zinc-600" />
            <span className="text-[9px] text-zinc-600 font-mono">v1.0.0</span>
          </div>
        </div>
      </div>

    </div>
  );
};
