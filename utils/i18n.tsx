import React, { createContext, useContext, useState } from 'react';

export type Language = 'pt' | 'en';

export const translations = {
  pt: {
    // --- TOOLBAR ---
    team: 'Equipe',
    person: 'Pessoa',
    evidence: 'Evidência',
    note: 'Nota',
    systemicSynthesis: 'Síntese Sistêmica',
    language: 'Idioma',
    undo: 'Desfazer (Ctrl+Z)',
    redo: 'Refazer (Ctrl+Y)',

    // --- CANVAS HEADER ---
    fileMenu: 'Menu de Arquivo',
    renameFile: 'Renomear Arquivo',
    unsavedChanges: 'Alterações não salvas',
    unnamedUniverse: 'Universo Sem Nome',

    // --- CANVAS TOOLBAR BOTTOM ---
    toolPan: 'Mover (Mão)',
    toolSelect: 'Seleção (Seta)',
    zoomIn: 'Aumentar Zoom',
    zoomOut: 'Diminuir Zoom',

    // --- CANVAS FILTER ---
    searchPlaceholder: 'Buscar pessoas, equipes...',
    allEvidences: 'Todas as Evidências',
    positiveEvidences: 'Positivas',
    neutralEvidences: 'Neutras',
    negativeEvidences: 'Negativas',
    typeFilterAll: 'Todos os Tipos',
    typeFilterTeam: 'Equipes',
    typeFilterPerson: 'Pessoas',
    typeFilterEvidence: 'Evidências',
    typeFilterNote: 'Notas',

    // --- CANVAS EMPTY STATE ---
    canvasEmptyHint: 'Crie seu primeiro time para começar →',

    // --- SIDEBAR ---
    sandboxMode: 'MODO SANDBOX',
    activeSession: 'SESSÃO ATIVA',
    entities: 'ENTIDADES',
    dataMemory: 'Dados & Memória',
    newUniverse: 'Novo Universo',
    loadDisk: 'Carregar Disco',
    persistData: 'Persistir Dados',
    protocols: 'Protocolos',
    systemManual: 'Manual do Sistema',
    endSession: 'Encerrar Sessão',
    backToHome: 'Voltar ao início',

    // --- INSPECTOR HEADER ---
    inspectorTeam: 'Equipe',
    inspectorPerson: 'Pessoa',
    inspectorEvidence: 'Evidência',
    inspectorNote: 'Nota',

    // --- INSPECTOR FIELDS ---
    evidenceTitle: 'Título da Evidência',
    teamName: 'Nome da Equipe',
    name: 'Nome',
    description: 'Descrição',
    collapseTeam: 'Recolher Equipe',
    role: 'Papel / Cargo',
    avatar: 'URL do Avatar (Opcional)',
    assignedTeam: 'Equipe',
    noTeam: 'Nenhuma',
    bgColor: 'Cor de Fundo',
    color: 'Cor',
    noteContent: 'Conteúdo da Nota',

    // --- INSPECTOR EVIDENCE ---
    transcript: 'Transcrição',
    shortContent: 'Conteúdo / Citação',
    expand: 'Expandir',
    pasteTranscript: 'Colar transcrição',
    contentPlaceholder: 'Citação, dado ou observação...',
    speaker: 'Entrevistado / Relator',
    noSpeaker: 'Nenhum — dado externo',
    autoSpeakerLink: 'Cabo automático criado com o relator',
    sentiment: 'Sentimento',
    sentimentPositive: 'Positivo',
    sentimentNeutral: 'Neutro',
    sentimentNegative: 'Negativo',
    relatedEntities: 'Entidades Relacionadas',
    relatedEntitiesHint: 'contexto do depoimento',
    noEntities: 'Nenhuma entidade disponível',
    speakerTag: '🎙 relator',
    teamTag: 'equipe',
    personTag: 'pessoa',
    autoLink: 'Auto-vincular',

    // --- INSPECTOR FOOTER ---
    layer: 'Camada',
    deleteItem: 'Excluir Item',
    confirmDelete: 'Confirmar Exclusão',
    cancel: 'Cancelar',
    duplicate: 'Duplicar',

    // --- TRANSCRIPT MODAL ---
    transcriptPlaceholder: 'Cole aqui a transcrição completa da entrevista, depoimento ou qualquer evidência longa...\n\nDica: vincule esta evidência ao PersonItem do entrevistado e ao TeamItem da equipe para que o motor de análise correlacione automaticamente.',
    transcriptLabel: 'Transcrição',
    transcriptDetected: 'Transcrição longa — processada pelo motor de análise.',
    addMoreText: 'Adicione mais texto para classificar como transcrição.',
    autoDetected: 'entidade(s) detectada(s) automaticamente',
    save: 'Salvar',
    words: 'palavras',
    expandTitle: 'Editar em tela cheia',

    // --- SYNTHESIS MODAL ---
    systemicSynthesisTitle: 'Síntese Sistêmica',
    configurePipeline: 'Configurar Pipeline de IA',
    synthesisStage: 'Síntese Sistêmica',
    reportStage: 'Relatório Final',
    ingestionStage: 'Ingestão',
    spofsDetected: 'SPOFs Detectados',
    noneDetected: 'Nenhum detectado',
    contradictions: 'Contradições',
    noHighSeverity: 'Nenhuma de alta severidade',
    criticalLoad: 'Carga Crítica',
    noCritical: 'Nenhuma crítica',
    crossingEvidence: 'Cruzando evidências e detectando padrões sistêmicos...',
    formattingReport: 'Formatando relatório executivo...',
    idleHint: 'O motor local já detectou os padrões acima.\nConfigure as chaves e clique em Gerar Síntese para a análise profunda com IA.',
    evidenceCount: 'evidências',
    spofsCount: 'SPOFs',
    contradictionsCount: 'contradições',
    cancelGeneration: 'Cancelar',
    regenerate: 'Regerar',
    generateSynthesis: 'Gerar Síntese',
    generating: 'Gerando...',
    tryAgain: 'Tentar Novamente',
    risk: 'risco',
    negativeLabel: 'negativas',
    synthStep: 'Síntese',
    completedStep: 'Concluído',
    reportStep: 'Relatório',
    configureSettings: 'Configurar pipeline',

    // --- SYNTHESIS ERRORS ---
    emptySynthesisStage: 'A IA retornou resposta vazia na etapa de Síntese. Verifique a chave e o modelo configurados.',
    emptyReportStage: 'A IA retornou resposta vazia na etapa de Relatório. Verifique a chave e o modelo configurados.',
    checkConsole: 'Verifique o console (F12) para detalhes do erro.',
    apiKeyNotConfigured: 'Chave de API não configurada para este estágio.',

    // --- DOCUMENTATION ---
    documentation: 'Documentação',
    docSubtitle: 'Manual Técnico do Origo',
    fundamentalConcepts: 'Conceitos Fundamentais',
    interactions: 'Interações e Comportamentos',
    structuralDiagnostic: 'Diagnóstico Estrutural',
    structuralDiagnosticDesc: 'O Origo é uma ferramenta de diagnóstico e mapeamento de sistemas sócio-técnicos. Ele permite visualizar a estrutura de equipes, pessoas, evidências e notas, facilitando a análise de dependências e gargalos.',
    mainEntities: 'Entidades Principais',
    connections: 'Conexões',
    connectionsDesc: 'Você pode conectar entidades arrastando a partir dos pontos de conexão nas bordas dos itens.',
    physicsLayout: 'Física e Layout',
    physicsLayoutDesc: 'O Origo utiliza um motor de física (D3 Force) para organizar automaticamente os itens conectados.',
    updatedAt: 'Atualizado em:',
    docSection_what: 'O que é o Origo',
    docSection_entities: 'Entidades',
    docSection_navigation: 'Navegação & Interações',
    docSection_connections: 'Conexões',
    docSection_engine: 'Motor de Análise',
    docSection_synthesis: 'Síntese com IA',
    docSection_files: 'Arquivos & Sessões',

    // --- PERSISTENCE ---
    fileCorrupted: 'Arquivo corrompido ou formato inválido.',
    fileReadError: 'Erro ao ler arquivo.',
    saveSuccess: 'Board salva com sucesso!',
    saveError: 'Erro ao salvar o arquivo.',
    unsavedChangesConfirm: 'Você tem alterações não salvas. Deseja descartá-las?',
    newBoardTitle: 'Sem Título',

    // --- DIAGNOSTIC BADGES ---
    badgeContradiction: 'Contradição',
    badgeContradictionTitle: 'Contradição — depoimentos conflitantes sobre esta entidade',
    badgeBlindSpot: 'Ponto Cego',
    badgeBlindSpotTitle: 'Ponto Cego — se avalia bem, percebido negativamente pelos outros',
    badgeImpostor: 'Gap Inverso',
    badgeImpostorTitle: 'Gap Inverso — se avalia mal, percebido positivamente pelos outros',
    badgeCritical: 'Crítica',
    badgeCriticalTitle: 'Carga Cognitiva Crítica — maioria de evidências negativas',

    // --- CORRELATION PREVIEW ---
    spofInfo: 'Ponto Único de Falha (SPOF): entidade com alto volume de evidências negativas e presença em múltiplos times. Se essa pessoa sair ou travar, a operação inteira sente.',
    spofDetectedSuffix: 'detectados',
    directedContradictionsTitle: 'Contradições Dirigidas',
    directedContradictionsInfo: 'Quando A fala de B com um sentimento e B fala de A com sentimento oposto. Indica relação assimétrica: um dos lados tem percepção distorcida ou informação parcial sobre o outro.',
    directedDetectedSuffix: 'detectadas',
    noneDetectedCross: 'Nenhuma detectada — depoimentos cruzados insuficientes',
    speaksAbout: 'fala de',
    blindSpotPanelTitle: 'Ponto Cego',
    blindSpotPanelInfo: 'A própria entrevista da pessoa tem tom positivo ou neutro, mas outros membros a mencionam com sentimento negativo. Ela não enxerga o impacto que causa nos outros.',
    blindSpotDesc: 'Se avalia bem, percebido negativamente',
    noneDetectedM: 'Nenhum detectado',
    externalNeg: 'negativas externas',
    impostorPanelTitle: 'Gap Inverso',
    impostorPanelInfo: 'A própria entrevista tem tom negativo — a pessoa se sente mal ou sobrecarregada — mas outros a mencionam com sentimento positivo. Pode indicar síndrome do impostor ou subestimação do próprio valor.',
    impostorDesc: 'Se avalia mal, percebido positivamente',
    externalPos: 'positivas externas',
    criticalLoadInfo: 'Entidade com maioria de evidências negativas vinculadas. Alta carga cognitiva indica que essa pessoa ou time está absorvendo problemas de outras áreas além dos seus próprios.',
    criticalCountSuffix: 'críticos',
    sentLabelPos: 'positivo',
    sentLabelNeg: 'negativo',
    sentLabelNeu: 'neutro',
    sevHigh: 'alta',
    sevMedium: 'média',
    sevLow: 'baixa',
    directedContradictionsCount: 'contradições dirigidas',
    perceptionGapsCount: 'gaps',
    interviewCoverageSuffix: '% cobertura',

    // --- RENDERERS ---
    collapsedTeamLabel: 'Recolhida',
    evidenceSource: 'Fonte',

    // --- ERROR BOUNDARY ---
    errorUnexpected: 'Ocorreu um erro inesperado',
    errorBody: 'O motor de física encontrou uma inconsistência crítica e precisou parar para proteger seus dados.',
    reloadSystem: 'Recarregar Sistema',

    // --- AI PROMPT ---
    promptLanguage: 'Responda em português do Brasil.',

    // --- MISC ---
    errorUnknownPipeline: 'Erro desconhecido ao gerar a síntese sistêmica.',
    demoTitle: 'Demonstração Origo',
    demoDescription: 'Módulo de diagnóstico estrutural.',
  },
  en: {
    // --- TOOLBAR ---
    team: 'Team',
    person: 'Person',
    evidence: 'Evidence',
    note: 'Note',
    systemicSynthesis: 'Systemic Synthesis',
    language: 'Language',
    undo: 'Undo (Ctrl+Z)',
    redo: 'Redo (Ctrl+Y)',

    // --- CANVAS HEADER ---
    fileMenu: 'File Menu',
    renameFile: 'Rename File',
    unsavedChanges: 'Unsaved changes',
    unnamedUniverse: 'Unnamed Universe',

    // --- CANVAS TOOLBAR BOTTOM ---
    toolPan: 'Pan Tool (Hand)',
    toolSelect: 'Select Tool (Arrow)',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',

    // --- CANVAS FILTER ---
    searchPlaceholder: 'Search people, teams...',
    allEvidences: 'All Evidence',
    positiveEvidences: 'Positive',
    neutralEvidences: 'Neutral',
    negativeEvidences: 'Negative',
    typeFilterAll: 'All Types',
    typeFilterTeam: 'Teams',
    typeFilterPerson: 'People',
    typeFilterEvidence: 'Evidence',
    typeFilterNote: 'Notes',

    // --- CANVAS EMPTY STATE ---
    canvasEmptyHint: 'Create your first team to get started →',

    // --- SIDEBAR ---
    sandboxMode: 'SANDBOX MODE',
    activeSession: 'ACTIVE SESSION',
    entities: 'ENTITIES',
    dataMemory: 'Data & Memory',
    newUniverse: 'New Universe',
    loadDisk: 'Load from Disk',
    persistData: 'Save File',
    protocols: 'Protocols',
    systemManual: 'System Manual',
    endSession: 'End Session',
    backToHome: 'Back to home',

    // --- INSPECTOR HEADER ---
    inspectorTeam: 'Team',
    inspectorPerson: 'Person',
    inspectorEvidence: 'Evidence',
    inspectorNote: 'Note',

    // --- INSPECTOR FIELDS ---
    evidenceTitle: 'Evidence Title',
    teamName: 'Team Name',
    name: 'Name',
    description: 'Description',
    collapseTeam: 'Collapse Team',
    role: 'Role / Title',
    avatar: 'Avatar URL (Optional)',
    assignedTeam: 'Team',
    noTeam: 'None',
    bgColor: 'Background Color',
    color: 'Color',
    noteContent: 'Note Content',

    // --- INSPECTOR EVIDENCE ---
    transcript: 'Transcript',
    shortContent: 'Content / Quote',
    expand: 'Expand',
    pasteTranscript: 'Paste transcript',
    contentPlaceholder: 'Quote, data or observation...',
    speaker: 'Interviewee / Speaker',
    noSpeaker: 'None — external data',
    autoSpeakerLink: 'Automatic cable created with speaker',
    sentiment: 'Sentiment',
    sentimentPositive: 'Positive',
    sentimentNeutral: 'Neutral',
    sentimentNegative: 'Negative',
    relatedEntities: 'Related Entities',
    relatedEntitiesHint: 'testimony context',
    noEntities: 'No entities available',
    speakerTag: '🎙 speaker',
    teamTag: 'team',
    personTag: 'person',
    autoLink: 'Auto-link',

    // --- INSPECTOR FOOTER ---
    layer: 'Layer',
    deleteItem: 'Delete Item',
    confirmDelete: 'Confirm Delete',
    cancel: 'Cancel',
    duplicate: 'Duplicate',

    // --- TRANSCRIPT MODAL ---
    transcriptPlaceholder: "Paste the full interview transcript, testimony or any long evidence here...\n\nTip: link this evidence to the interviewee's PersonItem and their TeamItem so the analysis engine correlates automatically.",
    transcriptLabel: 'Transcript',
    transcriptDetected: 'Long transcript detected — processed by analysis engine.',
    addMoreText: 'Add more text to classify as transcript.',
    autoDetected: 'entity(ies) automatically detected',
    save: 'Save',
    words: 'words',
    expandTitle: 'Edit fullscreen',

    // --- SYNTHESIS MODAL ---
    systemicSynthesisTitle: 'Systemic Synthesis',
    configurePipeline: 'Configure AI Pipeline',
    synthesisStage: 'Systemic Synthesis',
    reportStage: 'Final Report',
    ingestionStage: 'Ingestion',
    spofsDetected: 'SPOFs Detected',
    noneDetected: 'None detected',
    contradictions: 'Contradictions',
    noHighSeverity: 'None high severity',
    criticalLoad: 'Critical Load',
    noCritical: 'None critical',
    crossingEvidence: 'Crossing evidence and detecting systemic patterns...',
    formattingReport: 'Formatting executive report...',
    idleHint: 'The local engine already detected the patterns above.\nConfigure your keys and click Generate Synthesis for deep AI analysis.',
    evidenceCount: 'evidences',
    spofsCount: 'SPOFs',
    contradictionsCount: 'contradictions',
    cancelGeneration: 'Cancel',
    regenerate: 'Regenerate',
    generateSynthesis: 'Generate Synthesis',
    generating: 'Generating...',
    tryAgain: 'Try Again',
    risk: 'risk',
    negativeLabel: 'negative',
    synthStep: 'Synthesis',
    completedStep: 'Completed',
    reportStep: 'Report',
    configureSettings: 'Configure pipeline',

    // --- SYNTHESIS ERRORS ---
    emptySynthesisStage: 'AI returned an empty response at the Synthesis stage. Check the configured key and model.',
    emptyReportStage: 'AI returned an empty response at the Report stage. Check the configured key and model.',
    checkConsole: 'Check the console (F12) for error details.',
    apiKeyNotConfigured: 'API key not configured for this stage.',

    // --- DOCUMENTATION ---
    documentation: 'Documentation',
    docSubtitle: 'Origo Technical Manual',
    fundamentalConcepts: 'Fundamental Concepts',
    interactions: 'Interactions & Behaviors',
    structuralDiagnostic: 'Structural Diagnostic',
    structuralDiagnosticDesc: 'Origo is a diagnostic and mapping tool for socio-technical systems. It allows you to visualize the structure of teams, people, evidence and notes, facilitating dependency and bottleneck analysis.',
    mainEntities: 'Main Entities',
    connections: 'Connections',
    connectionsDesc: 'You can connect entities by dragging from the connection handles on item edges.',
    physicsLayout: 'Physics & Layout',
    physicsLayoutDesc: 'Origo uses a physics engine (D3 Force) to automatically arrange connected items.',
    updatedAt: 'Updated at:',
    docSection_what: 'What is Origo',
    docSection_entities: 'Entities',
    docSection_navigation: 'Navigation & Interactions',
    docSection_connections: 'Connections',
    docSection_engine: 'Analysis Engine',
    docSection_synthesis: 'AI Synthesis',
    docSection_files: 'Files & Sessions',

    // --- PERSISTENCE ---
    fileCorrupted: 'Corrupted or invalid file format.',
    fileReadError: 'Error reading file.',
    saveSuccess: 'Board saved successfully!',
    saveError: 'Error saving file.',
    unsavedChangesConfirm: 'You have unsaved changes. Discard them?',
    newBoardTitle: 'Untitled',

    // --- DIAGNOSTIC BADGES ---
    badgeContradiction: 'Contradiction',
    badgeContradictionTitle: 'Contradiction — conflicting testimonies about this entity',
    badgeBlindSpot: 'Blind Spot',
    badgeBlindSpotTitle: 'Blind Spot — self-assessed positively, perceived negatively by others',
    badgeImpostor: 'Impostor Gap',
    badgeImpostorTitle: 'Impostor Gap — self-assessed negatively, perceived positively by others',
    badgeCritical: 'Critical',
    badgeCriticalTitle: 'Critical Cognitive Load — majority of linked evidences are negative',

    // --- CORRELATION PREVIEW ---
    spofInfo: 'Single Point of Failure (SPOF): entity with high volume of negative evidence and presence across multiple teams. If this person leaves or stalls, the entire operation feels it.',
    spofDetectedSuffix: 'detected',
    directedContradictionsTitle: 'Directed Contradictions',
    directedContradictionsInfo: 'When A speaks about B with one sentiment and B speaks about A with the opposite sentiment. Indicates an asymmetric relationship: one side has a distorted perception or partial information about the other.',
    directedDetectedSuffix: 'detected',
    noneDetectedCross: 'None detected — insufficient cross-testimonies',
    speaksAbout: 'talks about',
    blindSpotPanelTitle: 'Blind Spot',
    blindSpotPanelInfo: "The person's own interview has a positive or neutral tone, but other members mention them with negative sentiment. They don't see the impact they have on others.",
    blindSpotDesc: 'Self-assessed positively, perceived negatively by others',
    noneDetectedM: 'None detected',
    externalNeg: 'external negative',
    impostorPanelTitle: 'Impostor Gap',
    impostorPanelInfo: "The person's own interview has a negative tone — they feel bad or overwhelmed — but others mention them positively. May indicate impostor syndrome or underestimation of their own value.",
    impostorDesc: 'Self-assessed negatively, perceived positively by others',
    externalPos: 'external positive',
    criticalLoadInfo: 'Entity with a majority of linked negative evidences. High cognitive load indicates this person or team is absorbing problems from other areas beyond their own.',
    criticalCountSuffix: 'critical',
    sentLabelPos: 'positive',
    sentLabelNeg: 'negative',
    sentLabelNeu: 'neutral',
    sevHigh: 'high',
    sevMedium: 'medium',
    sevLow: 'low',
    directedContradictionsCount: 'directed contradictions',
    perceptionGapsCount: 'gaps',
    interviewCoverageSuffix: '% coverage',

    // --- RENDERERS ---
    collapsedTeamLabel: 'Collapsed',
    evidenceSource: 'Source',

    // --- ERROR BOUNDARY ---
    errorUnexpected: 'An unexpected error occurred',
    errorBody: 'The physics engine encountered a critical inconsistency and had to stop to protect your data.',
    reloadSystem: 'Reload System',

    // --- AI PROMPT ---
    promptLanguage: 'Respond in English.',

    // --- MISC ---
    errorUnknownPipeline: 'Unknown error generating systemic synthesis.',
    demoTitle: 'Origo Demo',
    demoDescription: 'Structural diagnostic module.',
  },
} as const;

export type TranslationKey = keyof typeof translations.pt;

// --- MODULE-LEVEL LANG (for use outside React, e.g. services, class components) ---
let _currentLang: Language = 'pt';
export const setCurrentLang = (l: Language) => { _currentLang = l; };
export const tStatic = (key: TranslationKey): string => translations[_currentLang][key] as string;

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'pt',
  setLang: () => {},
  t: (key) => translations.pt[key],
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('pt');

  const setLang = (l: Language) => {
    setCurrentLang(l);
    setLangState(l);
  };

  const t = (key: TranslationKey): string => translations[lang][key] as string;
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
