// Script: re-run autoLinkEntities on all evidences + compute clean layout
// Run with: node scripts/rebuild_constants.mjs

// ---- autoLinkEntities (copied from utils/autoLinker.ts) ----
function autoLinkEntities(content, items, speakerId) {
  const entities = items.filter(i => i.type === 'TEAM' || i.type === 'PERSON');
  const contentLower = content.toLowerCase();
  const linked = new Set();
  if (speakerId) linked.add(speakerId);
  entities.forEach(entity => {
    if (!entity.title) return;
    const titleLower = entity.title.toLowerCase().trim();
    const nameParts = titleLower.split(/\s+/).filter(p => p.length > 2);
    if (contentLower.includes(titleLower)) { linked.add(entity.id); return; }
    if (entity.type === 'PERSON' && nameParts.length > 1) {
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      if ((firstName.length >= 4 && contentLower.includes(firstName)) ||
          (lastName.length >= 4 && contentLower.includes(lastName))) {
        linked.add(entity.id); return;
      }
    }
    if (entity.type === 'TEAM') {
      const matched = nameParts.some(part => part.length >= 4 && contentLower.includes(part));
      if (matched) linked.add(entity.id);
    }
  });
  return Array.from(linked);
}

// ---- TEAMS ----
const teams = [
  { id: 'team_eng_core',   type: 'TEAM', title: 'Engenharia Core',    color: '#4f46e5' },
  { id: 'team_eng_mobile', type: 'TEAM', title: 'Engenharia Mobile',   color: '#0ea5e9' },
  { id: 'team_product',    type: 'TEAM', title: 'Produto & Design',    color: '#8b5cf6' },
  { id: 'team_marketing',  type: 'TEAM', title: 'Marketing & Growth',  color: '#ec4899' },
  { id: 'team_sales',      type: 'TEAM', title: 'Vendas (Sales)',       color: '#f59e0b' },
  { id: 'team_cs',         type: 'TEAM', title: 'Customer Success',    color: '#10b981' },
  { id: 'team_ops',        type: 'TEAM', title: 'Operações & RH',      color: '#64748b' },
];

// ---- PEOPLE ----
const people = [
  { id: 'p_eng_1', type: 'PERSON', title: 'Roberto Almeida', role: 'Tech Lead',          teamId: 'team_eng_core' },
  { id: 'p_eng_2', type: 'PERSON', title: 'Carla Dias',       role: 'Senior Backend',    teamId: 'team_eng_core' },
  { id: 'p_eng_3', type: 'PERSON', title: 'Marcos Silva',     role: 'Backend Dev',       teamId: 'team_eng_core' },
  { id: 'p_eng_4', type: 'PERSON', title: 'Juliana Costa',    role: 'Backend Dev',       teamId: 'team_eng_core' },
  { id: 'p_eng_5', type: 'PERSON', title: 'Fernando Souza',   role: 'DevOps Engineer',   teamId: 'team_eng_core' },
  { id: 'p_eng_6', type: 'PERSON', title: 'Amanda Lima',      role: 'DBA',               teamId: 'team_eng_core' },
  { id: 'p_eng_7', type: 'PERSON', title: 'Lucas Pereira',    role: 'Junior Backend',    teamId: 'team_eng_core' },
  { id: 'p_eng_8', type: 'PERSON', title: 'Sofia Martins',    role: 'QA Engineer',       teamId: 'team_eng_core' },
  { id: 'p_mob_1', type: 'PERSON', title: 'Diego Fernandes',  role: 'Mobile Lead',       teamId: 'team_eng_mobile' },
  { id: 'p_mob_2', type: 'PERSON', title: 'Beatriz Rocha',    role: 'iOS Developer',     teamId: 'team_eng_mobile' },
  { id: 'p_mob_3', type: 'PERSON', title: 'Thiago Gomes',     role: 'Android Developer', teamId: 'team_eng_mobile' },
  { id: 'p_mob_4', type: 'PERSON', title: 'Larissa Mendes',   role: 'Flutter Developer', teamId: 'team_eng_mobile' },
  { id: 'p_mob_5', type: 'PERSON', title: 'Pedro Alves',      role: 'QA Mobile',         teamId: 'team_eng_mobile' },
  { id: 'p_prod_1', type: 'PERSON', title: 'Camila Ribeiro',  role: 'Head of Product',   teamId: 'team_product' },
  { id: 'p_prod_2', type: 'PERSON', title: 'Rafael Castro',   role: 'Product Manager',   teamId: 'team_product' },
  { id: 'p_prod_3', type: 'PERSON', title: 'Mariana Luz',     role: 'Lead Designer',     teamId: 'team_product' },
  { id: 'p_prod_4', type: 'PERSON', title: 'João Pedro',      role: 'UX Researcher',     teamId: 'team_product' },
  { id: 'p_prod_5', type: 'PERSON', title: 'Letícia Faria',   role: 'UI Designer',       teamId: 'team_product' },
  { id: 'p_mkt_1',  type: 'PERSON', title: 'Gabriel Nogueira',role: 'CMO',               teamId: 'team_marketing' },
  { id: 'p_mkt_2',  type: 'PERSON', title: 'Isabela Pinto',   role: 'Growth Hacker',     teamId: 'team_marketing' },
  { id: 'p_mkt_3',  type: 'PERSON', title: 'Felipe Barros',   role: 'Content Strategist',teamId: 'team_marketing' },
  { id: 'p_mkt_4',  type: 'PERSON', title: 'Natália Correia', role: 'Performance Ads',   teamId: 'team_marketing' },
  { id: 'p_sal_1',  type: 'PERSON', title: 'Rodrigo Machado', role: 'VP of Sales',       teamId: 'team_sales' },
  { id: 'p_sal_2',  type: 'PERSON', title: 'Vanessa Moura',   role: 'Account Executive', teamId: 'team_sales' },
  { id: 'p_sal_3',  type: 'PERSON', title: 'Eduardo Lima',    role: 'Account Executive', teamId: 'team_sales' },
  { id: 'p_sal_4',  type: 'PERSON', title: 'Patrícia Silva',  role: 'SDR',               teamId: 'team_sales' },
  { id: 'p_sal_5',  type: 'PERSON', title: 'André Santos',    role: 'SDR',               teamId: 'team_sales' },
  { id: 'p_cs_1',   type: 'PERSON', title: 'Carolina Mendes', role: 'Head of CS',        teamId: 'team_cs' },
  { id: 'p_cs_2',   type: 'PERSON', title: 'Bruno Carvalho',  role: 'CSM Enterprise',    teamId: 'team_cs' },
  { id: 'p_cs_3',   type: 'PERSON', title: 'Aline Freitas',   role: 'CSM SMB',           teamId: 'team_cs' },
  { id: 'p_cs_4',   type: 'PERSON', title: 'Marcelo Vieira',  role: 'Support Analyst',   teamId: 'team_cs' },
  { id: 'p_ops_1',  type: 'PERSON', title: 'Ricardo Nunes',   role: 'COO',               teamId: 'team_ops' },
  { id: 'p_ops_2',  type: 'PERSON', title: 'Fernanda Borges', role: 'HR Manager',        teamId: 'team_ops' },
  { id: 'p_ops_3',  type: 'PERSON', title: 'Tiago Monteiro',  role: 'Tech Recruiter',    teamId: 'team_ops' },
  { id: 'p_ops_4',  type: 'PERSON', title: 'Cláudia Ramos',   role: 'Financial Analyst', teamId: 'team_ops' },
];

const allItems = [...teams, ...people];

// ---- EVIDENCES (content only — positions will be computed below) ----
const evidences = [
  { id: 'ev_rob_1',      speakerId: 'p_eng_1',  sentiment: 'negative', title: 'Roberto Almeida — Eng Core',
    content: `Entrevistador: Como está sendo sua rotina de trabalho ultimamente?\n\nRoberto: Honestamente? Pesada. Eu sou o ponto de entrada pra praticamente tudo no backend. Se o Fernando tem dúvida sobre infra, vem falar comigo. Se a Amanda precisa validar uma migration, vem falar comigo. Se o Diego do Mobile precisa entender um contrato de API, vem falar comigo.\n\nEntrevistador: E você consegue dar atenção a tudo isso?\n\nRoberto: Não. É impossível. Começo o dia com seis Slacks não respondidos, duas pull requests esperando review meu e uma reunião de planejamento. Acabo o dia sem ter escrito uma linha de código. Isso vira ciclo: eu fico de gargalo, o time trava, e aí fico mais sobrecarregado tentando destravar tudo ao mesmo tempo.` },
  { id: 'ev_carla_1',    speakerId: 'p_eng_2',  sentiment: 'negative', title: 'Carla Dias — Eng Core',
    content: `Entrevistador: Você consegue trabalhar de forma autônoma no dia a dia?\n\nCarla: Depende do que você entende por autônoma. Eu sei o que preciso fazer tecnicamente. Mas quando preciso de uma decisão de arquitetura ou validação de escopo, fico esperando o Roberto. E ele está sempre em outra coisa.\n\nEntrevistador: Isso impacta sua entrega?\n\nCarla: Com certeza. Tive uma tarefa semana passada bloqueada dois dias esperando um review dele. Enquanto isso, o Rafael do Produto apareceu perguntando por que o backend estava atrasado. É frustrante porque o problema não é capacidade técnica, é dependência de uma pessoa só.` },
  { id: 'ev_amanda_1',   speakerId: 'p_eng_6',  sentiment: 'negative', title: 'Amanda Lima — DBA',
    content: `Entrevistador: Como está o processo de migrations aqui?\n\nAmanda: Complicado. Toda migration que vai pra produção passa por mim, porque sou a única que conhece bem o banco. Isso começou porque não tinha mais ninguém, mas virou padrão. Agora o Fernando precisa de mim pra aprovar qualquer mudança de schema antes do deploy.\n\nEntrevistador: Isso te sobrecarrega?\n\nAmanda: Muito. E me preocupa mais do que me sobrecarrega. Se eu sair de férias, o time para. Se eu ficar doente, o time para. Já falei pro Roberto, ele concordou, mas nunca paramos pra documentar nada direito porque sempre tem incêndio pra apagar.` },
  { id: 'ev_diego_1',    speakerId: 'p_mob_1',  sentiment: 'negative', title: 'Diego Fernandes — Mobile Lead',
    content: `Entrevistador: Quais são os principais bloqueios que o time Mobile enfrenta?\n\nDiego: O maior é a dependência do pipeline de deploy. A gente depende do Fernando pra liberar qualquer build pra produção. Quando ele está ocupado com outras coisas do Core, ficamos parados. Já aconteceu de a Beatriz ter corrigido um bug crítico no iOS e o build ficou dois dias na fila.\n\nEntrevistador: E a comunicação com o backend?\n\nDiego: É boa quando o Roberto está disponível, que é raramente. Acabamos indo direto nos desenvolvedores, o que não é errado, mas às vezes recebemos informações diferentes sobre o mesmo endpoint. Falta um ponto de entrada claro.` },
  { id: 'ev_beatriz_1',  speakerId: 'p_mob_2',  sentiment: 'negative', title: 'Beatriz Rocha — iOS Dev',
    content: `Entrevistador: Como foi sua experiência com o bug de login recente?\n\nBeatriz: Eu identifiquei o problema em 20 minutos. Era uma mudança silenciosa na resposta de autenticação do backend. Mas aí começou a novela: precisava confirmar com o backend quem havia feito a alteração, o Diego tentou falar com o Roberto que estava em reuniões o dia todo, conseguimos chegar na Carla que confirmou que foi uma refatoração interna.\n\nEntrevistador: Levou quanto tempo pra resolver?\n\nBeatriz: Três dias até o fix chegar em produção. A correção em si levou uma hora. O resto foi espera: espera por resposta, espera pelo build, espera pela aprovação. É o tipo de coisa que desgasta muito.` },
  { id: 'ev_camila_1',   speakerId: 'p_prod_1', sentiment: 'neutral',  title: 'Camila Ribeiro — Head of Product',
    content: `Entrevistador: Como é a relação entre Produto e as outras áreas?\n\nCamila: A pressão maior vem do Rodrigo, do Sales. Toda semana tem uma feature nova que "o maior cliente pediu" e que "precisa entrar no próximo sprint". Eu entendo a lógica comercial, mas o time não tem como absorver isso sem sacrificar outras entregas.\n\nEntrevistador: E com Customer Success?\n\nCamila: Melhor. A Carolina é muito organizada, traz feedbacks estruturados. O problema é que quando algo chega no CS já virou problema de cliente. Eu preferia receber o sinal mais cedo, mas não temos esse canal formal ainda. É muito no boca a boca.` },
  { id: 'ev_rafael_1',   speakerId: 'p_prod_2', sentiment: 'negative', title: 'Rafael Castro — Product Manager',
    content: `Entrevistador: Como você gerencia o backlog com pressões externas?\n\nRafael: É o maior desafio. O Rodrigo entra em toda revisão de sprint com novas prioridades, e quando eu digo que algo vai atrasar, ele vai direto falar com a Camila ou com o CEO. Aí vira uma questão política que desvia do processo.\n\nEntrevistador: E a capacidade do time de Engenharia?\n\nRafael: O Roberto é honesto quando tem ou não tem capacidade, mas ele mesmo está travado em tantas coisas que às vezes a estimativa dele não reflete a realidade. Uma tarefa que ele diz "dois dias" vira uma semana porque ele precisou pausar pra apagar outra coisa. Eu perdi a confiança nas estimativas.` },
  { id: 'ev_gabriel_1',  speakerId: 'p_mkt_1',  sentiment: 'negative', title: 'Gabriel Nogueira — CMO',
    content: `Entrevistador: Como o Marketing trabalha junto com Produto?\n\nGabriel: Na teoria bem, na prática tem atrito. Toda campanha de lançamento depende de uma data de entrega que o Produto define. Quando a data escorrega, a gente já investiu em criativo, mídia, evento. O prejuízo é nosso e o Produto não vê esse custo.\n\nEntrevistador: Tem algum exemplo recente?\n\nGabriel: O lançamento do módulo de relatórios. Prometido para fevereiro, saiu em abril. Já tínhamos campanha de email, posts programados, parceria com influenciador paga. Quando falei com a Camila, ela disse que o atraso foi porque o Rodrigo pediu uma feature diferente em cima da hora. Todo mundo joga a culpa em alguém.` },
  { id: 'ev_rodrigo_1',  speakerId: 'p_sal_1',  sentiment: 'positive', title: 'Rodrigo Machado — VP Sales',
    content: `Entrevistador: Como você avalia a execução do roadmap de produto?\n\nRodrigo: No geral, boa. A Camila é competente e o time entrega. Minha frustração é com a velocidade. A gente perde negócio porque o concorrente tem uma feature que prometemos pra seis meses. Não é reclamação do produto, é pressão de mercado mesmo.\n\nEntrevistador: E o suporte pós-venda, como está?\n\nRodrigo: O Bruno tem feito um trabalho excelente com as contas Enterprise. Ele segurou algumas situações que poderiam ter virado churn. Mas o time de CS precisa de mais pessoas. Hoje o Bruno carrega mais conta do que deveria pra um CSM sozinho.` },
  { id: 'ev_carolina_1', speakerId: 'p_cs_1',   sentiment: 'negative', title: 'Carolina Mendes — Head of CS',
    content: `Entrevistador: Quais são os principais problemas que chegam no Customer Success?\n\nCarolina: Dois tipos: bugs que impactam cliente em produção, e features prometidas pelo Sales que o produto não tem. Os bugs eu consigo contornar com suporte, mas as features prometidas são um problema sério. A Vanessa fecha contrato com promessa de entrega em 90 dias e seis meses depois o cliente ainda está cobrando.\n\nEntrevistador: Como vocês lidam com isso internamente?\n\nCarolina: Levo pro Rafael do Produto, ele reconhece o problema, mas diz que está na fila. O cliente não aceita "na fila". Já perdi duas contas por isso. Sinto que Sales e CS vivem em mundos paralelos, sem alinhamento real do que pode ser prometido.` },
  { id: 'ev_bruno_1',    speakerId: 'p_cs_2',   sentiment: 'negative', title: 'Bruno Carvalho — CSM Enterprise',
    content: `Entrevistador: Como está a situação das suas contas hoje?\n\nBruno: Tenho 14 contas Enterprise ativas. O número recomendado pra um CSM é 8, talvez 10. Eu funciono, mas no limite. Não tenho tempo de fazer check-ins proativos, só consigo ser reativo quando o cliente reclama.\n\nEntrevistador: Há alguma conta em risco agora?\n\nBruno: Pelo menos três. Uma delas está insatisfeita porque uma integração que o Rodrigo prometeu em dezembro ainda não saiu. Tentei escalar pro Rafael, que disse que está no roadmap do Q3. O cliente não vai esperar até o Q3. Ele já pediu proposta pra um concorrente.` },
  { id: 'ev_fernanda_1', speakerId: 'p_ops_2',  sentiment: 'negative', title: 'Fernanda Borges — HR Manager',
    content: `Entrevistador: Como está o clima no time de Engenharia, do ponto de vista de RH?\n\nFernanda: Preocupante. Tivemos duas saídas no último mês, ambas do Core. Um dos dois me disse na entrevista de desligamento que se sentia invisível, que todo o reconhecimento ia pro Roberto e os outros eram executores. O outro falou em sobrecarga.\n\nEntrevistador: Existe algum sinal que você monitora internamente?\n\nFernanda: Uso análise de eNPS trimestral. O score de Engenharia caiu de 42 para 28 neste ciclo. É o pior do histórico. Conversei com o Ricardo, ele reconhece o problema mas diz que não é o momento de contratar, por conta do orçamento. Estamos com time menor, mais sobrecarregado, e score caindo.` },
  { id: 'ev_fernando_1', speakerId: 'p_eng_5',  sentiment: 'negative', title: 'Fernando Souza — DevOps',
    content: `Entrevistador: Me conta como é o seu dia a dia no time de Infra.\n\nFernando: Infra é uma área de um só. Eu. Quando entrei há dois anos, éramos dois: eu e o Paulo, que saiu em março do ano passado. Depois que ele foi embora, absorvi tudo. Nunca foi contratado um substituto.\n\nEntrevistador: E como você gerencia esse volume?\n\nFernando: Com muito café e muito Slack silenciado. Tenho acesso root em tudo: servidores, pipeline de CI/CD, ambientes de staging e produção. Ninguém mais tem essa configuração. Já levantei isso pro Roberto três vezes.\n\nEntrevistador: O que o Roberto disse?\n\nFernando: Que concorda, que vamos documentar, que vamos treinar alguém. Aí aparece outra coisa urgente e vai pra gaveta. Mês passado fiquei doente três dias. Foram três dias com o time Mobile esperando build, o Diego me mandando mensagem no celular pessoal porque não sabia quem mais acionar.\n\nEntrevistador: Além do pipeline do Mobile, o que mais passa por você?\n\nFernando: Monitoramento de infra, rotações de chave de API, manutenção dos ambientes, suporte quando cai algo em produção. Toda vez que a Amanda precisa fazer uma migration, ela pede pra mim agendar a janela. A gente funciona em simbiose, mas qualquer um dos dois que sair vai travar metade da operação.\n\nEntrevistador: Você tem medo de sair?\n\nFernando: Medo não, mas culpa. Sinto que não posso sair porque ninguém sabe fazer o que eu faço. Isso não é poder, é uma armadilha.` },
  { id: 'ev_marcos_1',   speakerId: 'p_eng_3',  sentiment: 'negative', title: 'Marcos Silva — Backend Dev',
    content: `Entrevistador: Como está sua experiência no time de Engenharia Core?\n\nMarcos: Tecnicamente é interessante, mas operacionalmente é frustrante. Tenho dois anos de experiência, sei o que estou fazendo, mas metade do tempo é gasto esperando. Esperando review do Roberto, aprovação de ambiente do Fernando, clareza de escopo do Rafael.\n\nEntrevistador: O review do Roberto costuma demorar quanto?\n\nMarcos: No mínimo dois dias, já cheguei a esperar cinco. Enquanto isso fico em idle. Já tentei usar o tempo pra fazer outras tarefas, mas aí começo várias e não termino nenhuma — e parece que não entrego nada.\n\nEntrevistador: E o débito técnico?\n\nMarcos: Muito visível. Tem partes do sistema que só o Roberto toca porque o código é antigo e não documentado. A Juliana e eu já mapeamos um módulo de processamento de pagamentos que é uma caixa preta completa. Vai dar problema um dia. Mas não tem espaço pra refatorar.\n\nEntrevistador: Você levantou isso?\n\nMarcos: Levantei. O Roberto diz que sabe, que vai organizar uma sprint de débito técnico. Há seis meses isso está sendo prometido. O Rafael diz que débito técnico não cabe no roadmap comercial. Fica o impasse. O código vai ficando mais difícil de mexer e as estimativas cada vez mais erradas.` },
  { id: 'ev_juliana_1',  speakerId: 'p_eng_4',  sentiment: 'negative', title: 'Juliana Costa — Backend Dev',
    content: `Entrevistador: Quanto tempo você está no time?\n\nJuliana: Oito meses. Vim de uma startup maior onde tínhamos processos maduros. Aqui foi um choque de cultura no começo.\n\nEntrevistador: Em que sentido?\n\nJuliana: Lá tínhamos documentação de API, ADRs pras decisões de arquitetura, onboarding estruturado. Aqui aprendi lendo código e perguntando pro Marcos, que também estava aprendendo. O Roberto tentou me ajudar nos primeiros dias, mas literalmente não tinha tempo. Uma vez fiquei 40 minutos esperando resposta simples no Slack porque ele estava em reuniões.\n\nEntrevistador: E a qualidade do código?\n\nJuliana: Tem partes boas e partes assustadoras. O módulo de cobrança recorrente tem comentários com "TODO: refatorar isso" datados de 2022. A Sofia me disse que não consegue testar aquele módulo porque não tem como montar um ambiente isolado pra ele.\n\nEntrevistador: Você está pensando em ficar?\n\nJuliana: Estou avaliando. Recebi um contato semana passada — não vou mentir. O trabalho é desafiador de um jeito bom. Mas o ambiente de fricção constante e a falta de perspectiva de melhora me preocupam muito. Já comentei com a Fernanda do RH, ela disse que sabe, mas que contratar é decisão do Ricardo.` },
  { id: 'ev_lucas_1',    speakerId: 'p_eng_7',  sentiment: 'neutral',  title: 'Lucas Pereira — Junior Backend',
    content: `Entrevistador: Como é ser desenvolvedor júnior aqui?\n\nLucas: Intenso. Aprendo muito porque o problema é complexo, mas aprendo sozinho na maioria das vezes. Não tem mentoria formal. No meu primeiro mês, meu onboarding foi basicamente "lê o repositório e vai perguntando".\n\nEntrevistador: E você conseguia perguntar?\n\nLucas: Tentava. O Roberto disse que podia mandar mensagem sempre, mas ele demorava horas pra responder e às vezes esquecia. Fui me aproximando mais do Marcos e da Juliana, que são mais acessíveis — mas também têm suas próprias filas.\n\nEntrevistador: Algo que te surpreendeu negativamente?\n\nLucas: A pressão. Sou júnior, mas minha fila às vezes é igual à de um pleno. Acho que é porque o time está curto. A Sofia já me pediu pra fazer review de código, sendo que ela é QA e eu sou júnior. A gente faz o que pode com o que tem.\n\nEntrevistador: Você se sente reconhecido?\n\nLucas: Parte do time, sim. Reconhecido, não tanto. O Roberto é quem aparece nas reuniões com o Produto e com o CEO. O resto do time é invisível pra liderança. Um dos caras que saiu recentemente me disse exatamente isso antes de ir embora: que se sentia invisível.` },
  { id: 'ev_sofia_1',    speakerId: 'p_eng_8',  sentiment: 'negative', title: 'Sofia Martins — QA Engineer',
    content: `Entrevistador: Como funciona o processo de QA aqui?\n\nSofia: Na teoria, toda PR passa por mim antes de ir pra staging. Na prática, quando tem urgência — que é quase sempre — a PR vai direto sem QA formal. O Roberto libera, o Fernando faz o deploy, e eu fico sabendo quando o bug chega no cliente.\n\nEntrevistador: Isso acontece com frequência?\n\nSofia: Nos últimos dois meses, em pelo menos 60% das entregas. O custo é que o Marcelo, lá no CS, recebe o ticket, escala pra mim, eu investigo, e às vezes descubro que é um bug que eu teria pego em cinco minutos antes do deploy.\n\nEntrevistador: Você levantou formalmente?\n\nSofia: Levantei pro Roberto. Ele concordou. Mas ele mesmo é quem bypassa o processo quando está na pressão. O Diego do Mobile é mais disciplinado — exige que o Pedro faça QA completo antes de qualquer release. Aprendo mais com o Diego do que com meu próprio tech lead, o que é estranho.\n\nEntrevistador: Existe algum bug recorrente que te preocupa?\n\nSofia: O módulo de relatórios financeiros. Toda vez que mexem em cobrança, aparece um edge case nos relatórios. Documentei três vezes. O Marcos sabe, a Juliana sabe, o Roberto sabe. Mas ninguém tem tempo de resolver a causa raiz porque sempre tem outra coisa mais urgente.` },
  { id: 'ev_thiago_1',   speakerId: 'p_mob_3',  sentiment: 'neutral',  title: 'Thiago Gomes — Android Dev',
    content: `Entrevistador: Me conta sobre o processo de desenvolvimento no time Mobile.\n\nThiago: É um time pequeno e dedicado. O Diego dá muita liberdade pra trabalhar. Meu maior atrito não é interno — é dependência do pipeline do Fernando pra qualquer deploy.\n\nEntrevistador: Como isso te impacta?\n\nThiago: Tenho um feature branch pronto pra ir pra produção faz quatro dias. Build passando em todos os testes. Mas estou esperando o Fernando ter uma janela livre pra configurar o pipeline de release do Android. O da Beatriz, pra iOS, já está configurado há meses.\n\nEntrevistador: Por que a diferença?\n\nThiago: Porque o iOS virou prioridade antes. A Beatriz é mais assertiva em cobrar. Eu fui mais paciente e isso me custou semanas.\n\nEntrevistador: E a questão do Flutter?\n\nThiago: É ponto de tensão. O Diego quer migrar tudo pro Flutter pra ter uma codebase só. Entendo a lógica, mas acho que Flutter tem limitações pra o que fazemos no Android nativo. A Larissa defende muito porque é a especialidade dela. Enquanto essa decisão fica em aberto, fica difícil planejar qualquer coisa a longo prazo.` },
  { id: 'ev_larissa_1',  speakerId: 'p_mob_4',  sentiment: 'neutral',  title: 'Larissa Mendes — Flutter Dev',
    content: `Entrevistador: Como foi sua chegada e qual é seu papel?\n\nLarissa: Fui contratada especificamente pra Flutter. O Diego queria uma base unificada pros dois apps. Quando cheguei, vi que o iOS da Beatriz é maduro e o Android do Thiago é nativo. Meu papel ficou meio indefinido — faço experimentos em Flutter, mas não há decisão formal de migrar.\n\nEntrevistador: Isso te frustra?\n\nLarissa: Um pouco. Trabalho numa espécie de limbo. Entrego coisas úteis, mas nada vai pra produção de verdade ainda. O Diego está com medo de criar conflito com o Thiago, que é claramente contra Flutter. E enquanto isso, minhas POCs podem nunca virar produto.\n\nEntrevistador: E quando você precisa de backend?\n\nLarissa: É outra dependência. Qualquer endpoint novo que preciso pra testar no Flutter, fico na fila do Roberto. É difícil validar uma arquitetura nova quando o backend para tudo por uma pessoa.\n\nEntrevistador: O que funciona bem?\n\nLarissa: O Pedro do QA é muito cuidadoso — testa até minhas POCs com carinho, mesmo sabendo que podem não ir pra produção. Isso dá a sensação de que o trabalho importa, mesmo quando a estratégia está nebulosa. Com a Beatriz também é ótimo, ela é muito colaborativa.` },
  { id: 'ev_pedro_1',    speakerId: 'p_mob_5',  sentiment: 'negative', title: 'Pedro Alves — QA Mobile',
    content: `Entrevistador: Como você enxerga a qualidade dos apps hoje?\n\nPedro: Melhor do que seis meses atrás, mas com muito espaço. Temos iOS nativo da Beatriz, Android nativo do Thiago, e os experimentos Flutter da Larissa. Isso cria uma complexidade de teste que um QA sozinho não cobre completamente.\n\nEntrevistador: Você sente essa pressão?\n\nPedro: Diariamente. Cada release que sai, rezo pra não ter dado algo errado no que não consegui testar. O Diego é exigente com processo — diferente do Core, que às vezes bypassa QA. Mas o time não cresceu proporcionalmente à complexidade.\n\nEntrevistador: Como é a interface entre Mobile e Backend quando aparece um bug?\n\nPedro: Complicada. O bug de login do mês passado — identifiquei pelo log do app que o schema de resposta tinha mudado. Comuniquei ao Diego, que acionou o Roberto, que estava em reunião. A Beatriz foi direto na Carla, que resolveu. Foram três dias, mas a correção levou uma hora.\n\nEntrevistador: E o processo de release?\n\nPedro: iOS tranquilo — pipeline configurado. Android é sofrimento. O Thiago precisa do Fernando toda vez. Já aconteceu de eu aprovar um build no QA e o Thiago não conseguir publicar porque o Fernando estava de folga. O build ficou aprovado por mim por cinco dias esperando publicação. Cinco dias.` },
  { id: 'ev_mariana_1',  speakerId: 'p_prod_3', sentiment: 'negative', title: 'Mariana Luz — Lead Designer',
    content: `Entrevistador: Como é o processo de design aqui?\n\nMariana: Existe o processo que eu criei e o que de fato acontece. O que criei: discovery com o João Pedro, wireframes, validação com usuário, design system, handoff pro dev. O que acontece: o Rafael chega com uma feature pronta na cabeça, pede um layout em dois dias e vai pra dev.\n\nEntrevistador: Isso gera retrabalho?\n\nMariana: Muito. Já tivemos feature entrar em dev, chegar no cliente, cliente reclamar de usabilidade, e aí o design precisa ser refeito em cima de código já escrito. É três vezes mais caro consertar depois do dev do que antes. Mas como ninguém coloca isso em planilha, é invisível.\n\nEntrevistador: E o design system?\n\nMariana: É meu projeto de amor. Comecei há quatro meses. O Lucas usa bem, alguns outros às vezes. Mas quando tem entrega rápida, os devs implementam do zero em vez de usar os componentes — aí o produto fica visualmente inconsistente.\n\nEntrevistador: Como é trabalhar com a Letícia e o João Pedro?\n\nMariana: São excelentes. O João Pedro traz pesquisas que mudariam decisões de produto se alguém lesse. A Letícia tem talento imenso, mas fica subutilizada porque o fluxo é caótico. Temos um trio forte operando abaixo do potencial porque o processo não nos dá espaço.` },
  { id: 'ev_joao_1',     speakerId: 'p_prod_4', sentiment: 'negative', title: 'João Pedro — UX Researcher',
    content: `Entrevistador: Me conta sobre o trabalho de UX Research aqui.\n\nJoão Pedro: Faço pesquisas, conduzo entrevistas com usuários, analiso comportamento no produto. Gero relatórios com insights. E aí... acontece pouco com isso.\n\nEntrevistador: O que quer dizer "acontece pouco"?\n\nJoão Pedro: Em dezembro fiz uma pesquisa com 20 clientes sobre o fluxo de onboarding. Concluí que 70% abandonavam o setup na terceira etapa por confusão de interface. Entreguei um relatório de 40 páginas com recomendações. O Rafael leu, disse "muito bom, João", e o roadmap do Q1 não tinha nenhuma mudança de onboarding.\n\nEntrevistador: Como você se sente com isso?\n\nJoão Pedro: Frustrado, mas entendo a pressão. O Rafael está reagindo a demandas do Sales. Uma feature nova prometida pra um cliente grande vai sempre ganhar de uma melhoria de onboarding invisível. O problema é que o churn que a Aline relata no SMB está diretamente ligado ao onboarding ruim que eu documentei.\n\nEntrevistador: Você conectou essas pontas?\n\nJoão Pedro: Fiz uma apresentação pra Camila mostrando que o custo de aquisição está subindo porque onboarding ruim gera churn, o que aumenta o CAC. Ela ficou impressionada e disse que ia levar pro Ricardo. Nunca recebi feedback. A Mariana e a Letícia usam minhas pesquisas. Produto, raramente.` },
  { id: 'ev_leticia_1',  speakerId: 'p_prod_5', sentiment: 'neutral',  title: 'Letícia Faria — UI Designer',
    content: `Entrevistador: Como é o seu dia a dia como UI Designer?\n\nLetícia: Varia muito. Às vezes tenho muito trabalho, às vezes fico sem ter o que fazer porque o dev está bloqueado esperando algo do backend. É correria ou vácuo — raramente tem ritmo saudável.\n\nEntrevistador: O que causa essa intermitência?\n\nLetícia: Os atrasos do backend. Quando o Roberto trava, o desenvolvimento trava, e meu design fica pronto mas não tem onde implementar. Já aconteceu de eu fazer um componente completo no Figma, o Lucas começar a implementar, a PR ficar parada uma semana esperando review do Roberto — e nesse tempo mudaram os requisitos e eu tive que refazer tudo.\n\nEntrevistador: Como é a relação com os devs?\n\nLetícia: Com o Lucas é ótima, ele realmente usa o design system da Mariana. Com outros é difícil — quando estão na pressão, implementam da cabeça deles. Aí eu vejo o produto e penso "isso não é o que eu desenhei".\n\nEntrevistador: Você tem satisfação no trabalho?\n\nLetícia: Quando tem espaço pra trabalhar direito, sim. Esse espaço é raro. O que me faz ficar é o trio do design — a Mariana e o João Pedro são pessoas com quem aprendo muito. Mas o contexto ao redor é desgastante. O Rafael me pediu ontem uma tela nova de dashboard pra amanhã. Não é possível fazer bem em um dia.` },
  { id: 'ev_isabela_1',  speakerId: 'p_mkt_2',  sentiment: 'neutral',  title: 'Isabela Pinto — Growth Hacker',
    content: `Entrevistador: Como funciona o Growth aqui?\n\nIsabela: Teoria boa, prática difícil. Minha função é rodar experimentos de crescimento — teste A/B, onboarding flows, campanhas de reativação. Tudo isso depende de implementação técnica mínima. E aí começa o gargalo.\n\nEntrevistador: Qual gargalo especificamente?\n\nIsabela: Qualquer experimento que precisa de uma linha de código depende do backend ou do frontend — que estão na fila do Roberto. Já tive um experimento de reativação aprovado pelo Gabriel que ficou dois meses esperando implementação. Quando saiu, o momento tinha passado.\n\nEntrevistador: Você usa ferramentas no-code?\n\nIsabela: Uso quando posso — Intercom, algumas coisas no Segment. Mas os experimentos que realmente movem agulha precisam de produto. E o Produto está olhando pro backlog do Sales, não pro meu roadmap de Growth.\n\nEntrevistador: E os dados?\n\nIsabela: Tenho Mixpanel e Segment. O problema é que vários eventos não estão sendo trackeados porque ninguém implementou. Peço pro Rafael incluir tracking no backlog, ele adiciona, fica lá por semanas. Sem dados, os experimentos são cegos. Quando o Gabriel me pergunta quanto um experimento vai trazer, eu não consigo prometer resultado de algo que não consigo nem executar.` },
  { id: 'ev_felipe_1',   speakerId: 'p_mkt_3',  sentiment: 'negative', title: 'Felipe Barros — Content Strategist',
    content: `Entrevistador: Como você organiza o calendário de conteúdo em relação ao produto?\n\nFelipe: Deveria ser sincronizado. Na prática, faço o que consigo com o que sei. O produto define uma data de lançamento, eu começo a criar — artigo, email de anúncio, posts. Aí a data muda e tenho que segurar ou refazer tudo.\n\nEntrevistador: O lançamento do módulo de relatórios foi o mais grave?\n\nFelipe: Com certeza. Foram dois meses de atraso. Posso detalhar o impacto em Content: produzi seis artigos, uma série de emails, um webinar gravado com a Camila e o Rafael, um case study com cliente beta. Tudo pra gaveta. Quando saiu dois meses depois, o mercado tinha esquecido o hype.\n\nEntrevistador: Você tem canal direto com Produto?\n\nFelipe: Uma reunião de alinhamento mensal. É distante demais pra capturar nuances — precisaria saber da mudança de prazo na semana que acontece, não um mês depois.\n\nEntrevistador: E com o time de Sales?\n\nFelipe: A Patrícia me deu um feedback valioso: disse que os leads que chegam via conteúdo são muito técnicos pra eles fecharem. Ela preferiria conteúdo mais executivo, sobre ROI e resultado de negócio. Não é uma crítica ruim — me fez perceber que estou escrevendo pra pessoa errada, não pro decisor.` },
  { id: 'ev_natalia_1',  speakerId: 'p_mkt_4',  sentiment: 'negative', title: 'Natália Correia — Performance Ads',
    content: `Entrevistador: Como você gerencia as campanhas de performance?\n\nNatália: Gerencio investimento em mídia paga — Google Ads, LinkedIn, Meta. Trabalho com metas de CAC e MQL. O desafio é que o que acontece no funil de baixo — o produto, o onboarding, o CS — afeta diretamente minha eficiência, e eu não tenho controle disso.\n\nEntrevistador: Pode dar um exemplo?\n\nNatália: Em fevereiro, quando o módulo de relatórios deveria ter sido lançado, escalei as campanhas antecipando o lançamento — aumentei 40% do budget naquele mês. O lançamento atrasou dois meses. Fiquei com tráfego chegando numa landing page que prometia uma feature inexistente. Taxa de conversão despencou, CAC foi lá em cima. Tive que explicar pro Gabriel por que o mês foi ruim, sendo que o problema não foi a mídia.\n\nEntrevistador: E a atribuição?\n\nNatália: Outro problema. Não tenho clareza de qual canal está gerando fechamento porque o CRM de Sales não está integrado com nosso stack de analytics. O Eduardo fecha uma conta e eu não sei se veio de anúncio, conteúdo do Felipe ou outbound do André. Peço pro Ricardo resolver isso há meses. Sem dados, é tudo opinião.` },
  { id: 'ev_vanessa_1',  speakerId: 'p_sal_2',  sentiment: 'neutral',  title: 'Vanessa Moura — Account Executive',
    content: `Entrevistador: Como está seu pipeline de vendas ultimamente?\n\nVanessa: Ativo, com muito deal em estágio avançado. Mas com uma pressão que honestamente me deixa desconfortável às vezes.\n\nEntrevistador: O que te deixa desconfortável?\n\nVanessa: Sei que pra fechar alguns deals preciso prometer coisas que o produto ainda não tem. O Rodrigo sabe disso. Não é que mentimos — usamos frases como "está no roadmap" e "previsto para o segundo semestre". Mas o cliente entende que é garantido. E aí a Carolina ou o Bruno precisam lidar com a expectativa que eu criei.\n\nEntrevistador: Você falou com o Rodrigo sobre isso?\n\nVanessa: Já. Ele diz que é pressão de mercado, que se não fecharmos assim o concorrente fecha. Entendo, mas sinto que estamos construindo uma base de clientes frustrados. O Eduardo perdeu um deal mês passado pro concorrente que tinha a feature que prometemos pra Q3. A ironia é que se o Produto tivesse entregado no prazo prometido, não precisaríamos prometer de novo.\n\nEntrevistador: E o pós-venda?\n\nVanessa: O Bruno é incrível, mas está no limite. Já tive cliente ligando pra mim diretamente — pra mim, AE — porque o CSM não respondia rápido o suficiente. Não é culpa do Bruno, é volume. Mas isso corrói a relação que eu construí na venda.` },
  { id: 'ev_eduardo_1',  speakerId: 'p_sal_3',  sentiment: 'negative', title: 'Eduardo Lima — Account Executive',
    content: `Entrevistador: Você pode me dar um panorama dos seus deals recentes?\n\nEduardo: Fechei três no último mês — dois foram bem, um foi um susto. O susto: perdi um deal de R$80k pro concorrente porque eles tinham integração nativa com o ERP do cliente, que a gente não tem. Essa integração está "no roadmap" há seis meses.\n\nEntrevistador: Você escala isso internamente?\n\nEduardo: Escalo pro Rodrigo, que escala pro Rafael. O Rafael diz que está no Q3. Mas eu perdi três deals por essa integração específica. Três. É uma integração que provavelmente seria feita em duas semanas por um dev focado. Mas nunca sobe de prioridade porque não tem campeão interno além de mim — e eu não tenho acesso ao processo de priorização.\n\nEntrevistador: Como você lida com a pressão de meta?\n\nEduardo: Trabalho muito. Minha taxa de fechamento não é ruim, mas o ciclo está ficando mais longo porque as objeções estão ficando mais técnicas. O perfil de comprador mudou — antes era dono de empresa, agora é gestor técnico com lista de requirements. E a Vanessa e eu não temos as respostas técnicas na ponta da língua. Um Sales Engineer seria transformador aqui.` },
  { id: 'ev_patricia_1', speakerId: 'p_sal_4',  sentiment: 'neutral',  title: 'Patrícia Silva — SDR',
    content: `Entrevistador: Como é o processo de qualificação de leads?\n\nPatrícia: Faço outbound e cuido de leads inbound que chegam pelo marketing. O perfil que converte melhor é gestor financeiro de empresa com 50 a 200 funcionários. Mas nem sempre é esse perfil que o marketing está atraindo.\n\nEntrevistador: O que você quer dizer?\n\nPatrícia: O Felipe cria conteúdo muito técnico — APIs, integrações, arquitetura. Isso atrai CTOs e developers. Mas o decisor de compra é o CFO ou o CEO. Já conversei com ele sobre isso informalmente. Ficou receptivo, mas não vi mudança.\n\nEntrevistador: Existe algum padrão de objeção que você percebe?\n\nPatrícia: Sim — integração com ERP. É a objeção número um, aparece em quase toda conversa. Já passei isso pro Rodrigo várias vezes, que passou pro Rafael. Não vi no roadmap. O André levanta isso toda semana nas calls de time também.\n\nEntrevistador: Como é a passagem de lead pro AE?\n\nPatrícia: Tenho ritual semanal com o Eduardo e o Rodrigo. Mas o Rodrigo às vezes pede que eu force a passagem de lead antes da hora porque quer encher o pipeline. Quando isso acontece, o Eduardo perde tempo com lead que não está pronto e fico com o histórico sujo de qualificação.` },
  { id: 'ev_andre_1',    speakerId: 'p_sal_5',  sentiment: 'positive', title: 'André Santos — SDR',
    content: `Entrevistador: Você pode me contar sua experiência aqui? Você é mais recente no time, certo?\n\nAndré: Sim, quatro meses. Vim da área de TI — trabalhei como analista de sistemas antes. Então entendo o produto melhor do que um SDR típico. Isso é bom e ruim.\n\nEntrevistador: Por que ruim?\n\nAndré: Porque percebo quando o que estamos prometendo não é exatamente o que o produto faz. Não é mentira, mas é... otimista. Vendo isso com olhos de quem já foi cliente de software, fico desconfortável em alguns pitches. Falei com a Patrícia, ela entende. Não sei se chegou mais longe — não quero parecer o chato reclamão sendo novo.\n\nEntrevistador: Qual é o feedback mais comum de quem não avança?\n\nAndré: "Preciso de uma integração que vocês não têm." É a ERP, sempre. Ficamos sabendo disso nos primeiros minutos de conversa. Já é quase um roteiro.\n\nEntrevistador: O que te animou na posição?\n\nAndré: O produto em si é bom. Quando demonstro as funcionalidades que existem, o cliente fica animado. O problema é o gap entre o que existe e o que o cliente precisa. Se a gente fechasse esse gap mais rápido, venderíamos muito mais — sem precisar prometer o que ainda não temos.` },
  { id: 'ev_aline_1',    speakerId: 'p_cs_3',   sentiment: 'negative', title: 'Aline Freitas — CSM SMB',
    content: `Entrevistador: Como está a situação das suas contas SMB?\n\nAline: Tenho 45 contas ativas. O churn está em 8% ao mês nos últimos dois meses — acima do aceitável. A maioria dos churns acontece nos primeiros 90 dias. É onboarding ruim, quase sempre.\n\nEntrevistador: Onboarding ruim em que sentido?\n\nAline: O produto tem muita funcionalidade que o cliente SMB não vai usar, e a jornada de setup não é intuitiva. O João Pedro do Produto fez uma pesquisa exatamente sobre isso — me consultou durante a pesquisa. As recomendações dele eram exatamente o que eu vivo no dia a dia. Mas não vi mudança no produto.\n\nEntrevistador: Sua rotina de check-in é proativa?\n\nAline: Reativa, infelizmente. Com 45 contas e sem health score, só consigo agir quando o cliente abre ticket ou para de usar o produto. Deveria identificar risco de churn antes de o cliente reclamar.\n\nEntrevistador: Como você se compara ao Bruno em Enterprise?\n\nAline: É diferente. O Bruno tem 14 contas — muito, mas tem mais tempo por conta. Eu tenho 45 com muito menos atenção por cliente. Enterprise tem SLA, SMB não tem. Às vezes sinto que SMB é cidadão de segunda classe internamente — quando é onde está o maior volume da empresa.` },
  { id: 'ev_marcelo_1',  speakerId: 'p_cs_4',   sentiment: 'negative', title: 'Marcelo Vieira — Support Analyst',
    content: `Entrevistador: Como está o volume de suporte hoje?\n\nMarcelo: Alto e crescendo. Recebo em média 35 tickets por dia — minha capacidade saudável seria 20. O excesso acumula, os SLAs começam a vazar, e aí começo a receber escalada da Carolina, da Aline e às vezes direto do Bruno.\n\nEntrevistador: Quais tipos de ticket dominam?\n\nMarcelo: Três categorias. Primeira: dúvidas de uso — o produto não é intuitivo o suficiente. Segunda: problemas de integração, especialmente com ERP, que sempre quebra em edge case. Terceira: bugs que se repetem. E aqui é onde fica complicado.\n\nEntrevistador: Os bugs que se repetem — quais são?\n\nMarcelo: O módulo de relatórios financeiros tem um bug específico quando o cliente tem mais de 500 lançamentos no mês: ele trunca o relatório. Cataloguei 18 ocorrências desse bug. Levei pro Roberto, ele disse que sabe e está na fila. Levei pra Sofia, ela disse que está documentado. O bug está lá há quatro meses.\n\nEntrevistador: O que mudaria mais rápido sua realidade?\n\nMarcelo: Resolver a causa raiz de 10 bugs recorrentes já reduziria 30% do meu volume. Mas a engenharia tem suas prioridades. E eu precisaria de um interlocutor claro em Engenharia para bugs de produção — hoje nunca sei se mando pro Roberto ou pro Jira ou pro Slack.` },
  { id: 'ev_ricardo_1',  speakerId: 'p_ops_1',  sentiment: 'neutral',  title: 'Ricardo Nunes — COO',
    content: `Entrevistador: Como você avalia a situação operacional da empresa agora?\n\nRicardo: Estamos num momento crítico, mas administrável. A Série A nos deu fôlego pra crescer, mas também criou pressão por resultados que às vezes acelera decisões que deveriam ter mais cuidado.\n\nEntrevistador: Quais tensões te preocupam mais?\n\nRicardo: A concentração de conhecimento em Engenharia. O Roberto, o Fernando e a Amanda são pontos únicos de falha — eu sei disso. Já conversei com a Fernanda sobre mitigar esse risco. O problema é que contratar sênior agora não está no orçamento que aprovei com os investidores para este semestre.\n\nEntrevistador: E o churn no SMB?\n\nRicardo: Preocupa. A Aline me passou os números — 8% ao mês não é sustentável. Mas a solução envolve produto, e o Produto está focado em features que o Sales demanda para fechamento de Enterprise. É um trade-off real: priorizo retenção de SMB ou aquisição de Enterprise? Os investidores querem ARR, e Enterprise puxa mais ARR.\n\nEntrevistador: Você tem alinhamento com o Rodrigo sobre o que pode ser prometido?\n\nRicardo: Esse ponto precisa melhorar. O Sales promete e o CS entrega — e às vezes o que foi prometido não existe. Já conversei com o Rodrigo, mas a pressão de bater meta mensal é maior que a preocupação de longo prazo. É uma cultura que precisa ser corrigida de cima pra baixo, e isso começa por mim.` },
  { id: 'ev_tiago_1',    speakerId: 'p_ops_3',  sentiment: 'negative', title: 'Tiago Monteiro — Tech Recruiter',
    content: `Entrevistador: Como está o processo de recrutamento de tecnologia?\n\nTiago: Desafiador. O mercado de tech está competitivo e nosso posicionamento de salário não está nos primeiros quartis. Perco candidatos sênior pra empresas que pagam 30-40% a mais.\n\nEntrevistador: Você está com posições abertas agora?\n\nTiago: Três headcounts aprovados: um DevOps e dois Backend Sênior. O DevOps está aberto há três meses. Entrevistei 12 candidatos, fechei oferta com dois, ambos recusaram por salário. A Fernanda está tentando flexibilizar o budget com o Ricardo, mas ainda não chegou numa faixa competitiva.\n\nEntrevistador: O que os candidatos buscam além de salário?\n\nTiago: Cultura, desafio técnico, crescimento. Aqui o desafio técnico existe. Mas quando perguntam sobre tech lead e mentoria, fico em dificuldade — sei que o Roberto está sobrecarregado e o processo tem seus problemas. Não minto pro candidato, mas também não sei como apresentar isso positivamente.\n\nEntrevistador: E a retenção dos atuais?\n\nTiago: Me preocupa muito. Se mais alguém sair — especialmente Fernando ou Amanda — o impacto operacional é enorme e o prazo de substituição seria de três a quatro meses no mínimo. Urgência não fecha vaga rápido. Nunca fecha.` },
  { id: 'ev_claudia_1',  speakerId: 'p_ops_4',  sentiment: 'neutral',  title: 'Cláudia Ramos — Financial Analyst',
    content: `Entrevistador: Como estão os números da empresa neste momento?\n\nCláudia: Posso falar de forma macro: o MRR está crescendo, mas o churn está comendo parte desse crescimento. O CAC subiu nos últimos dois trimestres — está ficando mais caro adquirir cliente. E o LTV do SMB especificamente está baixo porque o churn é alto.\n\nEntrevistador: Isso preocupa os investidores?\n\nCláudia: Preocupa o Ricardo, que preocupa os investidores. O board meeting do mês passado foi tenso — a métrica de Net Revenue Retention estava abaixo do benchmark de SaaS saudável. 100% é o mínimo; estávamos em 94%.\n\nEntrevistador: E o burn rate?\n\nCláudia: Dentro do aprovado na Série A, mas no teto. Se o crescimento não acelerar no próximo semestre, precisaremos conversar sobre extensão de runway ou nova rodada antes do planejado.\n\nEntrevistador: Há algo no P&L que te chama atenção?\n\nCláudia: A linha de suporte está crescendo mais rápido do que a receita — isso indica que o produto está gerando mais atrito do que deveria. Cada ticket tem um custo, e a maioria é de bug recorrente ou onboarding mal feito. Duas coisas evitáveis. Já fiz uma análise mostrando que a integração ERP que o Sales mais pede tem payback de menos de dois meses em deals perdidos. Enviei pro Rafael via Ricardo. Não ouvi mais nada.` },
];

// ---- COMPUTE linkedEntityIds for each evidence ----
evidences.forEach(ev => {
  ev.linkedEntityIds = autoLinkEntities(ev.content, allItems, ev.speakerId);
});

// ---- LAYOUT DESIGN ----
// 7 team clusters arranged in a 3-column grid:
//   Col 0 (x=-2600): Eng Core (row 0), Eng Mobile (row 1)
//   Col 1 (x=-800):  Product (row 0), CS (row 1), Ops (row 2)
//   Col 2 (x=1000):  Marketing (row 0), Sales (row 1)
//
// Each cluster:
//   - Team card: 500x300, at cluster origin
//   - People: 2 columns below team (280px each, 20px gap), 30px below team
//   - Evidences: column to the RIGHT of team (200px wide, 20px gap), starting at cluster y

const TW = 500, TH = 300;  // team card size
const PW = 280, PH = 100;  // person card size
const EW = 200, EH = 120;  // evidence card size
const GAP = 20;

// Cluster layout helper
function buildCluster(clusterX, clusterY, teamId, personIds, evidenceIds) {
  const items = [];

  // Team
  const team = teams.find(t => t.id === teamId);
  items.push({ ...team, x: clusterX, y: clusterY, width: TW, height: TH, zIndex: 1, isSelected: false });

  // People: 2 cols below team
  const peopleStartY = clusterY + TH + 30;
  personIds.forEach((pid, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const px = clusterX + col * (PW + GAP);
    const py = peopleStartY + row * (PH + GAP);
    const p = people.find(p => p.id === pid);
    items.push({ ...p, x: px, y: py, width: PW, height: PH, zIndex: 2, isSelected: false });
  });

  // Evidence: column to the right of team (with gap)
  const evStartX = clusterX + TW + 50;
  evidenceIds.forEach((eid, i) => {
    const ev = evidences.find(e => e.id === eid);
    const ey = clusterY + i * (EH + GAP);
    items.push({ ...ev, x: evStartX, y: ey, width: EW, height: EH, zIndex: 3, isSelected: false });
  });

  return items;
}

// Cluster definitions
const COL0 = -2700, COL1 = -800, COL2 = 1000;
const ROW0 = -1200, ROW1 = 900, ROW2 = 3000;

const clusterDefs = [
  // Eng Core
  { x: COL0, y: ROW0, teamId: 'team_eng_core',
    persons: ['p_eng_1','p_eng_2','p_eng_3','p_eng_4','p_eng_5','p_eng_6','p_eng_7','p_eng_8'],
    evidences: ['ev_rob_1','ev_carla_1','ev_amanda_1','ev_fernando_1','ev_marcos_1','ev_juliana_1','ev_lucas_1','ev_sofia_1'] },
  // Eng Mobile
  { x: COL0, y: ROW1, teamId: 'team_eng_mobile',
    persons: ['p_mob_1','p_mob_2','p_mob_3','p_mob_4','p_mob_5'],
    evidences: ['ev_diego_1','ev_beatriz_1','ev_thiago_1','ev_larissa_1','ev_pedro_1'] },
  // Product
  { x: COL1, y: ROW0, teamId: 'team_product',
    persons: ['p_prod_1','p_prod_2','p_prod_3','p_prod_4','p_prod_5'],
    evidences: ['ev_camila_1','ev_rafael_1','ev_mariana_1','ev_joao_1','ev_leticia_1'] },
  // CS
  { x: COL1, y: ROW1, teamId: 'team_cs',
    persons: ['p_cs_1','p_cs_2','p_cs_3','p_cs_4'],
    evidences: ['ev_carolina_1','ev_bruno_1','ev_aline_1','ev_marcelo_1'] },
  // Ops
  { x: COL1, y: ROW2, teamId: 'team_ops',
    persons: ['p_ops_1','p_ops_2','p_ops_3','p_ops_4'],
    evidences: ['ev_fernanda_1','ev_ricardo_1','ev_tiago_1','ev_claudia_1'] },
  // Marketing
  { x: COL2, y: ROW0, teamId: 'team_marketing',
    persons: ['p_mkt_1','p_mkt_2','p_mkt_3','p_mkt_4'],
    evidences: ['ev_gabriel_1','ev_isabela_1','ev_felipe_1','ev_natalia_1'] },
  // Sales
  { x: COL2, y: ROW1, teamId: 'team_sales',
    persons: ['p_sal_1','p_sal_2','p_sal_3','p_sal_4','p_sal_5'],
    evidences: ['ev_rodrigo_1','ev_vanessa_1','ev_eduardo_1','ev_patricia_1','ev_andre_1'] },
];

const allLayoutItems = [];
clusterDefs.forEach(def => {
  const items = buildCluster(def.x, def.y, def.teamId, def.persons, def.evidences);
  allLayoutItems.push(...items);
});

// ---- PRINT RESULTS ----
// Print the recomputed linkedEntityIds for each evidence
console.log('\n=== RECOMPUTED linkedEntityIds ===\n');
evidences.forEach(ev => {
  console.log(`${ev.id}: [${ev.linkedEntityIds.map(id => `"${id}"`).join(',')}]`);
});

// Print positions
console.log('\n=== POSITIONS ===\n');
allLayoutItems.forEach(item => {
  console.log(`${item.id}: x=${item.x}, y=${item.y}`);
});
