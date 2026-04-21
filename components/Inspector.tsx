import React, { useState, useEffect } from 'react';
import { CanvasItem, TeamItem } from '../types';
import { X, Trash2, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, FileText, Maximize2, Sparkles, Copy, Link2 } from 'lucide-react';
import { autoLinkEntities } from '../utils/autoLinker';
import { useLanguage } from '../utils/i18n';

// --- TRANSCRIPT MODAL ---
const TranscriptModal = ({ title, content, items, speakerId, onSave, onClose }: {
  title: string;
  content: string;
  items: CanvasItem[];
  speakerId?: string;
  onSave: (text: string, linkedIds: string[]) => void;
  onClose: () => void;
}) => {
  const [text, setText] = useState(content);
  const { t } = useLanguage();
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const isTranscript = text.length > 500;
  const previewLinks = autoLinkEntities(text, items, speakerId);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-[780px] max-w-[95vw] h-[85vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <FileText size={16} className="text-amber-400" />
            <span className="text-sm font-semibold text-white truncate max-w-xs">{title || t('inspectorEvidence')}</span>
            {isTranscript && (
              <span className="text-[10px] uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                {t('transcriptLabel')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-zinc-500">{wordCount.toLocaleString()} {t('words')}</span>
            <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <textarea
          autoFocus
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={t('transcriptPlaceholder')}
          className="flex-1 w-full bg-transparent px-6 py-5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none resize-none leading-relaxed font-mono"
        />

        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 shrink-0">
          <div className="flex flex-col gap-1">
            {previewLinks.length > 1 && (
              <p className="text-[11px] text-amber-400/80 flex items-center gap-1">
                <Sparkles size={11} />
                {previewLinks.length - (speakerId ? 1 : 0)} {t('autoDetected')}
              </p>
            )}
            <p className="text-[11px] text-zinc-600">
              {isTranscript ? t('transcriptDetected') : t('addMoreText')}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 rounded-xl text-xs font-medium transition-colors">
              {t('cancel')}
            </button>
            <button onClick={() => { onSave(text, autoLinkEntities(text, items, speakerId)); onClose(); }} className="px-5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition-colors">
              {t('save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SHARED COMPONENTS ---
const SectionLabel = ({ children }: { children?: React.ReactNode }) => (
  <div className="text-[10px] uppercase text-zinc-500 font-semibold mb-1.5 tracking-wider">{children}</div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full bg-[#09090b] border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
  />
);

const ColorInput = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
  <div className="flex gap-2 items-center">
    <div className="relative w-8 h-8 rounded border border-zinc-700 overflow-hidden shrink-0">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 m-0 border-0 cursor-pointer" />
    </div>
    <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="#000000" />
  </div>
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className="w-full bg-[#09090b] border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-600 appearance-none disabled:opacity-50 disabled:cursor-not-allowed" />
);

// --- MAIN COMPONENT ---
interface InspectorProps {
  selectedItem: CanvasItem | null;
  items: CanvasItem[];
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  onDeselect: () => void;
  onDuplicate: (newItems: CanvasItem[]) => void;
}

export const Inspector = React.memo(function Inspector({ selectedItem, items, onUpdate, onDelete, onDeselect, onDuplicate }: InspectorProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setConfirmDelete(false);
    setIsTranscriptOpen(false);
  }, [selectedItem?.id]);

  const teams = items.filter(i => i.type === 'TEAM') as TeamItem[];
  const linkableEntities = items.filter(i => ['TEAM', 'PERSON'].includes(i.type));

  if (!selectedItem) return null;

  const handleOrder = (direction: 'up' | 'down' | 'top' | 'bottom') => {
    const currentZ = selectedItem.zIndex || 0;
    const zIndices = items.map(item => item.zIndex || 0);
    const maxZ = Math.max(...zIndices, currentZ, 1);
    const minZ = Math.min(...zIndices, currentZ, 1);
    let newZ = currentZ;
    if (direction === 'up') newZ += 1;
    if (direction === 'down') newZ -= 1;
    if (direction === 'top') newZ = maxZ + 1;
    if (direction === 'bottom') newZ = minZ - 1;
    onUpdate(selectedItem.id, { zIndex: newZ });
  };

  const handleDuplicate = () => {
    const newItem = {
      ...selectedItem,
      id: Math.random().toString(36).substr(2, 9),
      x: selectedItem.x + 24,
      y: selectedItem.y + 24,
      isSelected: false,
    };
    onDuplicate([newItem as CanvasItem]);
  };

  const evidenceContent = (selectedItem as any).content || '';
  const isTranscript = evidenceContent.length > 500;
  const wordCount = evidenceContent.trim() ? evidenceContent.trim().split(/\s+/).length : 0;

  return (
    <>
      {/* Transcript Modal */}
      {isTranscriptOpen && selectedItem.type === 'EVIDENCE' && (
        <TranscriptModal
          title={(selectedItem as any).title || ''}
          content={evidenceContent}
          items={items}
          speakerId={(selectedItem as any).speakerId}
          onSave={(text, linkedIds) => onUpdate(selectedItem.id, { content: text, linkedEntityIds: linkedIds })}
          onClose={() => setIsTranscriptOpen(false)}
        />
      )}

      <div
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="absolute right-4 top-4 bottom-4 w-80 bg-[#18181b] border border-[#27272a] rounded-lg shadow-2xl z-[200] flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-200"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#27272a] flex items-center justify-between bg-[#18181b]">
          <span className="text-xs font-bold uppercase text-zinc-200 tracking-wider">
            {selectedItem.type === 'TEAM' ? t('inspectorTeam') : selectedItem.type === 'PERSON' ? t('inspectorPerson') : selectedItem.type === 'EVIDENCE' ? t('inspectorEvidence') : t('inspectorNote')}
          </span>
          <button onClick={onDeselect} className="text-zinc-500 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 custom-scrollbar">

          {/* Name */}
          <div>
            <SectionLabel>
              {selectedItem.type === 'EVIDENCE' ? t('evidenceTitle') :
               selectedItem.type === 'TEAM' ? t('teamName') : t('name')}
            </SectionLabel>
            <Input
              value={(selectedItem as any).title || ''}
              onChange={(e) => onUpdate(selectedItem.id, { title: e.target.value })}
            />
          </div>

          {selectedItem.type === 'NOTE' && (
            <>
              <div>
                <SectionLabel>{t('noteContent')}</SectionLabel>
                <textarea rows={6} className="w-full bg-[#09090b] border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-600 resize-none" value={(selectedItem as any).content || ''} onChange={(e) => onUpdate(selectedItem.id, { content: e.target.value })} />
              </div>
              <div>
                <SectionLabel>{t('bgColor')}</SectionLabel>
                <ColorInput value={(selectedItem as any).color || '#fef3c7'} onChange={(color) => onUpdate(selectedItem.id, { color })} />
              </div>
            </>
          )}

          {selectedItem.type === 'TEAM' && (
            <>
              <div>
                <SectionLabel>{t('description')}</SectionLabel>
                <textarea rows={3} className="w-full bg-[#09090b] border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-600 resize-none" value={(selectedItem as any).description || ''} onChange={(e) => onUpdate(selectedItem.id, { description: e.target.value })} />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="collapse-team" className="rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500" checked={(selectedItem as any).isCollapsed || false} onChange={(e) => onUpdate(selectedItem.id, { isCollapsed: e.target.checked })} />
                <label htmlFor="collapse-team" className="text-xs text-zinc-300 cursor-pointer select-none">{t('collapseTeam')}</label>
              </div>

              <div>
                <SectionLabel>{t('color')}</SectionLabel>
                <ColorInput value={(selectedItem as any).color || '#4f46e5'} onChange={(color) => onUpdate(selectedItem.id, { color })} />
              </div>
            </>
          )}

          {selectedItem.type === 'PERSON' && (
            <>
              <div>
                <SectionLabel>{t('role')}</SectionLabel>
                <Input value={(selectedItem as any).role || ''} onChange={(e) => onUpdate(selectedItem.id, { role: e.target.value })} />
              </div>
              <div>
                <SectionLabel>{t('avatar')}</SectionLabel>
                <Input placeholder="https://..." value={(selectedItem as any).avatarUrl || ''} onChange={(e) => onUpdate(selectedItem.id, { avatarUrl: e.target.value })} />
              </div>
              <div>
                <SectionLabel>{t('assignedTeam')}</SectionLabel>
                <Select value={(selectedItem as any).teamId || ''} onChange={(e) => onUpdate(selectedItem.id, { teamId: e.target.value || undefined })}>
                  <option value="">{t('noTeam')}</option>
                  {teams.map(tm => <option key={tm.id} value={tm.id}>{tm.title}</option>)}
                </Select>
              </div>
            </>
          )}

          {selectedItem.type === 'EVIDENCE' && (
            <>
              {/* Content field — compact preview + expand button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <SectionLabel>
                    {isTranscript ? (
                      <span className="flex items-center gap-1.5">
                        {t('transcript')}
                        <span className="text-amber-400 normal-case font-normal">· {wordCount.toLocaleString()} {t('words')}</span>
                      </span>
                    ) : t('shortContent')}
                  </SectionLabel>
                  <button
                    onClick={() => setIsTranscriptOpen(true)}
                    className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-amber-400 transition-colors"
                    title={t('expandTitle')}
                  >
                    <Maximize2 size={11} />
                    {isTranscript ? t('expand') : t('pasteTranscript')}
                  </button>
                </div>

                {isTranscript ? (
                  // Transcript preview — read-only, click to expand
                  <div
                    onClick={() => setIsTranscriptOpen(true)}
                    className="w-full bg-[#09090b] border border-amber-500/20 rounded px-2 py-1.5 text-xs text-zinc-400 cursor-pointer hover:border-amber-500/40 transition-colors h-20 overflow-hidden relative"
                  >
                    <p className="line-clamp-3 font-mono leading-relaxed">{evidenceContent}</p>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none" />
                  </div>
                ) : (
                  // Short content — inline editable textarea
                  <textarea
                    rows={4}
                    className="w-full bg-[#09090b] border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-600 resize-none"
                    value={evidenceContent}
                    onChange={(e) => onUpdate(selectedItem.id, { content: e.target.value })}
                    onPaste={(e) => {
                      setTimeout(() => {
                        const newContent = (e.target as HTMLTextAreaElement).value;
                        const detected = autoLinkEntities(newContent, items, (selectedItem as any).speakerId);
                        onUpdate(selectedItem.id, { linkedEntityIds: detected });
                      }, 0);
                    }}
                    placeholder={t('contentPlaceholder')}
                  />
                )}
              </div>

              {/* SPEAKER — who gave this testimony */}
              <div>
                <SectionLabel>{t('speaker')}</SectionLabel>
                <div className="relative">
                  <select
                    value={(selectedItem as any).speakerId || ''}
                    onChange={(e) => {
                      const speakerId = e.target.value || undefined;
                      const currentLinks: string[] = (selectedItem as any).linkedEntityIds || [];
                      const prevSpeakerId: string | undefined = (selectedItem as any).speakerId;
                      let newLinks = prevSpeakerId
                        ? currentLinks.filter((id: string) => id !== prevSpeakerId)
                        : [...currentLinks];
                      if (speakerId && !newLinks.includes(speakerId)) {
                        newLinks = [speakerId, ...newLinks];
                      }
                      onUpdate(selectedItem.id, { speakerId, linkedEntityIds: newLinks });
                    }}
                    className="w-full bg-[#09090b] border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
                  >
                    <option value="">{t('noSpeaker')}</option>
                    {items.filter(i => i.type === 'PERSON').map(p => (
                      <option key={p.id} value={p.id}>{(p as any).title}{(p as any).role ? ` · ${(p as any).role}` : ''}</option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none text-[10px]">▾</div>
                </div>
                {(selectedItem as any).speakerId && (
                  <p className="text-[10px] text-amber-400/70 mt-1 flex items-center gap-1">
                    <span>⬡</span> {t('autoSpeakerLink')}
                  </p>
                )}
              </div>

              <div>
                <SectionLabel>{t('sentiment')}</SectionLabel>
                <Select value={(selectedItem as any).sentiment || 'neutral'} onChange={(e) => onUpdate(selectedItem.id, { sentiment: e.target.value })}>
                  <option value="positive">{t('sentimentPositive')}</option>
                  <option value="neutral">{t('sentimentNeutral')}</option>
                  <option value="negative">{t('sentimentNegative')}</option>
                </Select>
              </div>

              {/* LINKED ENTITIES — context entities related to the testimony */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <SectionLabel>{t('relatedEntities')}</SectionLabel>
                  <button
                    onClick={() => {
                      const content = (selectedItem as any).content || '';
                      const detected = autoLinkEntities(content, items, (selectedItem as any).speakerId);
                      onUpdate(selectedItem.id, { linkedEntityIds: detected });
                    }}
                    className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-blue-400 transition-colors"
                    title={t('autoLink')}
                  >
                    <Link2 size={10} />
                    {t('autoLink')}
                  </button>
                </div>
                <div className="flex flex-col gap-1 max-h-40 overflow-y-auto bg-zinc-900 border border-zinc-800 rounded p-1">
                  {linkableEntities.map(entity => {
                    const isLinked = ((selectedItem as any).linkedEntityIds || []).includes(entity.id);
                    const isSpeaker = entity.id === (selectedItem as any).speakerId;
                    return (
                      <label key={entity.id} className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer text-xs transition-colors ${isSpeaker ? 'bg-amber-500/10 text-amber-300' : 'hover:bg-zinc-800 text-zinc-300'}`}>
                        <input
                          type="checkbox"
                          className="rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500"
                          checked={isLinked}
                          disabled={isSpeaker}
                          onChange={(e) => {
                            const currentLinks = (selectedItem as any).linkedEntityIds || [];
                            const newLinks = e.target.checked
                              ? [...currentLinks, entity.id]
                              : currentLinks.filter((id: string) => id !== entity.id);
                            onUpdate(selectedItem.id, { linkedEntityIds: newLinks });
                          }}
                        />
                        <span className="truncate flex-1">{entity.title || 'Sem Nome'}</span>
                        <span className="text-[9px] text-zinc-500 shrink-0">
                          {isSpeaker ? t('speakerTag') : entity.type === 'TEAM' ? t('teamTag') : t('personTag')}
                        </span>
                      </label>
                    );
                  })}
                  {linkableEntities.length === 0 && <div className="text-xs text-zinc-500 p-2 text-center">{t('noEntities')}</div>}
                </div>
              </div>

            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#27272a] bg-[#18181b] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">{t('layer')}</span>
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded p-0.5">
              <button onClick={() => handleOrder('bottom')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors" title="Fundo"><ChevronsDown size={14} /></button>
              <button onClick={() => handleOrder('down')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors" title="Para Trás"><ArrowDown size={14} /></button>
              <div className="w-px h-3 bg-zinc-800 mx-1" />
              <button onClick={() => handleOrder('up')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors" title="Para Frente"><ArrowUp size={14} /></button>
              <button onClick={() => handleOrder('top')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors" title="Topo"><ChevronsUp size={14} /></button>
            </div>
          </div>

          {/* Duplicate button */}
          <button
            onClick={handleDuplicate}
            className="w-full py-2 bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-400 hover:text-white border border-zinc-700/50 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Copy size={13} />{t('duplicate')}
          </button>

          {confirmDelete ? (
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-semibold transition-colors">{t('cancel')}</button>
              <button onClick={() => onDelete(selectedItem.id)} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold transition-colors">{t('confirmDelete')}</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 border border-red-500/20 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-2">
              <Trash2 size={14} />{t('deleteItem')}
            </button>
          )}
        </div>
      </div>
    </>
  );
});
