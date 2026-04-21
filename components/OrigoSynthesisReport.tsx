import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Loader2, AlertCircle, ChevronDown, Settings, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';
import { CanvasItem } from '../types';
import { runCorrelationEngine, CorrelationReport } from '../utils/correlationEngine';
import { buildSynthesisContext, buildReportContext } from '../utils/preprocessor';
import {
  callAI,
  AIProvider, StageConfig, DEFAULT_MODELS,
  Stage,
} from '../services/aiService';
import { useLanguage } from '../utils/i18n';
import { OrigoAIIcon, SynthesisIcon } from './Toolbar';

interface StageState {
  provider: AIProvider;
  model: string;
  apiKey: string;
}

type PipelineStage = 'idle' | 'synthesis' | 'report' | 'done' | 'error';

interface OrigoSynthesisReportProps {
  isOpen: boolean;
  onClose: () => void;
  items: CanvasItem[];
  companyName?: string;
}

const PROVIDER_LABELS: Record<AIProvider, string> = {
  gemini: 'Gemini',
  claude: 'Claude',
  openai: 'OpenAI',
};

const buildDefaultStage = (): StageState => {
  return { provider: 'gemini', apiKey: '', model: DEFAULT_MODELS['gemini'][0] };
};

const ProviderSelector = ({ stage, config, onChange }: {
  stage: Stage;
  config: StageState;
  onChange: (s: StageState) => void;
}) => {
  const { t } = useLanguage();
  const providers: AIProvider[] = ['gemini', 'claude', 'openai'];
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[10px] uppercase text-zinc-500 tracking-widest font-semibold">{stage === 'ingestion' ? t('ingestionStage') : stage === 'synthesis' ? t('synthesisStage') : t('reportStage')}</div>
      <div className="flex gap-2 items-center">
        <div className="relative">
          <select value={config.provider} onChange={e => { const p = e.target.value as AIProvider; onChange({ ...config, provider: p, model: DEFAULT_MODELS[p][0] }); }} className="appearance-none bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-3 py-2 pr-7 focus:outline-none focus:border-indigo-500 cursor-pointer">
            {providers.map(p => <option key={p} value={p}>{PROVIDER_LABELS[p]}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={config.model} onChange={e => onChange({ ...config, model: e.target.value })} className="appearance-none bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-3 py-2 pr-7 focus:outline-none focus:border-indigo-500 cursor-pointer">
            {DEFAULT_MODELS[config.provider].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>
        <input type="password" value={config.apiKey} onChange={e => onChange({ ...config, apiKey: e.target.value })} placeholder="API Key" className="flex-1 bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 placeholder:text-zinc-600 font-mono min-w-0" />
        {config.apiKey ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> : <AlertCircle size={16} className="text-zinc-600 shrink-0" />}
      </div>
    </div>
  );
};

const StageIndicator = ({ current }: { current: PipelineStage }) => {
  const { t } = useLanguage();
  const stages: { key: PipelineStage; label: string }[] = [
    { key: 'synthesis', label: t('synthStep') },
    { key: 'report', label: t('reportStep') },
    { key: 'done', label: t('completedStep') },
  ];
  const currentIdx = stages.findIndex(s => s.key === current);
  return (
    <div className="flex items-center gap-2">
      {stages.map((s, i) => (
        <React.Fragment key={s.key}>
          <div className={`flex items-center gap-1.5 text-xs transition-colors ${currentIdx === i ? 'text-indigo-400' : currentIdx > i ? 'text-emerald-500' : 'text-zinc-600'}`}>
            {currentIdx > i ? <CheckCircle2 size={14} /> : currentIdx === i && current !== 'done' ? <Loader2 size={14} className="animate-spin" /> : currentIdx === i && current === 'done' ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
            <span>{s.label}</span>
          </div>
          {i < stages.length - 1 && <ArrowRight size={12} className="text-zinc-700" />}
        </React.Fragment>
      ))}
    </div>
  );
};

const MarkdownContent = ({ content }: { content: string }) => (
  <div className="prose prose-invert prose-zinc max-w-none">
    {content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-indigo-400 mt-8 mb-4 text-2xl font-black tracking-tight border-b border-zinc-800 pb-3">{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-indigo-300 mt-6 mb-3 text-xl font-bold">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-zinc-200 mt-5 mb-2 text-base font-semibold">{line.slice(4)}</h3>;
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const parts = line.slice(2).split(/(\*\*.*?\*\*)/g);
        return <li key={i} className="ml-5 text-zinc-300 mb-1.5 text-sm leading-relaxed">{parts.map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j} className="text-white font-semibold">{p.slice(2, -2)}</strong> : p)}</li>;
      }
      if (line.trim() === '') return <br key={i} />;
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return <p key={i} className="text-zinc-300 mb-3 leading-relaxed text-sm">{parts.map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j} className="text-white font-semibold">{p.slice(2, -2)}</strong> : p)}</p>;
    })}
  </div>
);

// Reusable info tooltip icon — direction controls vertical, align controls horizontal
const InfoTip = ({ text, direction = 'up', align = 'left' }: { text: string; direction?: 'up' | 'down'; align?: 'left' | 'right' }) => (
  <div className="relative group cursor-default">
    <div className="w-4 h-4 rounded-full border border-zinc-600 text-zinc-500 flex items-center justify-center text-[9px] font-bold hover:border-zinc-400 hover:text-zinc-300 transition-colors select-none">i</div>
    <div className={`absolute z-50 w-60 bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-[10px] text-zinc-300 leading-relaxed shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity ${
      align === 'right' ? 'right-0' : 'left-0'
    } ${
      direction === 'down' ? 'top-full mt-2' : 'bottom-full mb-2'
    }`}>
      {text}
      {direction === 'down'
        ? <div className={`absolute bottom-full ${align === 'right' ? 'right-4' : 'left-4'} border-4 border-transparent border-b-zinc-700`} />
        : <div className={`absolute top-full ${align === 'right' ? 'right-4' : 'left-4'} border-4 border-transparent border-t-zinc-700`} />
      }
    </div>
  </div>
);

const CorrelationPreview = ({ report }: { report: CorrelationReport }) => {
  const { t } = useLanguage();

  const sentimentLabel = (s: string) =>
    s === 'positive' ? t('sentLabelPos') : s === 'negative' ? t('sentLabelNeg') : t('sentLabelNeu');
  const sentimentIcon = (s: string) => s === 'positive' ? '✓' : s === 'negative' ? '✗' : '○';
  const severityLabel = (s: string) =>
    s === 'high' ? t('sevHigh') : s === 'medium' ? t('sevMedium') : t('sevLow');

  const blindSpots = report.perceptionGaps.filter(p => p.gap === 'blind_spot');
  const impostorGaps = report.perceptionGaps.filter(p => p.gap === 'impostor');
  const criticalLoad = report.cognitiveLoad.filter(cl => cl.load === 'critical');

  return (
    <div className="flex flex-col gap-3 mb-4">

      {/* Row 1: SPOFs + Contradictions */}
      <div className="grid grid-cols-2 gap-3">

        {/* SPOFs — all */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="text-[10px] uppercase tracking-widest text-red-400 font-semibold">{t('spofsDetected')}</div>
              <InfoTip direction="down" text={t('spofInfo')} />
            </div>
            <div className="text-[10px] text-red-400/60">{report.spofs.length}</div>
          </div>
          {report.spofs.length === 0
            ? <p className="text-zinc-500 text-xs">{t('noneDetected')}</p>
            : <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {report.spofs.map(s => (
                  <div key={s.entityId}>
                    <div className="text-white text-xs font-medium truncate">{s.entityName}</div>
                    <div className="text-zinc-500 text-[10px]">{s.role || s.entityType} · {(s.score * 100).toFixed(0)}% {t('risk')}</div>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Directed contradictions — all */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">{t('directedContradictionsTitle')}</div>
              <InfoTip direction="down" text={t('directedContradictionsInfo')} />
            </div>
            <div className="text-[10px] text-amber-400/60">{report.directedContradictions.length}</div>
          </div>
          {report.directedContradictions.length === 0
            ? <p className="text-zinc-500 text-xs">{t('noneDetectedCross')}</p>
            : <div className="flex flex-col gap-2">
                {report.directedContradictions.map((dc, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white text-xs font-medium">{dc.speakerAName}</span>
                      <span className="text-zinc-600 text-[10px]">{t('speaksAbout')}</span>
                      <span className="text-white text-xs font-medium">{dc.speakerBName}</span>
                      <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full ${dc.severity === 'high' ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-700 text-zinc-400'}`}>
                        {severityLabel(dc.severity)}
                      </span>
                    </div>
                    <div className="text-zinc-500 text-[10px] mt-0.5 pl-0">
                      {dc.speakerAName}: <span className={dc.sentimentAtoB === 'positive' ? 'text-emerald-400' : dc.sentimentAtoB === 'negative' ? 'text-red-400' : 'text-zinc-400'}>{sentimentLabel(dc.sentimentAtoB)}</span>
                      {' · '}
                      {dc.speakerBName}: <span className={dc.sentimentBtoA === 'positive' ? 'text-emerald-400' : dc.sentimentBtoA === 'negative' ? 'text-red-400' : 'text-zinc-400'}>{sentimentLabel(dc.sentimentBtoA)}</span>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* Row 2: Blind spots + Impostor gaps + Critical load */}
      <div className="grid grid-cols-3 gap-3">

        {/* Blind spots — self positive/neutral, others see negative */}
        <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="text-[10px] uppercase tracking-widest text-purple-400 font-semibold">{t('blindSpotPanelTitle')}</div>
              <InfoTip text={t('blindSpotPanelInfo')} />
            </div>
            <div className="text-[10px] text-purple-400/60">{blindSpots.length}</div>
          </div>
          <p className="text-zinc-600 text-[9px] mb-3">{t('blindSpotDesc')}</p>
          {blindSpots.length === 0
            ? <p className="text-zinc-500 text-xs">{t('noneDetectedM')}</p>
            : <div className="flex flex-col gap-2">
                {blindSpots.map(pg => (
                  <div key={pg.entityId}>
                    <div className="text-white text-xs font-medium">{pg.entityName}</div>
                    <div className="text-zinc-500 text-[10px]">
                      self <span className={pg.selfSentiment === 'positive' ? 'text-emerald-400' : 'text-zinc-400'}>{sentimentIcon(pg.selfSentiment)}</span>
                      {' → '}
                      ext <span className="text-red-400">{sentimentIcon(pg.externalDominant)}</span>
                      {' · '}{pg.externalBreakdown.negative} {t('externalNeg')}
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Impostor gaps — self negative, others see positive */}
        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">{t('impostorPanelTitle')}</div>
              <InfoTip text={t('impostorPanelInfo')} />
            </div>
            <div className="text-[10px] text-indigo-400/60">{impostorGaps.length}</div>
          </div>
          <p className="text-zinc-600 text-[9px] mb-3">{t('impostorDesc')}</p>
          {impostorGaps.length === 0
            ? <p className="text-zinc-500 text-xs">{t('noneDetectedM')}</p>
            : <div className="flex flex-col gap-2">
                {impostorGaps.map(pg => (
                  <div key={pg.entityId}>
                    <div className="text-white text-xs font-medium">{pg.entityName}</div>
                    <div className="text-zinc-500 text-[10px]">
                      self <span className="text-red-400">{sentimentIcon(pg.selfSentiment)}</span>
                      {' → '}
                      ext <span className={pg.externalDominant === 'positive' ? 'text-emerald-400' : 'text-zinc-400'}>{sentimentIcon(pg.externalDominant)}</span>
                      {' · '}{pg.externalBreakdown.positive} {t('externalPos')}
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Critical cognitive load — all */}
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="text-[10px] uppercase tracking-widest text-orange-400 font-semibold">{t('criticalLoad')}</div>
              <InfoTip text={t('criticalLoadInfo')} align="right" />
            </div>
            <div className="text-[10px] text-orange-400/60">{criticalLoad.length}</div>
          </div>
          {criticalLoad.length === 0
            ? <p className="text-zinc-500 text-xs">{t('noCritical')}</p>
            : <div className="flex flex-col gap-1.5">
                {criticalLoad.map(cl => (
                  <div key={cl.entityId} className="flex items-center justify-between">
                    <div>
                      <div className="text-white text-xs font-medium">{cl.entityName}</div>
                      <div className="text-zinc-500 text-[10px]">{cl.role || cl.entityType}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 text-[10px] font-mono tabular-nums">{Math.round(cl.score * 100)}% neg.</div>
                      <div className="text-zinc-600 text-[9px]">{cl.totalEvidences} evid.</div>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  );
};

export const OrigoSynthesisReport = React.memo(function OrigoSynthesisReport({ isOpen, onClose, items, companyName }: OrigoSynthesisReportProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle');
  const [error, setError] = useState<string | null>(null);
  const [reportOutput, setReportOutput] = useState<string | null>(null);
  const [correlationReport, setCorrelationReport] = useState<CorrelationReport | null>(null);
  const [synthesisConfig, setSynthesisConfig] = useState<StageState>(buildDefaultStage);
  const [reportConfig, setReportConfig] = useState<StageState>(buildDefaultStage);
  const { lang, t } = useLanguage();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (items.length > 0) {
      setCorrelationReport(runCorrelationEngine(items));
    }
  }, [items]);

  const cancelPipeline = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setPipelineStage('idle');
    setError(null);
  }, []);

  const runPipeline = useCallback(async () => {
    if (!correlationReport) return;

    // Cancel any previous in-flight request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const { signal } = controller;

    setError(null);
    setReportOutput(null);
    const langInstruction = lang === 'pt'
      ? 'INSTRUCAO CRITICA: Voce DEVE responder EXCLUSIVAMENTE em portugues do Brasil. Toda a sua analise, titulos, listas e recomendacoes devem estar em portugues. Nao use ingles em nenhuma parte da resposta.'
      : 'CRITICAL INSTRUCTION: You MUST respond EXCLUSIVELY in English. All your analysis, titles, lists and recommendations must be in English.';

    /*
    const legacyCorruptedLangInstruction = lang === 'pt'
      ? 'INSTRUÇÃO CRÍTICA: Você DEVE responder EXCLUSIVAMENTE em português do Brasil. Toda a sua análise, títulos, listas e recomendações devem estar em português. Não use inglês em nenhuma parte da resposta.'
      : 'CRITICAL INSTRUCTION: You MUST respond EXCLUSIVELY in English. All your analysis, titles, lists and recommendations must be in English.';

    */
    try {
      // --- STAGE 1: SYNTHESIS ---
      setPipelineStage('synthesis');
      const synthPrompt = langInstruction + '\n\n' + buildSynthesisContext(items, correlationReport, lang, companyName);

      const synthResult = await callAI(synthPrompt, synthesisConfig, undefined, signal);

      if (!synthResult || synthResult.trim().length === 0) {
        throw new Error(t('emptySynthesisStage'));
      }

      // --- STAGE 2: REPORT ---
      setPipelineStage('report');
      const reportPrompt = langInstruction + '\n\n' + buildReportContext(synthResult, items, correlationReport, lang, companyName);

      const reportResult = await callAI(reportPrompt, reportConfig, undefined, signal);

      if (!reportResult || reportResult.trim().length === 0) {
        throw new Error(t('emptyReportStage'));
      }

      setReportOutput(reportResult);
      setPipelineStage('done');

    } catch (err: any) {
      if (err.name === 'AbortError') return; // user cancelled — stay idle, no error shown
      console.error('[Origo] Pipeline error:', err);
      setError(err?.message || t('errorUnknownPipeline'));
      setPipelineStage('error');
    } finally {
      abortControllerRef.current = null;
    }
  }, [items, correlationReport, synthesisConfig, reportConfig, lang, t, companyName]);

  const isRunning = pipelineStage === 'synthesis' || pipelineStage === 'report';
  const canRun = synthesisConfig.apiKey && reportConfig.apiKey;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200" onClick={onClose}>
      <div className="w-[900px] max-w-[95vw] max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <SynthesisIcon size={20} className="text-indigo-400" isActive />
            <h2 className="text-base font-semibold text-white">{t('systemicSynthesisTitle')}</h2>
            {(isRunning || pipelineStage === 'done') && <StageIndicator current={pipelineStage} />}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowConfig(p => !p)} className={`p-2 rounded-lg transition-colors text-zinc-400 hover:text-white ${showConfig ? 'bg-zinc-800' : 'hover:bg-zinc-800'}`} title={t('configureSettings')}><Settings size={16} /></button>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"><X size={16} /></button>
          </div>
        </div>

        {/* CONFIG PANEL */}
        {showConfig && (
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/40 shrink-0 space-y-4">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">{t('configurePipeline')}</div>
            <ProviderSelector stage="synthesis" config={synthesisConfig} onChange={setSynthesisConfig} />
            <ProviderSelector stage="report" config={reportConfig} onChange={setReportConfig} />
          </div>
        )}

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {correlationReport && <CorrelationPreview report={correlationReport} />}
          {pipelineStage === 'error' && error && (
            <div className="flex flex-col items-center justify-center py-12 text-red-400 gap-4">
              <AlertCircle size={40} />
              <p className="text-sm text-center max-w-lg font-medium">{error}</p>
              <p className="text-[11px] text-zinc-600 text-center max-w-lg">
                {t('checkConsole')}
              </p>
              <button
                onClick={runPipeline}
                className="mt-2 px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl text-xs font-medium transition-colors"
              >
                {t('tryAgain')}
              </button>
            </div>
          )}
          {isRunning && (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400 gap-4">
              <Loader2 size={36} className="animate-spin text-indigo-500" />
              <p className="text-sm text-center text-zinc-300">{pipelineStage === 'synthesis' ? t('crossingEvidence') : t('formattingReport')}</p>
            </div>
          )}
          {reportOutput && pipelineStage === 'done' && <MarkdownContent content={reportOutput} />}
          {pipelineStage === 'idle' && !reportOutput && (
            <div className="flex flex-col items-center justify-center py-8 text-zinc-500 gap-3">
              <OrigoAIIcon size={32} className="text-zinc-700" />
              <p className="text-sm text-center">{t('idleHint').split('\n')[0]}<br />{t('idleHint').split('\n')[1]}</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-zinc-600">
            {correlationReport ? [
            `${correlationReport.summary.totalEvidences} ${t('evidenceCount')}`,
            `${correlationReport.spofs.length} SPOFs`,
            `${correlationReport.directedContradictions.length} ${t('directedContradictionsCount')}`,
            `${correlationReport.perceptionGaps.length} ${t('perceptionGapsCount')}`,
            `${correlationReport.summary.interviewCoverage}${t('interviewCoverageSuffix')}`,
          ].join(' · ') : ''}
          </p>
          <div className="flex gap-2">
            {pipelineStage === 'done' && (
              <button onClick={runPipeline} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl text-xs font-medium transition-colors">
                <RefreshCw size={14} />{t('regenerate')}
              </button>
            )}
            {isRunning
              ? (
                <button onClick={cancelPipeline} className="flex items-center gap-2 px-5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition-colors">
                  <X size={14} />{t('cancelGeneration')}
                </button>
              ) : (
                <button onClick={runPipeline} disabled={!canRun} className="flex items-center gap-2 px-5 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  <OrigoAIIcon size={14} />
                  {t('generateSynthesis')}
                </button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
});
