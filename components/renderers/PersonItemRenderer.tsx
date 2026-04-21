import React from 'react';
import { PersonItem } from '../../types';
import { User } from 'lucide-react';
import { DiagnosticBadge } from '../Canvas';
import { DiagnosticBadges } from './DiagnosticBadges';

interface Props {
    item: PersonItem;
    teamColor?: string;
    diagnostic?: DiagnosticBadge;
}

export const PersonItemRenderer: React.FC<Props> = React.memo(({ item, teamColor, diagnostic }) => {
    const isLinked = !!item.teamId && !!teamColor;

    return (
        <div
            className="w-full h-full flex items-center p-4 rounded-xl shadow-md bg-zinc-900 relative overflow-hidden group"
            style={isLinked ? {
                border: `1px solid ${teamColor}55`,
                boxShadow: `0 0 16px ${teamColor}18, 0 0 0 1px ${teamColor}33`,
            } : {
                border: '1px solid rgba(63,63,70,0.5)',
            }}
        >
            <div
                className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mr-4 overflow-hidden shrink-0"
                style={isLinked ? {
                    border: `2px solid ${teamColor}66`,
                } : {
                    border: '2px solid rgba(63,63,70,1)',
                }}
            >
                {item.avatarUrl ? (
                    <img src={item.avatarUrl} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                    <User size={20} className="text-zinc-500" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="text-base font-bold text-zinc-200 truncate">{item.title}</div>
                <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider truncate mt-0.5">{item.role}</div>
            </div>

            {diagnostic && <DiagnosticBadges diagnostic={diagnostic} />}
        </div>
    );
});
