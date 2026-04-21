import { CanvasItem, TeamItem, PersonItem, EvidenceItem } from '../types';
import { CorrelationReport, runCorrelationEngine } from './correlationEngine';

// --- STAGE 1: INGESTION CONTEXT ---
// Used when feeding raw transcripts per person/team
export const buildIngestionContext = (
  transcript: string,
  speakerName: string,
  speakerRole: string,
  items: CanvasItem[],
  lang: 'pt' | 'en' = 'pt'
): string => {
  const orgContext = buildOrgSummary(items, lang);

  return `You are processing an interview transcript for an organizational diagnostic tool called Origo.

ORGANIZATIONAL CONTEXT:
${orgContext}

SPEAKER: ${speakerName} (${speakerRole})

TRANSCRIPT:
${transcript}

INSTRUCTIONS:
Extract only concrete facts, pain points, dependencies, and sentiments expressed by this speaker.
Link observations to existing entities in the organizational context above when possible.
Return a JSON object with this exact structure:
{
  "speaker": "${speakerName}",
  "role": "${speakerRole}",
  "facts": ["fact1", "fact2"],
  "painPoints": ["pain1", "pain2"],
  "dependencies": ["entity name this speaker depends on"],
  "sentiment": "positive | neutral | negative",
  "keyQuotes": ["quote1", "quote2"]
}`;
};

// --- STAGE 2: SYNTHESIS CONTEXT ---
// Uses correlation engine output + canvas for deep analysis
export const buildSynthesisContext = (
  items: CanvasItem[],
  correlationReport: CorrelationReport,
  lang: 'pt' | 'en' = 'pt',
  companyName?: string
): string => {
  const orgContext = buildOrgSummary(items, lang);
  const evidencesContext = buildEvidencesContext(items);
  const analyticsContext = buildAnalyticsContext(correlationReport, lang);
  const companyHeader = companyName ? `COMPANY: ${companyName}\n\n` : '';

  return `You are the Origo Systemic Synthesizer — an expert in organizational design, cognitive load analysis, and structural diagnostics for software companies.

${companyHeader}ORGANIZATIONAL TOPOLOGY:
${orgContext}

EVIDENCE MAP (Testimonies, Pain Points, Facts):
${evidencesContext}

PRE-COMPUTED ANALYTICS (already calculated — do not recalculate):
${analyticsContext}

${lang === 'pt' ? `SUA MISSÃO:
Usando a topologia, evidências e análise pré-computada acima, produza uma análise sistêmica profunda.
Atue nos quatro eixos:

1. TRIANGULAÇÃO DE DEPOIMENTOS: Cruze as dores. Onde a dor de uma área é sintoma do gargalo de outra?
2. DISSONÂNCIA COGNITIVA: Onde o "o que a empresa diz que faz" diverge do "o que as pessoas sentem na realidade"?
3. TOPOLOGIA E CARGA COGNITIVA: Elabore sobre os SPOFs detectados e entidades sobrecarregadas. Quais são as razões estruturais?
4. REESTRUTURAÇÃO TO-BE: Baseado nos atritos e dependências, sugira reorganizações estruturais concretas.

Use Markdown com títulos claros. Negrite nomes de entidades (Equipes, Pessoas). Seja específico — referencie nomes reais dos dados.` : `YOUR MISSION:
Using the topology, evidence, and pre-computed analytics above, produce a deep systemic analysis.
Act on these four axes:

1. TESTIMONY TRIANGULATION: Cross-reference pain points. Where is pain in one area a symptom of a bottleneck in another?
2. COGNITIVE DISSONANCE: Where does "what the company says it does" diverge from "what people actually feel"?
3. TOPOLOGY & COGNITIVE LOAD: Elaborate on the detected SPOFs and overloaded entities. What are the structural reasons?
4. TO-BE RESTRUCTURING: Based on frictions and dependencies, suggest concrete structural reorganizations.

Use Markdown with clear headers. Bold entity names (Teams, People). Be specific — reference actual names from the data.`}` ;
};

// --- STAGE 3: REPORT CONTEXT ---
// Takes synthesis output and formats into final deliverable
export const buildReportContext = (
  synthesisOutput: string,
  items: CanvasItem[],
  correlationReport: CorrelationReport,
  lang: 'pt' | 'en' = 'pt',
  companyName?: string
): string => {
  const { summary } = correlationReport;
  const companyHeader = companyName ? `COMPANY: ${companyName}\n\n` : '';

  return `You are formatting a final organizational diagnostic report using Origo, a diagnostic tool.

${companyHeader}SYNTHESIS ANALYSIS (already written):
${synthesisOutput}

CANVAS STATS:
- Teams: ${summary.totalTeams}
- People: ${summary.totalPeople}
- Evidences: ${summary.totalEvidences} (${summary.totalNegative} negative, ${summary.totalPositive} positive, ${summary.totalNeutral} neutral)
${summary.isolatedPeople.length > 0 ? `- Isolated people (no linked evidences): ${summary.isolatedPeople.join(', ')}` : ''}
${summary.overloadedTeams.length > 0 ? `- Teams with critical load: ${summary.overloadedTeams.join(', ')}` : ''}

${lang === 'pt' ? `TAREFA:
Reformate a síntese em um relatório executivo limpo com estas seções exatas:
# Resumo do Diagnóstico
## Principais Constatações
## Pontos Únicos de Falha (SPOFs)
## Mapa de Dissonância Cognitiva
## Recomendações Estruturais (To-Be)
## Ações Imediatas

Use linguagem clara e direta. Cada recomendação deve referenciar pessoas ou equipes específicas pelo nome.
Termine com uma matriz de prioridade: Alto Impacto / Baixo Esforço primeiro.` : `TASK:
Reformat the synthesis into a clean executive report with these exact sections:
# Diagnostic Summary
## Critical Findings
## Single Points of Failure (SPOFs)
## Cognitive Dissonance Map
## Structural Recommendations (To-Be)
## Immediate Actions

Use clear, direct language. Each recommendation must reference specific people or teams by name.
End with a priority matrix: High Impact / Low Effort first.`}` ;
};

// --- HELPERS ---

const buildOrgSummary = (items: CanvasItem[], lang: 'pt' | 'en' = 'pt'): string => {
  const teams = items.filter(i => i.type === 'TEAM') as TeamItem[];
  const people = items.filter(i => i.type === 'PERSON') as PersonItem[];

  if (teams.length === 0 && people.length === 0) {
    return 'No organizational structure mapped yet.';
  }

  const lines: string[] = [];

  teams.forEach(team => {
    const members = people.filter(p => p.teamId === team.id);
    const memberStr = members.length > 0
      ? members.map(m => `${m.title} (${m.role})`).join(', ')
      : 'no members mapped';
    lines.push(`• ${team.title}: ${memberStr}`);
    if (team.description) lines.push(`  └─ ${team.description}`);
    if ((team.linkedTeamIds || []).length > 0) {
      const linkedNames = (team.linkedTeamIds || []).map(id => {
        const t = teams.find(t => t.id === id);
        return t?.title || id;
      });
      lines.push(`  └─ Connected to: ${linkedNames.join(', ')}`);
    }
  });

  // People without teams
  const unassigned = people.filter(p => !p.teamId);
  if (unassigned.length > 0) {
    lines.push(`• ${lang === 'pt' ? 'Sem equipe' : 'Unassigned'}: ${unassigned.map(p => `${p.title} (${p.role})`).join(', ')}`);
  }

  return lines.join('\n');
};


const buildAnalyticsContext = (report: CorrelationReport, lang: 'pt' | 'en' = 'pt'): string => {
  const lines: string[] = [];

  // SPOFs
  if (report.spofs.length > 0) {
    lines.push(lang === 'pt' ? 'SPOFs DETECTADOS (Pontos Únicos de Falha):' : 'DETECTED SPOFs (Single Points of Failure):');
    report.spofs.forEach(s => {
      lines.push(`  • ${s.entityName} (${s.role || s.entityType}) — score: ${(s.score * 100).toFixed(0)}%, ${s.totalEvidences} evidences, ${(s.negativeRatio * 100).toFixed(0)}% negative`);
    });
  }

  // Cognitive load — all levels
  if (report.cognitiveLoad.length > 0) {
    lines.push(lang === 'pt' ? '\nCARGA COGNITIVA:' : '\nCOGNITIVE LOAD:');
    report.cognitiveLoad.forEach(cl => {
      lines.push(`  • ${cl.entityName} (${cl.role || cl.entityType}) — ${cl.load.toUpperCase()}: ${cl.negativeEvidences}/${cl.totalEvidences} negative evidences (${(cl.score * 100).toFixed(0)}%)`);
    });
  }

  // Directed contradictions
  if (report.directedContradictions && report.directedContradictions.length > 0) {
    lines.push(lang === 'pt' ? '\nCONTRADIÇÕES DIRIGIDAS (A fala de B vs B fala de A):' : '\nDIRECTED CONTRADICTIONS (A speaks about B vs B speaks about A):');
    report.directedContradictions.forEach(dc => {
      lines.push(`  • ${dc.speakerAName} → ${dc.speakerBName}: ${dc.sentimentAtoB} | ${dc.speakerBName} → ${dc.speakerAName}: ${dc.sentimentBtoA} [${dc.severity.toUpperCase()}]`);
      lines.push(`    Evidence A: "${dc.evidenceA}"`);
      lines.push(`    Evidence B: "${dc.evidenceB}"`);
    });
  }

  // Perception gaps
  if (report.perceptionGaps && report.perceptionGaps.length > 0) {
    lines.push(lang === 'pt' ? '\nGAPS DE PERCEPÇÃO (autoavaliação vs percepção externa):' : '\nPERCEPTION GAPS (self-assessment vs external perception):');
    report.perceptionGaps.forEach(pg => {
      const gapLabel = pg.gap === 'blind_spot'
        ? (lang === 'pt' ? 'PONTO CEGO' : 'BLIND SPOT')
        : (lang === 'pt' ? 'GAP INVERSO' : 'IMPOSTOR GAP');
      lines.push(`  • ${pg.entityName} (${pg.role || pg.entityType}) — ${gapLabel} [${pg.severity.toUpperCase()}]`);
      lines.push(`    Self: ${pg.selfSentiment} | External: ${pg.externalDominant} (${pg.externalBreakdown.positive}+ ${pg.externalBreakdown.negative}- ${pg.externalBreakdown.neutral}~)`);
    });
  }

  // All correlations
  if (report.correlations.length > 0) {
    lines.push(lang === 'pt' ? '\nCORRELAÇÕES ENTRE ENTIDADES:' : '\nENTITY CORRELATIONS:');
    report.correlations.forEach(c => {
      lines.push(`  • ${c.aName} ↔ ${c.bName} — ${c.weight} shared evidences [${c.nature.toUpperCase()}]`);
    });
  }

  if (report.summary.isolatedPeople.length > 0) {
    lines.push(lang === 'pt' ? `\nPESSOAS ISOLADAS (sem evidências vinculadas): ${report.summary.isolatedPeople.join(', ')}` : `\nISOLATED PEOPLE (no evidence links): ${report.summary.isolatedPeople.join(', ')}`);
  }

  if (report.summary.interviewCoverage !== undefined) {
    lines.push(lang === 'pt' ? `\nCOBERTURA DE ENTREVISTAS: ${report.summary.interviewCoverage}% das pessoas foram entrevistadas` : `\nINTERVIEW COVERAGE: ${report.summary.interviewCoverage}% of people have been interviewed`);
  }

  return lines.length > 0 ? lines.join('\n') : 'No patterns detected yet — add more evidences to the canvas.';
};

const buildEvidencesContext = (items: CanvasItem[]): string => {
  const evidences = items.filter(i => i.type === 'EVIDENCE') as EvidenceItem[];
  const allEntities = items.filter(i => i.type === 'TEAM' || i.type === 'PERSON') as (TeamItem | PersonItem)[];
  const entityMap = new Map(allEntities.map(e => [e.id, e as TeamItem | PersonItem]));

  if (evidences.length === 0) return 'No evidence mapped yet.';

  const transcripts: string[] = [];
  const shortEvidences: string[] = [];

  evidences.forEach(ev => {
    const sentimentIcon = ev.sentiment === 'positive' ? '✓' : ev.sentiment === 'negative' ? '✗' : '○';
    const linkedEntities = (ev.linkedEntityIds || [])
      .map(id => entityMap.get(id))
      .filter(Boolean) as (TeamItem | PersonItem)[];
    const linkedNames = linkedEntities.map(e => e.title).join(', ');

    const isTranscript =
      (ev.content?.length || 0) > 500 ||
      /entrevista|interview|transcript|depoimento/i.test(ev.source || '');

    if (isTranscript) {
      // Prefer speakerId (explicit relator) over first linked PERSON
      const speakerEntity = ev.speakerId
        ? entityMap.get(ev.speakerId) as PersonItem | undefined
        : linkedEntities.find(e => e.type === 'PERSON') as PersonItem | undefined;
      const team = linkedEntities.find(e => e.type === 'TEAM') as TeamItem | undefined;
      const header = speakerEntity
        ? `TRANSCRIPT — ${speakerEntity.title} (${(speakerEntity as PersonItem).role || 'unknown role'}${team ? `, ${team.title}` : ''})`
        : `TRANSCRIPT — ${ev.title}`;
      const relatedEntities = linkedEntities
        .filter(e => e.id !== speakerEntity?.id)
        .map(e => e.title).join(', ');
      transcripts.push(`--- ${header} ---\nRelated entities: ${relatedEntities || 'none'}\nSentiment: ${ev.sentiment || 'neutral'}\n\n${ev.content}\n`);
    } else {
      const line = [`[${sentimentIcon}] "${ev.title}" (${ev.source || 'unknown source'})`];
      if (ev.content) line.push(`    "${ev.content}"`);
      if (linkedNames) line.push(`    → Linked to: ${linkedNames}`);
      shortEvidences.push(line.join('\n'));
    }
  });

  const sections: string[] = [];
  if (shortEvidences.length > 0) sections.push('SHORT EVIDENCES:\n' + shortEvidences.join('\n'));
  if (transcripts.length > 0) sections.push('INTERVIEW TRANSCRIPTS:\n' + transcripts.join('\n'));

  return sections.join('\n\n') || 'No evidence mapped yet.';
};
