import React from 'react';
import { EvidenceItem } from '../../types';
import { MessageSquare, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useLanguage } from '../../utils/i18n';

interface Props {
    item: EvidenceItem;
}

const SENTIMENT_COLOR = {
    positive: '#10b981',
    negative: '#ef4444',
    neutral:  '#f59e0b',
} as const;

export const EvidenceItemRenderer: React.FC<Props> = React.memo(({ item }) => {
    const { t } = useLanguage();
    const sentiment = item.sentiment ?? 'neutral';
    const accentColor = SENTIMENT_COLOR[sentiment as keyof typeof SENTIMENT_COLOR] ?? SENTIMENT_COLOR.neutral;

    const getSentimentIcon = () => {
        switch (sentiment) {
            case 'positive': return <CheckCircle2 size={14} className="text-emerald-500" />;
            case 'negative': return <AlertTriangle size={14} className="text-red-500" />;
            default:         return <Info size={14} className="text-amber-400" />;
        }
    };

    return (
        <div className="w-full h-full flex flex-col border border-zinc-700/50 rounded-lg overflow-hidden shadow-md bg-zinc-900 relative group">
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accentColor }} />

            <div className="flex items-center justify-between p-2 border-b border-zinc-800/50">
                <div className="flex items-center gap-1.5 overflow-hidden">
                    <MessageSquare size={12} className="text-zinc-500 shrink-0" />
                    <span className="text-[10px] font-bold text-zinc-300 truncate uppercase tracking-wider">{item.title}</span>
                </div>
                <div className="shrink-0 ml-1">
                    {getSentimentIcon()}
                </div>
            </div>

            <div className="flex-1 p-2.5 overflow-y-auto custom-scrollbar">
                <p className="text-xs text-zinc-400 leading-relaxed italic">"{item.content}"</p>
            </div>

            {item.source && (
                <div className="px-2.5 py-1.5 bg-zinc-950/50 border-t border-zinc-800/50 flex items-center justify-between">
                    <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider">{t('evidenceSource')}</span>
                    <span className="text-[9px] font-bold text-zinc-500 uppercase truncate ml-2">{item.source}</span>
                </div>
            )}
        </div>
    );
});
