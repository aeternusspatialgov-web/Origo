import React from 'react';
import { TeamItem } from '../../types';
import { Users, FoldVertical } from 'lucide-react';
import { useLanguage } from '../../utils/i18n';
import { DiagnosticBadge } from '../Canvas';
import { DiagnosticBadges } from './DiagnosticBadges';

interface Props {
    item: TeamItem;
    diagnostic?: DiagnosticBadge;
}

export const TeamItemRenderer: React.FC<Props> = React.memo(({ item, diagnostic }) => {
    const { t } = useLanguage();
    return (
        <div className="w-full h-full flex flex-col border-2 border-zinc-700/50 rounded-xl overflow-hidden shadow-md bg-zinc-900 relative">
            <div className="h-12 flex items-center px-4 border-b border-zinc-800" style={{ backgroundColor: `${item.color}20` }}>
                <Users size={18} style={{ color: item.color }} className="mr-3 shrink-0" />
                <span className="text-base font-bold uppercase tracking-wider truncate text-zinc-200 flex-1">{item.title}</span>
                {diagnostic && <DiagnosticBadges diagnostic={diagnostic} />}
            </div>
            <div className="flex-1 p-5 flex flex-col gap-3">
                {item.description && (
                    <div className="text-sm text-zinc-400 leading-relaxed line-clamp-4">
                        {item.description}
                    </div>
                )}
            </div>
            {item.isCollapsed && (
                <div className="absolute top-3 right-4 flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-full text-xs font-medium text-zinc-300">
                    <FoldVertical size={12} className="text-blue-400" />
                    <span>{t('collapsedTeamLabel')}</span>
                </div>
            )}
        </div>
    );
});
