import { CanvasItem, TeamItem, PersonItem, EvidenceItem } from '../types';

// --- TYPES ---

export interface SpofResult {
  entityId: string;
  entityName: string;
  entityType: 'PERSON' | 'TEAM';
  score: number;           // 0-1
  totalEvidences: number;
  negativeRatio: number;   // 0-1
  appearsInTeams: number;
  role?: string;
}

export interface ContradictionResult {
  entityId?: string;       // entity with mixed sentiment
  topic: string;           // entity name
  positiveVoices: string[];
  negativeVoices: string[];
  neutralVoices: string[];
  severity: 'low' | 'medium' | 'high';
}

export interface DirectedContradiction {
  speakerAId: string;
  speakerAName: string;
  speakerARole?: string;
  speakerBId: string;
  speakerBName: string;
  speakerBRole?: string;
  sentimentAtoB: 'positive' | 'neutral' | 'negative';
  sentimentBtoA: 'positive' | 'neutral' | 'negative';
  evidenceA: string;
  evidenceB: string;
  severity: 'low' | 'medium' | 'high';
}

export interface PerceptionGap {
  entityId: string;
  entityName: string;
  entityType: 'PERSON' | 'TEAM';
  selfSentiment: 'positive' | 'neutral' | 'negative';
  externalDominant: 'positive' | 'neutral' | 'negative';
  externalBreakdown: { positive: number; negative: number; neutral: number };
  gap: 'blind_spot' | 'impostor';
  severity: 'low' | 'medium' | 'high';
  role?: string;
}

export interface CognitiveLoadResult {
  entityId: string;
  entityName: string;
  entityType: 'PERSON' | 'TEAM';
  load: 'low' | 'moderate' | 'critical';
  score: number;
  negativeEvidences: number;
  totalEvidences: number;
  role?: string;
}

export interface CorrelationResult {
  aId: string;
  aName: string;
  bId: string;
  bName: string;
  weight: number;
  nature: 'conflict' | 'aligned' | 'mixed';
  sharedEvidenceTitles: string[];
}

export interface CorrelationReport {
  spofs: SpofResult[];
  contradictions: ContradictionResult[];
  directedContradictions: DirectedContradiction[];
  perceptionGaps: PerceptionGap[];
  cognitiveLoad: CognitiveLoadResult[];
  correlations: CorrelationResult[];
  summary: {
    totalTeams: number;
    totalPeople: number;
    totalEvidences: number;
    totalNegative: number;
    totalPositive: number;
    totalNeutral: number;
    isolatedPeople: string[];
    overloadedTeams: string[];
    interviewCoverage: number;
  };
}

// --- HELPERS ---

type Sentiment = 'positive' | 'neutral' | 'negative';

const dominantSentiment = (sentiments: Sentiment[]): Sentiment => {
  const counts = { positive: 0, neutral: 0, negative: 0 };
  sentiments.forEach(s => counts[s]++);
  // Ties: prefer the more extreme signal (negative > positive > neutral)
  if (counts.negative >= counts.positive && counts.negative >= counts.neutral) return 'negative';
  if (counts.positive >= counts.neutral) return 'positive';
  return 'neutral';
};

const sentimentDistance = (a: Sentiment, b: Sentiment): number => {
  const order: Record<Sentiment, number> = { positive: 2, neutral: 1, negative: 0 };
  return Math.abs(order[a] - order[b]);
};

// --- ENGINE ---

export const runCorrelationEngine = (items: CanvasItem[]): CorrelationReport => {
  const teams = items.filter(i => i.type === 'TEAM') as TeamItem[];
  const people = items.filter(i => i.type === 'PERSON') as PersonItem[];
  const evidences = items.filter(i => i.type === 'EVIDENCE') as EvidenceItem[];

  // Build lookup maps
  const entityMap = new Map<string, TeamItem | PersonItem>();
  [...teams, ...people].forEach(e => entityMap.set(e.id, e));

  // For each entity, collect all evidences that reference it
  const entityEvidenceMap = new Map<string, EvidenceItem[]>();
  [...teams, ...people].forEach(e => entityEvidenceMap.set(e.id, []));

  evidences.forEach(ev => {
    const allLinked = new Set([
      ...(ev.linkedEntityIds || []),
      ...(ev.speakerId ? [ev.speakerId] : []),
    ]);
    allLinked.forEach(linkedId => {
      const list = entityEvidenceMap.get(linkedId);
      if (list) list.push(ev);
    });
  });

  // =====================================================================
  // 1. SPOF DETECTION — minimum 2 evidences to qualify
  // =====================================================================
  const spofs: SpofResult[] = [];

  [...teams, ...people].forEach(entity => {
    const evList = entityEvidenceMap.get(entity.id) || [];
    if (evList.length < 2) return;

    const negCount = evList.filter(e => e.sentiment === 'negative').length;
    const negRatio = negCount / evList.length;

    // Count how many distinct teams this person bridges via cross-team evidence
    let appearsInTeams = 0;
    if (entity.type === 'PERSON') {
      const crossTeamEvidences = evList.filter(ev => {
        const linkedTeams = (ev.linkedEntityIds || []).filter(id => {
          const ent = entityMap.get(id);
          return ent?.type === 'TEAM';
        });
        return linkedTeams.length > 1;
      });
      appearsInTeams = crossTeamEvidences.length;
    }

    // Score: weighted by negativity (50%), volume (35%), cross-team bridges (15%)
    const volumeScore = Math.min(evList.length / 10, 1);
    const score = (negRatio * 0.5) + (volumeScore * 0.35) + (Math.min(appearsInTeams / 5, 1) * 0.15);

    if (score > 0.3 || evList.length >= 3) {
      spofs.push({
        entityId: entity.id,
        entityName: entity.title,
        entityType: entity.type as 'PERSON' | 'TEAM',
        score: Math.round(score * 100) / 100,
        totalEvidences: evList.length,
        negativeRatio: Math.round(negRatio * 100) / 100,
        appearsInTeams,
        role: entity.type === 'PERSON' ? (entity as PersonItem).role : undefined,
      });
    }
  });

  spofs.sort((a, b) => b.score - a.score);

  // =====================================================================
  // 2. DIRECTED CONTRADICTION DETECTION
  //    When person A speaks about B and B speaks about A, but their
  //    sentiments diverge — A sees B positively while B sees A negatively,
  //    or vice versa.
  // =====================================================================
  const directedContradictions: DirectedContradiction[] = [];

  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      const personA = people[i];
      const personB = people[j];

      // Evidences where A speaks and mentions B
      const aAboutB = evidences.filter(ev =>
        ev.speakerId === personA.id &&
        (ev.linkedEntityIds || []).includes(personB.id)
      );

      // Evidences where B speaks and mentions A
      const bAboutA = evidences.filter(ev =>
        ev.speakerId === personB.id &&
        (ev.linkedEntityIds || []).includes(personA.id)
      );

      if (aAboutB.length === 0 || bAboutA.length === 0) continue;

      const sentA = dominantSentiment(aAboutB.map(e => (e.sentiment || 'neutral') as Sentiment));
      const sentB = dominantSentiment(bAboutA.map(e => (e.sentiment || 'neutral') as Sentiment));

      if (sentA === sentB) continue; // Aligned — not a contradiction

      const dist = sentimentDistance(sentA, sentB);
      const severity: 'low' | 'medium' | 'high' = dist >= 2 ? 'high' : 'medium';

      directedContradictions.push({
        speakerAId: personA.id,
        speakerAName: personA.title,
        speakerARole: personA.role,
        speakerBId: personB.id,
        speakerBName: personB.title,
        speakerBRole: personB.role,
        sentimentAtoB: sentA,
        sentimentBtoA: sentB,
        evidenceA: aAboutB.map(e => e.title).join(', '),
        evidenceB: bAboutA.map(e => e.title).join(', '),
        severity,
      });
    }
  }

  directedContradictions.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  // =====================================================================
  // 3. ENTITY-LEVEL CONTRADICTIONS
  //    An entity that has BOTH positive and negative evidence linked to it.
  //    Voice attribution uses speaker names for better traceability.
  // =====================================================================
  const contradictions: ContradictionResult[] = [];

  const entitySentimentMap = new Map<string, { positive: string[], negative: string[], neutral: string[] }>();

  evidences.forEach(ev => {
    const allLinked = new Set([
      ...(ev.linkedEntityIds || []),
      ...(ev.speakerId ? [ev.speakerId] : []),
    ]);
    allLinked.forEach(linkedId => {
      if (!entitySentimentMap.has(linkedId)) {
        entitySentimentMap.set(linkedId, { positive: [], negative: [], neutral: [] });
      }
      const bucket = entitySentimentMap.get(linkedId)!;
      // Attribute to speaker name when available, fall back to evidence title
      const speakerEntity = ev.speakerId ? entityMap.get(ev.speakerId) : null;
      const voiceName = speakerEntity ? (speakerEntity as PersonItem).title : ev.title;

      if (ev.sentiment === 'positive') bucket.positive.push(voiceName);
      else if (ev.sentiment === 'negative') bucket.negative.push(voiceName);
      else bucket.neutral.push(voiceName);
    });
  });

  entitySentimentMap.forEach((sentiments, entityId) => {
    const entity = entityMap.get(entityId);
    if (!entity) return;

    const hasPositive = sentiments.positive.length > 0;
    const hasNegative = sentiments.negative.length > 0;

    if (hasPositive && hasNegative) {
      const total = sentiments.positive.length + sentiments.negative.length + sentiments.neutral.length;
      const minorityRatio = Math.min(sentiments.positive.length, sentiments.negative.length) / total;

      const severity: 'low' | 'medium' | 'high' =
        minorityRatio > 0.4 ? 'high' :
        minorityRatio > 0.2 ? 'medium' : 'low';

      contradictions.push({
        entityId,
        topic: entity.title,
        positiveVoices: sentiments.positive,
        negativeVoices: sentiments.negative,
        neutralVoices: sentiments.neutral,
        severity,
      });
    }
  });

  contradictions.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  // =====================================================================
  // 4. PERCEPTION GAP DETECTION
  //    Compares a person's self-assessment (their own interview sentiment)
  //    vs how others perceive them (sentiment of OTHER speakers' evidence
  //    that references this person).
  //
  //    blind_spot = self is positive/neutral, others see negative
  //    impostor   = self is negative, others see positive
  // =====================================================================
  const perceptionGaps: PerceptionGap[] = [];

  people.forEach(person => {
    // Self-evidence: interviews given by this person
    const selfEvs = evidences.filter(ev => ev.speakerId === person.id);
    if (selfEvs.length === 0) return;

    // External evidence: other people's interviews that reference this person
    const externalEvs = evidences.filter(ev =>
      ev.speakerId !== person.id &&
      ev.speakerId !== undefined &&
      (ev.linkedEntityIds || []).includes(person.id)
    );
    if (externalEvs.length === 0) return;

    const selfSentiment = dominantSentiment(selfEvs.map(e => (e.sentiment || 'neutral') as Sentiment));
    const externalSentiments = externalEvs.map(e => (e.sentiment || 'neutral') as Sentiment);
    const externalDominant = dominantSentiment(externalSentiments);

    if (selfSentiment === externalDominant) return; // Aligned — no gap

    const breakdown = {
      positive: externalSentiments.filter(s => s === 'positive').length,
      negative: externalSentiments.filter(s => s === 'negative').length,
      neutral: externalSentiments.filter(s => s === 'neutral').length,
    };

    const selfOrder: Record<Sentiment, number> = { positive: 2, neutral: 1, negative: 0 };
    const gap: 'blind_spot' | 'impostor' =
      selfOrder[selfSentiment] > selfOrder[externalDominant] ? 'blind_spot' : 'impostor';

    const dist = sentimentDistance(selfSentiment, externalDominant);
    const severity: 'low' | 'medium' | 'high' =
      externalEvs.length >= 3 && dist >= 2 ? 'high' :
      externalEvs.length >= 2 && dist >= 1 ? 'medium' : 'low';

    perceptionGaps.push({
      entityId: person.id,
      entityName: person.title,
      entityType: 'PERSON',
      selfSentiment,
      externalDominant,
      externalBreakdown: breakdown,
      gap,
      severity,
      role: person.role,
    });
  });

  perceptionGaps.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  // =====================================================================
  // 5. COGNITIVE LOAD — minimum 2 evidences for "critical"
  // =====================================================================
  const cognitiveLoad: CognitiveLoadResult[] = [];

  [...teams, ...people].forEach(entity => {
    const evList = entityEvidenceMap.get(entity.id) || [];
    if (evList.length === 0) return;

    const negCount = evList.filter(e => e.sentiment === 'negative').length;
    const score = negCount / Math.max(evList.length, 1);

    const load: 'low' | 'moderate' | 'critical' =
      evList.length >= 2 && score > 0.6 ? 'critical' :
      score > 0.3 ? 'moderate' : 'low';

    cognitiveLoad.push({
      entityId: entity.id,
      entityName: entity.title,
      entityType: entity.type as 'PERSON' | 'TEAM',
      load,
      score: Math.round(score * 100) / 100,
      negativeEvidences: negCount,
      totalEvidences: evList.length,
      role: entity.type === 'PERSON' ? (entity as PersonItem).role : undefined,
    });
  });

  cognitiveLoad.sort((a, b) => b.score - a.score);

  // =====================================================================
  // 6. ENTITY CORRELATIONS
  // =====================================================================
  const correlations: CorrelationResult[] = [];
  const entityIds = [...teams, ...people].map(e => e.id);

  for (let i = 0; i < entityIds.length; i++) {
    for (let j = i + 1; j < entityIds.length; j++) {
      const aId = entityIds[i];
      const bId = entityIds[j];
      const aEvs = entityEvidenceMap.get(aId) || [];
      const bEvs = entityEvidenceMap.get(bId) || [];

      const aEvIds = new Set(aEvs.map(e => e.id));
      const shared = bEvs.filter(e => aEvIds.has(e.id));

      if (shared.length < 2) continue;

      const sharedPos = shared.filter(e => e.sentiment === 'positive').length;
      const sharedNeg = shared.filter(e => e.sentiment === 'negative').length;

      const nature: 'conflict' | 'aligned' | 'mixed' =
        sharedNeg > sharedPos * 2 ? 'conflict' :
        sharedPos > sharedNeg * 2 ? 'aligned' : 'mixed';

      const aEntity = entityMap.get(aId)!;
      const bEntity = entityMap.get(bId)!;

      correlations.push({
        aId,
        aName: aEntity.title,
        bId,
        bName: bEntity.title,
        weight: shared.length,
        nature,
        sharedEvidenceTitles: shared.map(e => e.title),
      });
    }
  }

  correlations.sort((a, b) => b.weight - a.weight);

  // =====================================================================
  // 7. SUMMARY
  // =====================================================================
  const allLinkedIds = new Set(evidences.flatMap(e => e.linkedEntityIds || []));
  const isolatedPeople = people
    .filter(p => !allLinkedIds.has(p.id) && !evidences.some(ev => ev.speakerId === p.id))
    .map(p => p.title);

  const overloadedTeams = cognitiveLoad
    .filter(cl => cl.entityType === 'TEAM' && cl.load === 'critical')
    .map(cl => cl.entityName);

  const interviewedPeople = new Set(evidences.map(ev => ev.speakerId).filter(Boolean));
  const interviewCoverage = people.length > 0
    ? Math.round((interviewedPeople.size / people.length) * 100)
    : 0;

  const summary = {
    totalTeams: teams.length,
    totalPeople: people.length,
    totalEvidences: evidences.length,
    totalNegative: evidences.filter(e => e.sentiment === 'negative').length,
    totalPositive: evidences.filter(e => e.sentiment === 'positive').length,
    totalNeutral: evidences.filter(e => e.sentiment === 'neutral').length,
    isolatedPeople,
    overloadedTeams,
    interviewCoverage,
  };

  return { spofs, contradictions, directedContradictions, perceptionGaps, cognitiveLoad, correlations, summary };
};
