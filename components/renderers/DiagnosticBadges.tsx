import React from 'react';
import { DiagnosticBadge } from '../Canvas';
import { useLanguage } from '../../utils/i18n';

interface Props {
  diagnostic: DiagnosticBadge;
}

export const DiagnosticBadges: React.FC<Props> = ({ diagnostic }) => {
  const { t } = useLanguage();
  const badges: React.ReactNode[] = [];

  if (diagnostic.isSPOF) {
    const pct = Math.round(diagnostic.spofScore * 100);
    badges.push(
      <div
        key="spof"
        title={`SPOF — ${pct}% ${t('risk')}`}
        className="flex items-center bg-red-500/15 border border-red-500/40 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
      >
        <span>SPOF</span>
      </div>
    );
  }

  if (diagnostic.hasContradiction) {
    badges.push(
      <div
        key="contradiction"
        title={t('badgeContradictionTitle')}
        className="flex items-center bg-amber-500/15 border border-amber-500/40 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
      >
        <span>{t('badgeContradiction')}</span>
      </div>
    );
  }

  if (diagnostic.hasPerceptionGap) {
    const isBlindSpot = diagnostic.perceptionGapType === 'blind_spot';
    badges.push(
      <div
        key="gap"
        title={isBlindSpot ? t('badgeBlindSpotTitle') : t('badgeImpostorTitle')}
        className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
          isBlindSpot
            ? 'bg-purple-500/15 border border-purple-500/40 text-purple-400'
            : 'bg-indigo-500/15 border border-indigo-500/40 text-indigo-400'
        }`}
      >
        <span>{isBlindSpot ? t('badgeBlindSpot') : t('badgeImpostor')}</span>
      </div>
    );
  }

  if (diagnostic.isCriticalLoad) {
    badges.push(
      <div
        key="load"
        title={t('badgeCriticalTitle')}
        className="flex items-center bg-orange-500/15 border border-orange-500/40 text-orange-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
      >
        <span>{t('badgeCritical')}</span>
      </div>
    );
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex items-center gap-1 ml-2 flex-wrap">
      {badges}
    </div>
  );
};
