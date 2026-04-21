import { CanvasItem } from './types';

// --- ORIGO DEMO DATA (reduced default board) ---
export const ORIGO_INITIAL_ITEMS: CanvasItem[] = [
  {
    id: 'team_eng_core',
    type: 'TEAM',
    x: -820,
    y: -180,
    width: 500,
    height: 300,
    zIndex: 1,
    isSelected: false,
    title: 'Engenharia Core',
    color: '#4f46e5',
    description: 'Backend, infra e APIs principais.'
  },
  {
    id: 'team_product',
    type: 'TEAM',
    x: 120,
    y: -180,
    width: 500,
    height: 300,
    zIndex: 1,
    isSelected: false,
    title: 'Produto & Design',
    color: '#8b5cf6',
    description: 'Gestao de produto, discovery e UX.'
  },
  {
    id: 'team_cs',
    type: 'TEAM',
    x: -820,
    y: 430,
    width: 500,
    height: 300,
    zIndex: 1,
    isSelected: false,
    title: 'Customer Success',
    color: '#10b981',
    description: 'Onboarding, suporte e retencao.'
  },
  {
    id: 'team_sales',
    type: 'TEAM',
    x: 120,
    y: 430,
    width: 500,
    height: 300,
    zIndex: 1,
    isSelected: false,
    title: 'Vendas (Sales)',
    color: '#f59e0b',
    description: 'Pipeline, fechamento e pressao comercial.'
  },

  // People - Engenharia Core
  {
    id: 'p_eng_1',
    type: 'PERSON',
    x: -840,
    y: -20,
    width: 280,
    height: 100,
    zIndex: 2,
    isSelected: false,
    title: 'Roberto Almeida',
    role: 'Tech Lead',
    color: '#3b82f6',
    teamId: 'team_eng_core'
  },
  {
    id: 'p_eng_2',
    type: 'PERSON',
    x: -690,
    y: -20,
    width: 280,
    height: 100,
    zIndex: 2,
    isSelected: false,
    title: 'Carla Dias',
    role: 'Senior Backend',
    color: '#3b82f6',
    teamId: 'team_eng_core'
  },
  {
    id: 'p_eng_5',
    type: 'PERSON',
    x: -840,
    y: 40,
    width: 280,
    height: 100,
    zIndex: 2,
    isSelected: false,
    title: 'Fernando Souza',
    role: 'DevOps Engineer',
    color: '#3b82f6',
    teamId: 'team_eng_core'
  },
  {
    id: 'p_eng_6',
    type: 'PERSON',
    x: -690,
    y: 40,
    width: 280,
    height: 100,
    zIndex: 2,
    isSelected: false,
    title: 'Amanda Lima',
    role: 'DBA',
    color: '#3b82f6',
    teamId: 'team_eng_core'
  },

  // People - Produto
  {
    id: 'p_prod_1',
    type: 'PERSON',
    x: 100,
    y: -20,
    width: 280,
    height: 100,
    zIndex: 2,
    isSelected: false,
    title: 'Camila Ribeiro',
    role: 'Head of Product',
    color: '#8b5cf6',
    teamId: 'team_product'
  },
  {
    id: 'p_prod_2',
    type: 'PERSON',
    x: 250,
    y: -20,
    width: 280,
    height: 100,
    zIndex: 2,
    isSelected: false,
    title: 'Rafael Castro',
    role: 'Product Manager',
    color: '#8b5cf6',
    teamId: 'team_product'
  },
  {
    id: 'p_prod_4',
    type: 'PERSON',
    x: 100,
    y: 40,
    width: 280,
    height: 100,
    zIndex: 2,
    isSelected: false,
    title: 'Joao Pedro',
    role: 'UX Researcher',
    color: '#8b5cf6',
    teamId: 'team_product'
  },

  // People - Customer Success
  {
    id: 'p_cs_1',
    type: 'PERSON',
    x: -840,
    y: 590,
    width: 280,
    height: 100,
    zIndex: 2,
    isSelected: false,
    title: 'Carolina Mendes',
    role: 'Head of CS',
    color: '#10b981',
    teamId: 'team_cs'
  },
  {
    id: 'p_cs_2',
    type: 'PERSON',
    x: -690,
    y: 590,
    width: 280,
    height: 100,
    zIndex: 2,
    isSelected: false,
    title: 'Bruno Carvalho',
    role: 'CSM Enterprise',
    color: '#10b981',
    teamId: 'team_cs'
  },
  {
    id: 'p_cs_3',
    type: 'PERSON',
    x: -840,
    y: 650,
    width: 280,
    height: 100,
    zIndex: 2,
    isSelected: false,
    title: 'Aline Freitas',
    role: 'CSM SMB',
    color: '#10b981',
    teamId: 'team_cs'
  },

  // People - Sales
  {
    id: 'p_sal_1',
    type: 'PERSON',
    x: 100,
    y: 590,
    width: 280,
    height: 100,
    zIndex: 2,
    isSelected: false,
    title: 'Rodrigo Machado',
    role: 'VP of Sales',
    color: '#f59e0b',
    teamId: 'team_sales'
  },
  {
    id: 'p_sal_2',
    type: 'PERSON',
    x: 250,
    y: 590,
    width: 280,
    height: 100,
    zIndex: 2,
    isSelected: false,
    title: 'Vanessa Moura',
    role: 'Account Executive',
    color: '#f59e0b',
    teamId: 'team_sales'
  },

  // Evidence - Engenharia Core
  {
    id: 'ev_rob_1',
    type: 'EVIDENCE',
    x: -860,
    y: 150,
    width: 200,
    height: 120,
    zIndex: 3,
    isSelected: false,
    title: 'Roberto Almeida - Eng Core',
    speakerId: 'p_eng_1',
    sentiment: 'negative',
    color: '#ef4444',
    linkedEntityIds: ['p_eng_1', 'team_eng_core', 'p_eng_5', 'p_eng_6', 'p_prod_2', 'p_cs_1'],
    content: `Entrevistador: Como esta sua rotina hoje?

Roberto: Eu virei ponto de entrada para tudo no Core. Se o Fernando precisa validar deploy, ele fala comigo. Se a Amanda precisa aprovar migration, ela fala comigo. Se o Rafael quer prazo de feature, ele fala comigo. Quando a Carolina escala bug de producao, tambem cai em mim.

Entrevistador: E isso afeta sua entrega?

Roberto: Totalmente. Eu passo o dia respondendo contexto e apagando incendio. O time fica dependente de mim para decidir, revisar e destravar. O problema nao e falta de gente boa. O problema e que quase tudo importante converge em uma pessoa so.`
  },
  {
    id: 'ev_carla_1',
    type: 'EVIDENCE',
    x: -740,
    y: 150,
    width: 200,
    height: 120,
    zIndex: 3,
    isSelected: false,
    title: 'Carla Dias - Senior Backend',
    speakerId: 'p_eng_2',
    sentiment: 'negative',
    color: '#ef4444',
    linkedEntityIds: ['p_eng_2', 'team_eng_core', 'p_eng_1', 'p_prod_2', 'team_product'],
    content: `Entrevistador: Voce consegue trabalhar com autonomia?

Carla: Tecnicamente sim. O gargalo aparece quando preciso de decisao de arquitetura ou validacao de escopo. A resposta quase sempre depende do Roberto. Enquanto espero, o Rafael continua cobrando prazo como se a fila nao existisse.

Entrevistador: Isso vira atraso visivel?

Carla: Sim. O backlog anda mais devagar do que parece porque parte do tempo e espera. Quando a dependencia principal demora, a estimativa estoura e o Produto perde confianca no Core.`
  },
  {
    id: 'ev_amanda_1',
    type: 'EVIDENCE',
    x: -620,
    y: 150,
    width: 200,
    height: 120,
    zIndex: 3,
    isSelected: false,
    title: 'Amanda Lima - DBA',
    speakerId: 'p_eng_6',
    sentiment: 'negative',
    color: '#ef4444',
    linkedEntityIds: ['p_eng_6', 'team_eng_core', 'p_eng_5', 'p_eng_1'],
    content: `Entrevistador: Como esta o processo de migrations?

Amanda: Fragil. Eu sou a unica que conhece o banco em profundidade e o Fernando depende de mim para agendar mudanca de schema com seguranca. Isso funciona enquanto eu estou online. Se eu saio do circuito, a release trava.

Entrevistador: E isso ja foi enderecado?

Amanda: Foi reconhecido, mas nunca priorizado. Sempre existe algo mais urgente do que documentar ou treinar outra pessoa. Entao o risco continua crescendo em silencio.`
  },
  {
    id: 'ev_fernando_1',
    type: 'EVIDENCE',
    x: -860,
    y: 230,
    width: 200,
    height: 120,
    zIndex: 3,
    isSelected: false,
    title: 'Fernando Souza - DevOps',
    speakerId: 'p_eng_5',
    sentiment: 'negative',
    color: '#ef4444',
    linkedEntityIds: ['p_eng_5', 'team_eng_core', 'p_eng_1', 'p_eng_6'],
    content: `Entrevistador: O que mais pesa no seu dia a dia?

Fernando: Infra, acessos, ambiente, deploy e suporte operacional. Muita coisa depende de conhecimento que ficou concentrado. Quando a Amanda precisa de janela para migration ou o Roberto precisa de alguma mudanca rapida de ambiente, eu viro gargalo junto com eles.

Entrevistador: Qual e o risco real?

Fernando: O Core ficou resiliente no discurso, mas nao na operacao. Tem atividade critica demais passando por poucas pessoas.`
  },

  // Evidence - Produto
  {
    id: 'ev_camila_1',
    type: 'EVIDENCE',
    x: 80,
    y: 150,
    width: 200,
    height: 120,
    zIndex: 3,
    isSelected: false,
    title: 'Camila Ribeiro - Head of Product',
    speakerId: 'p_prod_1',
    sentiment: 'neutral',
    color: '#f59e0b',
    linkedEntityIds: ['p_prod_1', 'team_product', 'team_sales', 'team_cs', 'p_sal_1', 'p_cs_1'],
    content: `Entrevistador: Como e a relacao do Produto com as outras areas?

Camila: O Produto vive no meio da pressao. O Rodrigo traz demanda de deal importante com urgencia maxima. A Carolina traz feedback de cliente quando o problema ja esta estourado. O time tenta equilibrar estrategia com reacao.

Entrevistador: Qual e a principal dor?

Camila: Quase sempre decidimos no tempo da pressao, nao no tempo do aprendizado. Isso empurra discovery e qualidade para depois.`
  },
  {
    id: 'ev_rafael_1',
    type: 'EVIDENCE',
    x: 200,
    y: 150,
    width: 200,
    height: 120,
    zIndex: 3,
    isSelected: false,
    title: 'Rafael Castro - Product Manager',
    speakerId: 'p_prod_2',
    sentiment: 'negative',
    color: '#ef4444',
    linkedEntityIds: ['p_prod_2', 'team_product', 'team_eng_core', 'p_sal_1', 'p_eng_1', 'p_eng_2', 'p_prod_1'],
    content: `Entrevistador: Como voce gerencia o backlog?

Rafael: Com muita interrupcao. O Rodrigo muda prioridade quando aparece oportunidade comercial e eu perco a chance de proteger o fluxo do time. Quando vou para o Core negociar prazo, o Roberto e a Carla sao transparentes, mas a capacidade real ja esta no limite.

Entrevistador: O que isso gera?

Rafael: Perda de confianca nas estimativas e um backlog sempre reativo. O time so corre atras do proximo incendio.`
  },
  {
    id: 'ev_joao_1',
    type: 'EVIDENCE',
    x: 80,
    y: 230,
    width: 200,
    height: 120,
    zIndex: 3,
    isSelected: false,
    title: 'Joao Pedro - UX Researcher',
    speakerId: 'p_prod_4',
    sentiment: 'negative',
    color: '#ef4444',
    linkedEntityIds: ['p_prod_4', 'team_product', 'team_cs', 'p_prod_1', 'p_prod_2', 'p_cs_3'],
    content: `Entrevistador: O que suas pesquisas estao mostrando?

Joao Pedro: O onboarding esta derrubando a ativacao e isso aparece direto nas falas da Aline. Eu entreguei recomendacoes claras, mas a melhoria perde para feature prometida em venda. O aprendizado existe, o problema e que ele nao entra na fila certa.

Entrevistador: Como voce enxerga o impacto?

Joao Pedro: O custo aparece em churn no SMB, desgaste no CS e aquisicao mais cara. E um problema de produto que vira problema sistemico.`
  },

  // Evidence - Customer Success
  {
    id: 'ev_carolina_1',
    type: 'EVIDENCE',
    x: -860,
    y: 800,
    width: 200,
    height: 120,
    zIndex: 3,
    isSelected: false,
    title: 'Carolina Mendes - Head of CS',
    speakerId: 'p_cs_1',
    sentiment: 'negative',
    color: '#ef4444',
    linkedEntityIds: ['p_cs_1', 'team_cs', 'team_product', 'team_sales', 'team_eng_core', 'p_eng_2', 'p_prod_2', 'p_sal_2'],
    content: `Entrevistador: Quais problemas mais chegam no CS?

Carolina: Dois tipos. Bug em producao e promessa comercial nao cumprida. Quando a Vanessa fecha conta com expectativa alta, o cliente cai no nosso colo meses depois cobrando algo que o Produto ainda nao entregou. Quando aparece bug, dependemos do Core responder rapido.

Entrevistador: O que isso causa?

Carolina: O CS vira amortecedor de falha estrutural. A gente segura a relacao, mas nao resolve a origem do problema.`
  },
  {
    id: 'ev_bruno_1',
    type: 'EVIDENCE',
    x: -740,
    y: 800,
    width: 200,
    height: 120,
    zIndex: 3,
    isSelected: false,
    title: 'Bruno Carvalho - CSM Enterprise',
    speakerId: 'p_cs_2',
    sentiment: 'negative',
    color: '#ef4444',
    linkedEntityIds: ['p_cs_2', 'team_cs', 'team_sales', 'team_product', 'p_sal_1', 'p_prod_2'],
    content: `Entrevistador: Como estao suas contas hoje?

Bruno: No limite. Tenho mais contas do que deveria e pouca margem para ser proativo. Quando um cliente descobre que a feature prometida pelo Sales ainda esta no roadmap, eu entro em modo de contencao.

Entrevistador: E a resposta interna?

Bruno: Eu escalo para o Rafael, que diz que esta na fila, e para o Rodrigo, que diz que a pressao de mercado exigiu a promessa. O cliente nao aceita esse circuito.`
  },
  {
    id: 'ev_aline_1',
    type: 'EVIDENCE',
    x: -620,
    y: 800,
    width: 200,
    height: 120,
    zIndex: 3,
    isSelected: false,
    title: 'Aline Freitas - CSM SMB',
    speakerId: 'p_cs_3',
    sentiment: 'negative',
    color: '#ef4444',
    linkedEntityIds: ['p_cs_3', 'team_cs', 'team_product', 'p_prod_4', 'p_prod_2', 'p_cs_2'],
    content: `Entrevistador: O que mais explica o churn no SMB?

Aline: Onboarding ruim. O cliente chega, nao entende a jornada inicial e some cedo. O Joao Pedro mapeou isso com profundidade, mas o Produto continua puxado por urgencia de venda e backlog comercial.

Entrevistador: E no dia a dia do time?

Aline: Eu fico reativa. Sem melhoria de onboarding e sem tempo para acompanhar cada conta, o risco de churn sempre chega antes de qualquer acao preventiva.`
  },

  // Evidence - Sales
  {
    id: 'ev_rodrigo_1',
    type: 'EVIDENCE',
    x: 80,
    y: 800,
    width: 200,
    height: 120,
    zIndex: 3,
    isSelected: false,
    title: 'Rodrigo Machado - VP Sales',
    speakerId: 'p_sal_1',
    sentiment: 'positive',
    color: '#10b981',
    linkedEntityIds: ['p_sal_1', 'team_sales', 'team_product', 'team_cs', 'p_prod_1', 'p_cs_2'],
    content: `Entrevistador: Como voce enxerga o roadmap hoje?

Rodrigo: O time de Produto e competente, mas o mercado pressiona mais rapido do que a empresa entrega. Quando eu forco prioridade, nao e por prazer. E porque sem isso eu perco deal agora.

Entrevistador: E o pos-venda?

Rodrigo: O Bruno segura situacoes dificeis muito bem. Mas o CS esta sobrecarregado e isso aparece quando uma promessa atrasa demais.`
  },
  {
    id: 'ev_vanessa_1',
    type: 'EVIDENCE',
    x: 200,
    y: 800,
    width: 200,
    height: 120,
    zIndex: 3,
    isSelected: false,
    title: 'Vanessa Moura - Account Executive',
    speakerId: 'p_sal_2',
    sentiment: 'neutral',
    color: '#f59e0b',
    linkedEntityIds: ['p_sal_2', 'team_sales', 'team_product', 'team_cs', 'p_sal_1', 'p_prod_2', 'p_cs_1', 'p_cs_2'],
    content: `Entrevistador: O que mais te incomoda na venda?

Vanessa: Em alguns deals eu preciso vender expectativa. Nao e mentira, mas e uma traducao otimista do roadmap. Quando a entrega atrasa, a Carolina e o Bruno recebem a frustracao que eu ajudei a criar.

Entrevistador: E isso ja foi discutido?

Vanessa: Sim, mas a pressao de meta empurra a conversa para frente de novo. Enquanto o Produto nao conseguir dar previsibilidade, o discurso comercial continua tensionado.`
  },

  // Helper note
  {
    id: 'note_origo',
    type: 'NOTE',
    x: -270,
    y: -410,
    width: 360,
    height: 170,
    zIndex: 5,
    isSelected: false,
    title: 'Como usar este board',
    content: 'Este board demo foi reduzido para mostrar a historia central do Origo.\n\nSales pressiona o Produto, o Produto empurra o Core, o Core vira gargalo e o Customer Success absorve churn, bug e promessa nao cumprida.\n\nClique em uma evidencia para ver quem falou e quais pessoas ou equipes foram mencionadas.',
    color: '#27272a'
  }
];

export const COLORS = {
  bg: '#09090b',
  surface: '#18181b',
  border: '#27272a',
  accent: '#3f3f46',
};
