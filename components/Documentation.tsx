
import React, { useState } from 'react';
import { useLanguage } from '../utils/i18n';
import { SynthesisIcon } from './Toolbar';
import {
  X, Book, Layers, MousePointer2, GitMerge,
  Activity, FileText, Sparkles,
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface DocumentationProps {
  onClose: () => void;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${color}`}>
    {label}
  </span>
);

const Tip = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-2 bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-3 mt-3">
    <Sparkles size={14} className="text-indigo-400 shrink-0 mt-0.5" />
    <p className="text-xs text-indigo-200 leading-relaxed">{children}</p>
  </div>
);

const Warning = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-2 bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mt-3">
    <span className="text-amber-400 text-xs shrink-0">⚠</span>
    <p className="text-xs text-amber-200 leading-relaxed">{children}</p>
  </div>
);

const Field = ({ name, type, desc }: { name: string; type: string; desc: string }) => (
  <div className="flex items-start gap-3 py-2 border-b border-zinc-800/60 last:border-0">
    <code className="text-[11px] text-emerald-400 shrink-0 w-36">{name}</code>
    <span className="text-[10px] text-zinc-500 shrink-0 w-20 mt-0.5">{type}</span>
    <span className="text-xs text-zinc-400">{desc}</span>
  </div>
);

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="inline-block bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-mono px-1.5 py-0.5 rounded">{children}</kbd>
);

// ─── section content ──────────────────────────────────────────────────────────

const SectionWhat = ({ lang }: { lang: string }) =>
  lang === 'pt' ? (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-black text-white mb-3">O que é o Origo?</h3>
        <p className="text-sm text-zinc-300 leading-relaxed">
          O <strong className="text-white">Origo</strong> é uma ferramenta de <strong className="text-indigo-400">diagnóstico estrutural de sistemas sócio-técnicos</strong>. Ele permite mapear equipes, pessoas e evidências em um canvas infinito e, em seguida, usar IA para identificar os padrões invisíveis que causam fricção, sobrecarga e falhas na organização.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: '🗺️', title: 'Mapeamento Visual', desc: 'Visualize times, pessoas e dependências no mesmo canvas interativo.' },
          { icon: '🎙️', title: 'Coleta de Evidências', desc: 'Registre depoimentos, métricas e dores com sentimento e vínculo ao entrevistado.' },
          { icon: '🔬', title: 'Análise Local', desc: 'Motor embutido detecta SPOFs, contradições e sobrecarga cognitiva sem IA.' },
          { icon: '🤖', title: 'Síntese com IA', desc: 'Pipeline de IA transforma o grafo em relatório executivo com recomendações.' },
        ].map(c => (
          <div key={c.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-2xl mb-2">{c.icon}</div>
            <div className="text-sm font-semibold text-white mb-1">{c.title}</div>
            <p className="text-xs text-zinc-400 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Casos de uso</h4>
        <ul className="space-y-2 text-sm text-zinc-300">
          <li className="flex gap-2"><span className="text-indigo-400">→</span> CTO/COO conduzindo redesenho organizacional</li>
          <li className="flex gap-2"><span className="text-indigo-400">→</span> RH analisando saúde e sobrecarga dos times</li>
          <li className="flex gap-2"><span className="text-indigo-400">→</span> Consultores mapeando dependências e gargalos</li>
          <li className="flex gap-2"><span className="text-indigo-400">→</span> Times de produto entendendo fluxos e responsabilidades</li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Metodologia</h4>
        <div className="space-y-2">
          {[
            { n: '1', t: 'Mapear a realidade', d: 'Cadastre times, pessoas e evidências com base em entrevistas e dados reais.' },
            { n: '2', t: 'Detectar disfunções', d: 'O motor local calcula SPOFs, contradições e sobrecarga cognitiva automaticamente.' },
            { n: '3', t: 'Sintetizar com IA', d: 'A IA analisa o grafo completo e gera insights estruturais e recomendações.' },
            { n: '4', t: 'Acionar mudanças', d: 'Use o relatório para priorizar ações por impacto e esforço.' },
          ].map(s => (
            <div key={s.n} className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs flex items-center justify-center shrink-0 font-bold">{s.n}</div>
              <div>
                <span className="text-sm font-semibold text-white">{s.t}: </span>
                <span className="text-sm text-zinc-400">{s.d}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-black text-white mb-3">What is Origo?</h3>
        <p className="text-sm text-zinc-300 leading-relaxed">
          <strong className="text-white">Origo</strong> is a <strong className="text-indigo-400">structural diagnostic tool for socio-technical systems</strong>. It lets you map teams, people, and evidence on an infinite canvas, then use AI to identify the invisible patterns causing friction, overload, and failure within your organization.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: '🗺️', title: 'Visual Mapping', desc: 'Visualize teams, people, and dependencies on the same interactive canvas.' },
          { icon: '🎙️', title: 'Evidence Collection', desc: 'Record testimonies, metrics, and pain points with sentiment and speaker attribution.' },
          { icon: '🔬', title: 'Local Analysis', desc: 'Built-in engine detects SPOFs, contradictions, and cognitive overload — no AI required.' },
          { icon: '🤖', title: 'AI Synthesis', desc: 'AI pipeline transforms the graph into an executive report with recommendations.' },
        ].map(c => (
          <div key={c.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-2xl mb-2">{c.icon}</div>
            <div className="text-sm font-semibold text-white mb-1">{c.title}</div>
            <p className="text-xs text-zinc-400 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Use cases</h4>
        <ul className="space-y-2 text-sm text-zinc-300">
          <li className="flex gap-2"><span className="text-indigo-400">→</span> CTO/COO conducting organizational redesign</li>
          <li className="flex gap-2"><span className="text-indigo-400">→</span> HR analyzing team health and cognitive load</li>
          <li className="flex gap-2"><span className="text-indigo-400">→</span> Consultants mapping dependencies and bottlenecks</li>
          <li className="flex gap-2"><span className="text-indigo-400">→</span> Product teams understanding flows and ownership</li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Methodology</h4>
        <div className="space-y-2">
          {[
            { n: '1', t: 'Map reality', d: 'Register teams, people, and evidence based on interviews and real data.' },
            { n: '2', t: 'Detect dysfunction', d: 'The local engine automatically calculates SPOFs, contradictions, and cognitive load.' },
            { n: '3', t: 'Synthesize with AI', d: 'AI analyzes the full graph and generates structural insights and recommendations.' },
            { n: '4', t: 'Drive change', d: 'Use the report to prioritize actions by impact and effort.' },
          ].map(s => (
            <div key={s.n} className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs flex items-center justify-center shrink-0 font-bold">{s.n}</div>
              <div>
                <span className="text-sm font-semibold text-white">{s.t}: </span>
                <span className="text-sm text-zinc-400">{s.d}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

const SectionEntities = ({ lang }: { lang: string }) =>
  lang === 'pt' ? (
    <div className="space-y-8">
      <p className="text-sm text-zinc-400">O Origo possui quatro tipos de entidades. Cada uma tem um papel distinto no diagnóstico.</p>

      {/* TEAM */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 bg-indigo-500/10 border-b border-zinc-800">
          <div className="w-3 h-3 rounded-sm bg-indigo-500" />
          <span className="text-sm font-bold text-white">Equipe (Team)</span>
          <Badge label="TEAM" color="text-indigo-400 border-indigo-500/40 bg-indigo-500/10" />
        </div>
        <div className="p-4 space-y-1 text-xs text-zinc-400">
          <p className="mb-3">Representa uma unidade organizacional (squad, tribo, departamento). Contém Pessoas e agrupa as evidências dos seus membros no canvas.</p>
          <Field name="title" type="string" desc="Nome da equipe (ex: Engenharia Core)" />
          <Field name="description" type="string?" desc="Responsabilidades e escopo da equipe" />
          <Field name="color" type="hex" desc="Cor de destaque do card" />
          <Field name="isCollapsed" type="boolean" desc="Recolhe membros e evidências vinculadas no canvas" />
        </div>
        <Tip>Recolha equipes para visualizar apenas a topologia de alto nível sem o ruído dos indivíduos.</Tip>
      </div>

      {/* PERSON */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border-b border-zinc-800">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm font-bold text-white">Pessoa (Person)</span>
          <Badge label="PERSON" color="text-emerald-400 border-emerald-500/40 bg-emerald-500/10" />
        </div>
        <div className="p-4 space-y-1 text-xs text-zinc-400">
          <p className="mb-3">Representa um indivíduo na organização. Vinculada a uma equipe, participa do cálculo de SPOFs e carga cognitiva.</p>
          <Field name="title" type="string" desc="Nome completo da pessoa" />
          <Field name="role" type="string" desc="Cargo ou papel (ex: Tech Lead, Designer)" />
          <Field name="teamId" type="string?" desc="ID da equipe à qual esta pessoa pertence" />
          <Field name="color" type="hex" desc="Cor do card (herda a da equipe por padrão)" />
          <Field name="avatarUrl" type="string?" desc="URL de imagem para exibição no card" />
        </div>
      </div>

      {/* EVIDENCE */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 border-b border-zinc-800">
          <div className="w-3 h-3 rounded-sm bg-amber-500" />
          <span className="text-sm font-bold text-white">Evidência (Evidence)</span>
          <Badge label="EVIDENCE" color="text-amber-400 border-amber-500/40 bg-amber-500/10" />
        </div>
        <div className="p-4 space-y-1 text-xs text-zinc-400">
          <p className="mb-3">O coração do diagnóstico. Representa um depoimento, métrica, incidente ou observação coletada. A cor reflete o sentimento.</p>
          <Field name="title" type="string" desc="Resumo da evidência (ex: 'Incidente P1 — Pagamento')" />
          <Field name="content" type="string" desc="Descrição completa, citação ou dado observado" />
          <Field name="sentiment" type="enum" desc="'positive' | 'neutral' | 'negative' — determina a cor do card" />
          <Field name="speakerId" type="string?" desc="ID da Person que forneceu este depoimento (relator)" />
          <Field name="linkedEntityIds" type="string[]" desc="IDs de Equipes e Pessoas citadas nesta evidência" />
          <Field name="source" type="string?" desc="Origem externa (PagerDuty, Zendesk, entrevista, etc.)" />
        </div>
        <div className="px-4 pb-4 flex gap-2 flex-wrap">
          <Badge label="🟢 Positivo" color="text-emerald-400 border-emerald-500/40 bg-emerald-500/10" />
          <Badge label="⚪ Neutro" color="text-zinc-400 border-zinc-600 bg-zinc-800" />
          <Badge label="🔴 Negativo" color="text-red-400 border-red-500/40 bg-red-500/10" />
        </div>
        <Tip>Use a Transcrição para colar entrevistas completas. O motor detecta entidades mencionadas e vincula automaticamente via Auto-vincular.</Tip>
      </div>

      {/* NOTE */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-700/30 border-b border-zinc-800">
          <div className="w-3 h-3 rounded-sm bg-zinc-500" />
          <span className="text-sm font-bold text-white">Nota (Note)</span>
          <Badge label="NOTE" color="text-zinc-400 border-zinc-600 bg-zinc-800" />
        </div>
        <div className="p-4 space-y-1 text-xs text-zinc-400">
          <p className="mb-3">Anotação livre no canvas. Não participa do cálculo analítico — serve para contexto, hipóteses ou marcações visuais.</p>
          <Field name="title" type="string" desc="Título da nota" />
          <Field name="content" type="string" desc="Conteúdo livre (markdown simples suportado)" />
          <Field name="color" type="hex" desc="Cor de fundo do card" />
        </div>
      </div>
    </div>
  ) : (
    <div className="space-y-8">
      <p className="text-sm text-zinc-400">Origo has four entity types. Each plays a distinct role in the diagnostic.</p>

      {/* TEAM */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 bg-indigo-500/10 border-b border-zinc-800">
          <div className="w-3 h-3 rounded-sm bg-indigo-500" />
          <span className="text-sm font-bold text-white">Team</span>
          <Badge label="TEAM" color="text-indigo-400 border-indigo-500/40 bg-indigo-500/10" />
        </div>
        <div className="p-4 space-y-1 text-xs text-zinc-400">
          <p className="mb-3">Represents an organizational unit (squad, tribe, department). Contains People and groups their evidence on the canvas.</p>
          <Field name="title" type="string" desc="Team name (e.g. Core Engineering)" />
          <Field name="description" type="string?" desc="Team responsibilities and scope" />
          <Field name="color" type="hex" desc="Card highlight color" />
          <Field name="isCollapsed" type="boolean" desc="Hides members and linked evidence on the canvas" />
        </div>
        <Tip>Collapse teams to visualize only the high-level topology without individual noise.</Tip>
      </div>

      {/* PERSON */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border-b border-zinc-800">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm font-bold text-white">Person</span>
          <Badge label="PERSON" color="text-emerald-400 border-emerald-500/40 bg-emerald-500/10" />
        </div>
        <div className="p-4 space-y-1 text-xs text-zinc-400">
          <p className="mb-3">Represents an individual in the organization. Linked to a team, participates in SPOF and cognitive load calculations.</p>
          <Field name="title" type="string" desc="Full name of the person" />
          <Field name="role" type="string" desc="Job title or role (e.g. Tech Lead, Designer)" />
          <Field name="teamId" type="string?" desc="ID of the team this person belongs to" />
          <Field name="color" type="hex" desc="Card color (inherits from team by default)" />
          <Field name="avatarUrl" type="string?" desc="Image URL for display on the card" />
        </div>
      </div>

      {/* EVIDENCE */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 border-b border-zinc-800">
          <div className="w-3 h-3 rounded-sm bg-amber-500" />
          <span className="text-sm font-bold text-white">Evidence</span>
          <Badge label="EVIDENCE" color="text-amber-400 border-amber-500/40 bg-amber-500/10" />
        </div>
        <div className="p-4 space-y-1 text-xs text-zinc-400">
          <p className="mb-3">The heart of the diagnostic. Represents a testimony, metric, incident, or observation collected. Card color reflects sentiment.</p>
          <Field name="title" type="string" desc="Evidence summary (e.g. 'P1 Incident — Payment')" />
          <Field name="content" type="string" desc="Full description, quote, or observed data" />
          <Field name="sentiment" type="enum" desc="'positive' | 'neutral' | 'negative' — determines card color" />
          <Field name="speakerId" type="string?" desc="ID of the Person who provided this testimony (speaker)" />
          <Field name="linkedEntityIds" type="string[]" desc="IDs of Teams and People referenced in this evidence" />
          <Field name="source" type="string?" desc="External source (PagerDuty, Zendesk, interview, etc.)" />
        </div>
        <div className="px-4 pb-4 flex gap-2 flex-wrap">
          <Badge label="🟢 Positive" color="text-emerald-400 border-emerald-500/40 bg-emerald-500/10" />
          <Badge label="⚪ Neutral" color="text-zinc-400 border-zinc-600 bg-zinc-800" />
          <Badge label="🔴 Negative" color="text-red-400 border-red-500/40 bg-red-500/10" />
        </div>
        <Tip>Use the Transcript field to paste full interviews. The engine detects mentioned entities and links them automatically via Auto-link.</Tip>
      </div>

      {/* NOTE */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-700/30 border-b border-zinc-800">
          <div className="w-3 h-3 rounded-sm bg-zinc-500" />
          <span className="text-sm font-bold text-white">Note</span>
          <Badge label="NOTE" color="text-zinc-400 border-zinc-600 bg-zinc-800" />
        </div>
        <div className="p-4 space-y-1 text-xs text-zinc-400">
          <p className="mb-3">Free-form annotation on the canvas. Does not participate in analytical calculations — used for context, hypotheses, or visual markers.</p>
          <Field name="title" type="string" desc="Note title" />
          <Field name="content" type="string" desc="Free content (basic markdown supported)" />
          <Field name="color" type="hex" desc="Card background color" />
        </div>
      </div>
    </div>
  );

const SectionNavigation = ({ lang }: { lang: string }) =>
  lang === 'pt' ? (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Ferramentas do Canvas</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs font-bold text-white mb-1">✋ Mover (Pan)</div>
            <p className="text-xs text-zinc-400">Arraste o canvas. Também ativo com clique do meio do mouse em qualquer modo.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs font-bold text-white mb-1">↖ Seleção (Select)</div>
            <p className="text-xs text-zinc-400">Clique para selecionar um item e abrir o Inspetor. Arraste para mover.</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Zoom & Navegação</h4>
        <div className="space-y-2">
          {[
            { action: 'Ctrl + Scroll', desc: 'Zoom in/out (0.2× a 3.0×)' },
            { action: 'Scroll', desc: 'Mover canvas verticalmente' },
            { action: 'Scroll horizontal', desc: 'Mover canvas horizontalmente' },
            { action: 'Botões + / −', desc: 'Zoom incremental na barra inferior' },
            { action: 'Clique do meio + arrastar', desc: 'Pan em qualquer modo' },
          ].map(r => (
            <div key={r.action} className="flex items-center gap-3 py-1.5">
              <Kbd>{r.action}</Kbd>
              <span className="text-xs text-zinc-400">{r.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Atalhos de Teclado</h4>
        <div className="space-y-2">
          {[
            { key: 'Ctrl+Z', desc: 'Desfazer última ação' },
            { key: 'Ctrl+Y / Ctrl+Shift+Z', desc: 'Refazer ação desfeita' },
            { key: 'Delete / Backspace', desc: 'Excluir item selecionado' },
          ].map(r => (
            <div key={r.key} className="flex items-center gap-3 py-1.5">
              <Kbd>{r.key}</Kbd>
              <span className="text-xs text-zinc-400">{r.desc}</span>
            </div>
          ))}
        </div>
        <Warning>O histórico de desfazer é por sessão (máx. 50 ações) e não persiste após fechar o navegador.</Warning>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Mover & Redimensionar Itens</h4>
        <div className="space-y-3 text-sm text-zinc-300">
          <p><strong className="text-white">Mover:</strong> No modo Seleção, arraste qualquer item. O threshold de 5px evita arrastos acidentais ao clicar.</p>
          <p><strong className="text-white">Redimensionar:</strong> Hover sobre um item — aparecerão alças nos 4 cantos. Arraste para redimensionar (tamanho mínimo: 20×20px).</p>
          <p><strong className="text-white">Duplicar:</strong> Abra o Inspetor do item (clique para selecionar) e use o botão Duplicar.</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Filtros & Busca</h4>
        <div className="space-y-2 text-xs text-zinc-400">
          <p><span className="text-white font-semibold">🔍 Busca de texto:</span> Filtra por título, conteúdo e cargo (case-insensitive).</p>
          <p><span className="text-white font-semibold">📦 Filtro de tipo:</span> Mostra apenas Equipes, Pessoas, Evidências ou Notas.</p>
          <p><span className="text-white font-semibold">🎭 Filtro de sentimento:</span> Filtra Evidências por Positivo, Neutro ou Negativo.</p>
        </div>
        <Tip>Combine busca de texto com filtro de sentimento para localizar rapidamente todas as evidências negativas sobre uma equipe específica.</Tip>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Hover & Destaque</h4>
        <p className="text-sm text-zinc-400">Ao passar o mouse sobre um item, todas as entidades conectadas são destacadas:</p>
        <ul className="mt-2 space-y-1 text-xs text-zinc-400">
          <li><span className="text-white">Equipe →</span> membros + evidências vinculadas</li>
          <li><span className="text-white">Pessoa →</span> equipe pai + evidências onde aparece</li>
          <li><span className="text-white">Evidência →</span> todos os Teams e People referenciados</li>
        </ul>
      </div>
    </div>
  ) : (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Canvas Tools</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs font-bold text-white mb-1">✋ Pan Tool</div>
            <p className="text-xs text-zinc-400">Drag the canvas. Also active with middle-click drag in any mode.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs font-bold text-white mb-1">↖ Select Tool</div>
            <p className="text-xs text-zinc-400">Click to select an item and open the Inspector. Drag to move.</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Zoom & Navigation</h4>
        <div className="space-y-2">
          {[
            { action: 'Ctrl + Scroll', desc: 'Zoom in/out (0.2× to 3.0×)' },
            { action: 'Scroll', desc: 'Pan canvas vertically' },
            { action: 'Horizontal Scroll', desc: 'Pan canvas horizontally' },
            { action: '+ / − Buttons', desc: 'Incremental zoom on the bottom bar' },
            { action: 'Middle click + drag', desc: 'Pan in any mode' },
          ].map(r => (
            <div key={r.action} className="flex items-center gap-3 py-1.5">
              <Kbd>{r.action}</Kbd>
              <span className="text-xs text-zinc-400">{r.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Keyboard Shortcuts</h4>
        <div className="space-y-2">
          {[
            { key: 'Ctrl+Z', desc: 'Undo last action' },
            { key: 'Ctrl+Y / Ctrl+Shift+Z', desc: 'Redo undone action' },
            { key: 'Delete / Backspace', desc: 'Delete selected item' },
          ].map(r => (
            <div key={r.key} className="flex items-center gap-3 py-1.5">
              <Kbd>{r.key}</Kbd>
              <span className="text-xs text-zinc-400">{r.desc}</span>
            </div>
          ))}
        </div>
        <Warning>Undo history is session-only (max 50 actions) and does not persist after closing the browser.</Warning>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Moving & Resizing Items</h4>
        <div className="space-y-3 text-sm text-zinc-300">
          <p><strong className="text-white">Move:</strong> In Select mode, drag any item. The 5px threshold prevents accidental drags when clicking.</p>
          <p><strong className="text-white">Resize:</strong> Hover over an item — handles appear on all 4 corners. Drag to resize (minimum size: 20×20px).</p>
          <p><strong className="text-white">Duplicate:</strong> Open the item's Inspector (click to select) and use the Duplicate button.</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Filters & Search</h4>
        <div className="space-y-2 text-xs text-zinc-400">
          <p><span className="text-white font-semibold">🔍 Text search:</span> Filters by title, content, and role (case-insensitive).</p>
          <p><span className="text-white font-semibold">📦 Type filter:</span> Shows only Teams, People, Evidence, or Notes.</p>
          <p><span className="text-white font-semibold">🎭 Sentiment filter:</span> Filters Evidence by Positive, Neutral, or Negative.</p>
        </div>
        <Tip>Combine text search with sentiment filter to quickly locate all negative evidence about a specific team.</Tip>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Hover & Highlighting</h4>
        <p className="text-sm text-zinc-400">Hovering over an item highlights all connected entities:</p>
        <ul className="mt-2 space-y-1 text-xs text-zinc-400">
          <li><span className="text-white">Team →</span> members + linked evidence</li>
          <li><span className="text-white">Person →</span> parent team + evidence where they appear</li>
          <li><span className="text-white">Evidence →</span> all referenced Teams and People</li>
        </ul>
      </div>
    </div>
  );

const SectionConnections = ({ lang }: { lang: string }) =>
  lang === 'pt' ? (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">As conexões são o que alimenta o motor de análise. Quanto mais precisas, mais relevante o diagnóstico.</p>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Tipos de Conexão</h4>
        <div className="space-y-3">
          {[
            { title: 'Pessoa → Equipe (teamId)', color: 'border-l-emerald-500', desc: 'Indica que a pessoa pertence àquela equipe. Definida no campo "Equipe" do Inspetor. Exibida como linha verde no canvas.' },
            { title: 'Evidência → Relator (speakerId)', color: 'border-l-amber-500', desc: 'Indica quem deu o depoimento. Cria automaticamente um cabo âmbar entre a Evidência e a Person. Essencial para o cálculo de contradições dirigidas e gaps de percepção.' },
            { title: 'Evidência → Entidades (linkedEntityIds)', color: 'border-l-indigo-500', desc: 'Vincula a evidência a Teams e People citados. Usado pelo motor analítico para calcular SPOFs, carga cognitiva, contradições e correlações.' },
          ].map(c => (
            <div key={c.title} className={`border-l-2 pl-4 ${c.color}`}>
              <div className="text-sm font-semibold text-white mb-1">{c.title}</div>
              <p className="text-xs text-zinc-400">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Auto-vincular Entidades</h4>
        <p className="text-sm text-zinc-400 mb-3">O Origo detecta automaticamente menções de nomes no conteúdo de evidências. O auto-link roda em dois momentos:</p>
        <div className="space-y-2 mb-3">
          <div className="flex gap-2 text-xs text-zinc-400"><span className="text-indigo-400 shrink-0">→</span><span><strong className="text-white">Ao colar (Ctrl+V):</strong> automaticamente ao soltar o texto no campo de conteúdo da evidência.</span></div>
          <div className="flex gap-2 text-xs text-zinc-400"><span className="text-indigo-400 shrink-0">→</span><span><strong className="text-white">Manual:</strong> botão "Auto-vincular" no Inspetor, para reaplicar após edições.</span></div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 leading-relaxed">
          <span className="text-zinc-500">// Conteúdo colado:</span><br />
          "Roberto e a equipe Core <span className="text-amber-400">precisam</span> resolver o gargalo de deploy..."<br /><br />
          <span className="text-zinc-500">// Resultado automático:</span><br />
          → <span className="text-emerald-400">Roberto Almeida</span> (match de nome)<br />
          → <span className="text-indigo-400">Engenharia Core</span> (match de keyword da equipe)
        </div>
        <Warning>O relator (speakerId) é excluído do linkedEntityIds para evitar auto-referência. Se a pessoa menciona a si mesma na transcrição, não é criado um vínculo duplicado.</Warning>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Transcrições Longas</h4>
        <p className="text-sm text-zinc-400">Clique em "Expandir" para abrir o editor de transcrição em tela cheia. Textos com mais de 500 caracteres são classificados como transcrições e processados com prioridade pelo motor de análise.</p>
        <Warning>Evidências sem nenhum linkedEntityId não contribuem para o cálculo de SPOFs e contradições. Vincule sempre ao entrevistado (speakerId) e às equipes e pessoas mencionadas (linkedEntityIds).</Warning>
      </div>
    </div>
  ) : (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">Connections are what feeds the analysis engine. The more precise they are, the more relevant the diagnostic.</p>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Connection Types</h4>
        <div className="space-y-3">
          {[
            { title: 'Person → Team (teamId)', color: 'border-l-emerald-500', desc: 'Indicates the person belongs to that team. Set in the "Team" field of the Inspector. Shown as a green line on the canvas.' },
            { title: 'Evidence → Speaker (speakerId)', color: 'border-l-amber-500', desc: 'Indicates who gave the testimony. Creates an amber visual cable between the Evidence and the Person. Essential for directed contradiction and perception gap detection.' },
            { title: 'Evidence → Entities (linkedEntityIds)', color: 'border-l-indigo-500', desc: 'Links evidence to cited Teams and People. Used by the engine to calculate SPOFs, cognitive load, contradictions, and correlations.' },
          ].map(c => (
            <div key={c.title} className={`border-l-2 pl-4 ${c.color}`}>
              <div className="text-sm font-semibold text-white mb-1">{c.title}</div>
              <p className="text-xs text-zinc-400">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Auto-link Entities</h4>
        <p className="text-sm text-zinc-400 mb-3">Origo automatically detects name mentions in evidence content. Auto-link runs in two ways:</p>
        <div className="space-y-2 mb-3">
          <div className="flex gap-2 text-xs text-zinc-400"><span className="text-indigo-400 shrink-0">→</span><span><strong className="text-white">On paste (Ctrl+V):</strong> automatically triggered when text is dropped into the evidence content field.</span></div>
          <div className="flex gap-2 text-xs text-zinc-400"><span className="text-indigo-400 shrink-0">→</span><span><strong className="text-white">Manual:</strong> "Auto-link" button in the Inspector, to re-apply after edits.</span></div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 leading-relaxed">
          <span className="text-zinc-500">// Pasted content:</span><br />
          "Roberto and the Core team <span className="text-amber-400">need to</span> fix the deploy bottleneck..."<br /><br />
          <span className="text-zinc-500">// Automatic result:</span><br />
          → <span className="text-emerald-400">Roberto Almeida</span> (name match)<br />
          → <span className="text-indigo-400">Core Engineering</span> (team keyword match)
        </div>
        <Warning>The speaker (speakerId) is excluded from linkedEntityIds to avoid self-reference. If the person mentions themselves in the transcript, no duplicate link is created.</Warning>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Long Transcripts</h4>
        <p className="text-sm text-zinc-400">Click "Expand" to open the full-screen transcript editor. Texts over 500 characters are classified as transcripts and processed with priority by the analysis engine.</p>
        <Warning>Evidence with no linkedEntityIds does not contribute to SPOF and contradiction calculations. Always link to the interviewee (speakerId) and the teams and people mentioned (linkedEntityIds).</Warning>
      </div>
    </div>
  );

const SectionEngine = ({ lang }: { lang: string }) =>
  lang === 'pt' ? (
    <div className="space-y-7">
      <p className="text-sm text-zinc-400">O motor roda 100% localmente no browser, sem IA e sem servidor. Recalcula automaticamente ao modificar o canvas. Todos os resultados ficam disponíveis no painel de Síntese Sistêmica.</p>

      {[
        {
          title: 'SPOF — Ponto Único de Falha',
          color: 'border-red-500/30 bg-red-500/5',
          badges: [{ label: 'SPOF', color: 'bg-red-500/15 border-red-500/40 text-red-400' }],
          desc: 'Identifica pessoas ou equipes que concentram evidências, especialmente negativas. Quanto maior o score, maior o risco de colapso operacional se essa entidade falhar ou sair.',
          algo: [
            'score = (ratio_negativo × 0.5) + (volume_norm × 0.35) + (pontes_cross_team × 0.15)',
            'Threshold: score > 0.3 E total de evidências ≥ 2',
          ],
          output: 'Score 0–1, total de evidências, ratio negativo, equipes em que aparece',
        },
        {
          title: 'Contradição Dirigida — A fala de B vs B fala de A',
          color: 'border-amber-500/30 bg-amber-500/5',
          badges: [{ label: 'Contradição', color: 'bg-amber-500/15 border-amber-500/40 text-amber-400' }],
          desc: 'Detecta quando a pessoa A menciona B com sentimento oposto ao que B expressa ao mencionar A. Indica relação assimétrica: percepções incompatíveis sobre o mesmo vínculo.',
          algo: [
            'Para cada par (A, B): compara sentimento_dominante(A→B) com sentimento_dominante(B→A)',
            'A→B: evidências com speakerId=A e B em linkedEntityIds',
            'ALTA: sentimentos opostos (positivo vs negativo) | MÉDIA: um dos lados é neutro',
          ],
          output: 'Par de pessoas, sentimento de cada direção, severidade, trecho das evidências',
        },
        {
          title: 'Ponto Cego — Se avalia bem, percebido negativamente',
          color: 'border-purple-500/30 bg-purple-500/5',
          badges: [{ label: 'Ponto Cego', color: 'bg-purple-500/15 border-purple-500/40 text-purple-400' }],
          desc: 'A própria entrevista da pessoa tem tom positivo ou neutro, mas outros membros a mencionam com sentimento negativo. A pessoa não enxerga o impacto que causa nos outros.',
          algo: [
            'Self: evidências onde speakerId = essa pessoa',
            'Externo: evidências onde B ∈ linkedEntityIds E speakerId ≠ essa pessoa',
            'PONTO CEGO: self positivo/neutro + externo negativo dominante (mín. 2 ext.)',
          ],
          output: 'Entidade, sentimento self, sentimento externo dominante, breakdown externo, severidade',
        },
        {
          title: 'Gap Inverso — Se avalia mal, percebido positivamente',
          color: 'border-indigo-500/30 bg-indigo-500/5',
          badges: [{ label: 'Gap Inverso', color: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-400' }],
          desc: 'A própria entrevista tem tom negativo — a pessoa se sente sobrecarregada ou desvalorizada — mas outros a mencionam com sentimento positivo. Pode indicar síndrome do impostor.',
          algo: [
            'Self: evidências onde speakerId = essa pessoa',
            'Externo: evidências onde B ∈ linkedEntityIds E speakerId ≠ essa pessoa',
            'GAP INVERSO: self negativo + externo positivo dominante (mín. 2 ext.)',
          ],
          output: 'Entidade, sentimento self, sentimento externo dominante, breakdown externo, severidade',
        },
        {
          title: 'Carga Cognitiva — Sobrecarga por Evidências Negativas',
          color: 'border-orange-500/30 bg-orange-500/5',
          badges: [{ label: 'Crítica', color: 'bg-orange-500/15 border-orange-500/40 text-orange-400' }],
          desc: 'Mede a proporção de problemas (evidências negativas) que recaem sobre cada entidade. Entidades críticas estão absorvendo pressão de múltiplas fontes além das suas próprias.',
          algo: [
            'score = evidências_negativas / max(total_evidências, 1)',
            'CRÍTICA: score > 0.6 E total ≥ 2 | MODERADA: > 0.3 | BAIXA: ≤ 0.3',
          ],
          output: 'Score, nível (critical/moderate/low), contagem de evidências por sentimento',
        },
      ].map(item => (
        <div key={item.title} className={`border rounded-xl overflow-hidden ${item.color}`}>
          <div className="px-4 py-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center gap-2 flex-wrap">
            <div className="text-sm font-bold text-white">{item.title}</div>
            {item.badges.map(b => (
              <span key={b.label} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${b.color}`}>{b.label}</span>
            ))}
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
            <div>
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Algoritmo</div>
              {item.algo.map((a, i) => (
                <div key={i} className="text-[11px] font-mono text-zinc-400 bg-zinc-900 rounded px-2 py-1 mb-1">{a}</div>
              ))}
            </div>
            <div className="text-[10px] text-zinc-600 uppercase tracking-widest">Output: <span className="text-zinc-400 normal-case">{item.output}</span></div>
          </div>
        </div>
      ))}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="text-xs font-bold text-white mb-2">Tags de Diagnóstico nas Entidades</div>
        <p className="text-xs text-zinc-400 mb-3">Cada pessoa ou equipe com padrões detectados recebe tags visuais no canvas:</p>
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border bg-red-500/15 border-red-500/40 text-red-400">SPOF</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border bg-amber-500/15 border-amber-500/40 text-amber-400">Contradição</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border bg-purple-500/15 border-purple-500/40 text-purple-400">Ponto Cego</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border bg-indigo-500/15 border-indigo-500/40 text-indigo-400">Gap Inverso</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border bg-orange-500/15 border-orange-500/40 text-orange-400">Crítica</span>
        </div>
      </div>

      <Tip>O painel "Síntese Sistêmica" exibe todos os padrões detectados. Execute a Síntese com IA para a análise narrativa completa com recomendações estruturais.</Tip>
    </div>
  ) : (
    <div className="space-y-7">
      <p className="text-sm text-zinc-400">The engine runs 100% locally in the browser — no AI, no server. Recalculates automatically when the canvas is modified. All results are available in the Systemic Synthesis panel.</p>

      {[
        {
          title: 'SPOF — Single Point of Failure',
          color: 'border-red-500/30 bg-red-500/5',
          badges: [{ label: 'SPOF', color: 'bg-red-500/15 border-red-500/40 text-red-400' }],
          desc: 'Identifies people or teams that concentrate evidence, especially negative. The higher the score, the greater the risk of operational collapse if that entity fails or leaves.',
          algo: [
            'score = (negative_ratio × 0.5) + (volume_norm × 0.35) + (cross_team_bridges × 0.15)',
            'Threshold: score > 0.3 AND total evidence ≥ 2',
          ],
          output: 'Score 0–1, total evidence, negative ratio, teams where it appears',
        },
        {
          title: 'Directed Contradiction — A speaks about B vs B speaks about A',
          color: 'border-amber-500/30 bg-amber-500/5',
          badges: [{ label: 'Contradiction', color: 'bg-amber-500/15 border-amber-500/40 text-amber-400' }],
          desc: 'Detects when person A mentions B with opposite sentiment to how B expresses when mentioning A. Indicates an asymmetric relationship: incompatible perceptions of the same bond.',
          algo: [
            'For each pair (A, B): compare dominant_sentiment(A→B) with dominant_sentiment(B→A)',
            'A→B: evidences where speakerId=A and B is in linkedEntityIds',
            'HIGH: opposite sentiments (positive vs negative) | MEDIUM: one side is neutral',
          ],
          output: 'Person pair, sentiment per direction, severity, evidence excerpts',
        },
        {
          title: 'Blind Spot — Self-assessed positively, perceived negatively',
          color: 'border-purple-500/30 bg-purple-500/5',
          badges: [{ label: 'Blind Spot', color: 'bg-purple-500/15 border-purple-500/40 text-purple-400' }],
          desc: "The person's own interview has a positive or neutral tone, but other members mention them with negative sentiment. They don't see the impact they have on others.",
          algo: [
            'Self: evidences where speakerId = this person',
            'External: evidences where B ∈ linkedEntityIds AND speakerId ≠ this person',
            'BLIND SPOT: self positive/neutral + external dominant negative (min. 2 ext.)',
          ],
          output: 'Entity, self sentiment, dominant external sentiment, external breakdown, severity',
        },
        {
          title: 'Impostor Gap — Self-assessed negatively, perceived positively',
          color: 'border-indigo-500/30 bg-indigo-500/5',
          badges: [{ label: 'Impostor Gap', color: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-400' }],
          desc: "The person's own interview has a negative tone — they feel overwhelmed or undervalued — but others mention them positively. May indicate impostor syndrome.",
          algo: [
            'Self: evidences where speakerId = this person',
            'External: evidences where B ∈ linkedEntityIds AND speakerId ≠ this person',
            'IMPOSTOR GAP: self negative + external dominant positive (min. 2 ext.)',
          ],
          output: 'Entity, self sentiment, dominant external sentiment, external breakdown, severity',
        },
        {
          title: 'Cognitive Load — Overload by Negative Evidence',
          color: 'border-orange-500/30 bg-orange-500/5',
          badges: [{ label: 'Critical', color: 'bg-orange-500/15 border-orange-500/40 text-orange-400' }],
          desc: 'Measures the proportion of problems (negative evidence) falling on each entity. Critical entities are absorbing pressure from multiple sources beyond their own.',
          algo: [
            'score = negative_evidences / max(total_evidences, 1)',
            'CRITICAL: score > 0.6 AND total ≥ 2 | MODERATE: > 0.3 | LOW: ≤ 0.3',
          ],
          output: 'Score, level (critical/moderate/low), evidence count per sentiment',
        },
      ].map(item => (
        <div key={item.title} className={`border rounded-xl overflow-hidden ${item.color}`}>
          <div className="px-4 py-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center gap-2 flex-wrap">
            <div className="text-sm font-bold text-white">{item.title}</div>
            {item.badges.map(b => (
              <span key={b.label} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${b.color}`}>{b.label}</span>
            ))}
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
            <div>
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Algorithm</div>
              {item.algo.map((a, i) => (
                <div key={i} className="text-[11px] font-mono text-zinc-400 bg-zinc-900 rounded px-2 py-1 mb-1">{a}</div>
              ))}
            </div>
            <div className="text-[10px] text-zinc-600 uppercase tracking-widest">Output: <span className="text-zinc-400 normal-case">{item.output}</span></div>
          </div>
        </div>
      ))}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="text-xs font-bold text-white mb-2">Diagnostic Tags on Entities</div>
        <p className="text-xs text-zinc-400 mb-3">Each person or team with detected patterns receives visual tags on the canvas:</p>
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border bg-red-500/15 border-red-500/40 text-red-400">SPOF</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border bg-amber-500/15 border-amber-500/40 text-amber-400">Contradiction</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border bg-purple-500/15 border-purple-500/40 text-purple-400">Blind Spot</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border bg-indigo-500/15 border-indigo-500/40 text-indigo-400">Impostor Gap</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border bg-orange-500/15 border-orange-500/40 text-orange-400">Critical</span>
        </div>
      </div>

      <Tip>The "Systemic Synthesis" panel displays all detected patterns. Run AI Synthesis for the full narrative analysis with structural recommendations.</Tip>
    </div>
  );

const SectionSynthesis = ({ lang }: { lang: string }) =>
  lang === 'pt' ? (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">A Síntese com IA transforma o grafo de conhecimento em um relatório executivo estruturado. Acesse pelo botão "Síntese Sistêmica" na toolbar.</p>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Pipeline de Dois Estágios</h4>
        <div className="space-y-3">
          {[
            {
              n: '1',
              title: 'Síntese Sistêmica',
              env: 'VITE_SYNTHESIS_API_KEY',
              desc: 'A IA recebe todo o grafo (times, pessoas, evidências) + os resultados pré-calculados do motor local (SPOFs, contradições, carga cognitiva). Produz a análise estrutural profunda em 4 eixos.',
              axes: ['Triangulação de depoimentos', 'Detecção de dissonância cognitiva', 'Análise de topologia e carga', 'Recomendações de reestruturação (To-Be)'],
            },
            {
              n: '2',
              title: 'Relatório Final',
              env: 'VITE_REPORT_API_KEY',
              desc: 'Uma segunda IA formata a síntese em um relatório executivo com seções claras, priorização de ações e matriz de impacto.',
              axes: ['Sumário diagnóstico', 'Achados críticos', 'Mapa de SPOFs', 'Recomendações estruturais', 'Ações imediatas priorizadas'],
            },
          ].map(s => (
            <div key={s.n} className="border border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs flex items-center justify-center font-bold shrink-0">{s.n}</div>
                <div>
                  <div className="text-sm font-bold text-white">{s.title}</div>
                  <code className="text-[10px] text-zinc-500">{s.env}</code>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
              <ul className="space-y-1">
                {s.axes.map(a => <li key={a} className="text-xs text-zinc-500 flex gap-2"><span className="text-indigo-400">·</span>{a}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Provedores Suportados</h4>
        <div className="grid grid-cols-3 gap-2">
          {[
            { p: 'Gemini', models: 'gemini-2.5-pro, gemini-2.5-flash, gemini-2.5-flash-lite', key: 'AIza...' },
            { p: 'Claude', models: 'claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5', key: 'sk-ant-...' },
            { p: 'OpenAI', models: 'gpt-5.4-mini, gpt-5.4-nano, o4-mini', key: 'sk-... / sk-proj-...' },
          ].map(p => (
            <div key={p.p} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
              <div className="text-sm font-bold text-white mb-1">{p.p}</div>
              <p className="text-[10px] text-zinc-500 mb-2">{p.models}</p>
              <code className="text-[10px] text-zinc-600">{p.key}</code>
            </div>
          ))}
        </div>
        <Tip>Você pode usar provedores diferentes nos dois estágios (ex: Gemini para síntese + Claude para o relatório). O provedor é detectado automaticamente pelo prefixo da chave.</Tip>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Configurar Chaves de API</h4>
        <p className="text-sm text-zinc-400 mb-2">Clique no ícone ⚙️ no modal de Síntese para abrir o painel de configuração. Insira sua chave diretamente no campo correspondente ao estágio.</p>
        <Warning>As chaves ficam apenas na memória da sessão do browser e nunca saem do seu dispositivo — as chamadas vão diretamente ao provedor de IA escolhido.</Warning>
      </div>
    </div>
  ) : (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">AI Synthesis transforms the knowledge graph into a structured executive report. Access it via the "Systemic Synthesis" button in the toolbar.</p>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Two-Stage Pipeline</h4>
        <div className="space-y-3">
          {[
            {
              n: '1',
              title: 'Systemic Synthesis',
              env: 'VITE_SYNTHESIS_API_KEY',
              desc: 'The AI receives the full graph (teams, people, evidence) + pre-calculated results from the local engine (SPOFs, contradictions, cognitive load). Produces deep structural analysis across 4 axes.',
              axes: ['Testimony triangulation', 'Cognitive dissonance detection', 'Topology and load analysis', 'Restructuring recommendations (To-Be)'],
            },
            {
              n: '2',
              title: 'Final Report',
              env: 'VITE_REPORT_API_KEY',
              desc: 'A second AI formats the synthesis into an executive report with clear sections, action prioritization, and an impact matrix.',
              axes: ['Diagnostic summary', 'Critical findings', 'SPOF map', 'Structural recommendations', 'Prioritized immediate actions'],
            },
          ].map(s => (
            <div key={s.n} className="border border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs flex items-center justify-center font-bold shrink-0">{s.n}</div>
                <div>
                  <div className="text-sm font-bold text-white">{s.title}</div>
                  <code className="text-[10px] text-zinc-500">{s.env}</code>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
              <ul className="space-y-1">
                {s.axes.map(a => <li key={a} className="text-xs text-zinc-500 flex gap-2"><span className="text-indigo-400">·</span>{a}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Supported Providers</h4>
        <div className="grid grid-cols-3 gap-2">
          {[
            { p: 'Gemini', models: 'gemini-2.5-pro, gemini-2.5-flash, gemini-2.5-flash-lite', key: 'AIza...' },
            { p: 'Claude', models: 'claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5', key: 'sk-ant-...' },
            { p: 'OpenAI', models: 'gpt-5.4-mini, gpt-5.4-nano, o4-mini', key: 'sk-... / sk-proj-...' },
          ].map(p => (
            <div key={p.p} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
              <div className="text-sm font-bold text-white mb-1">{p.p}</div>
              <p className="text-[10px] text-zinc-500 mb-2">{p.models}</p>
              <code className="text-[10px] text-zinc-600">{p.key}</code>
            </div>
          ))}
        </div>
        <Tip>You can use different providers for each stage (e.g. Gemini for synthesis + Claude for report). The provider is detected automatically from the key prefix.</Tip>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Configuring API Keys</h4>
        <p className="text-sm text-zinc-400 mb-2">Click the ⚙️ icon in the Synthesis modal to open the configuration panel. Enter your key directly in the field for each stage.</p>
        <Warning>Keys exist only in the browser session memory and never leave your device — calls go directly to the chosen AI provider.</Warning>
      </div>
    </div>
  );

const SectionFiles = ({ lang }: { lang: string }) =>
  lang === 'pt' ? (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">O Origo salva seus dados localmente. Não há conta, servidor ou sincronização em nuvem.</p>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Operações de Arquivo</h4>
        <div className="space-y-3">
          {[
            { icon: '📄', title: 'Novo Universo', desc: 'Cria um board em branco. Se houver alterações não salvas, o sistema solicita confirmação antes de descartar.' },
            { icon: '📂', title: 'Carregar Disco', desc: 'Abre um arquivo .origo.json salvo anteriormente. Usa a File System Access API quando disponível.' },
            { icon: '💾', title: 'Persistir Dados', desc: 'Salva o board em um arquivo .origo.json. Na primeira vez, abre o diálogo de localização; nas seguintes, salva no mesmo arquivo.' },
          ].map(o => (
            <div key={o.title} className="flex gap-3 items-start bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <span className="text-xl shrink-0">{o.icon}</span>
              <div>
                <div className="text-sm font-semibold text-white mb-1">{o.title}</div>
                <p className="text-xs text-zinc-400 leading-relaxed">{o.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Auto-save & Backup</h4>
        <div className="space-y-2 text-sm text-zinc-400">
          <p>O Origo realiza <strong className="text-white">auto-save automático</strong> no IndexedDB do browser a cada 1 segundo de inatividade após uma mudança.</p>
          <p>Ao abrir o app, se existir uma sessão anterior, ela é restaurada automaticamente — mesmo que o arquivo não tenha sido salvo em disco.</p>
        </div>
        <Warning>O backup do IndexedDB é perdido se o usuário limpar os dados do browser ou trocar de navegador. Salve sempre em disco para garantia.</Warning>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Formato do Arquivo</h4>
        <p className="text-sm text-zinc-400 mb-2">Os arquivos são JSON puros com extensão <code className="text-zinc-300">.origo.json</code>. Estrutura:</p>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 font-mono text-xs text-zinc-400 space-y-1">
          <div>{'{'}</div>
          <div className="pl-4"><span className="text-emerald-400">"id"</span>: "b_xxxxx",</div>
          <div className="pl-4"><span className="text-emerald-400">"title"</span>: "Nome do board",</div>
          <div className="pl-4"><span className="text-emerald-400">"module"</span>: "origo",</div>
          <div className="pl-4"><span className="text-emerald-400">"lastEdited"</span>: 1711800000000,</div>
          <div className="pl-4"><span className="text-emerald-400">"items"</span>: [...]</div>
          <div>{'}'}</div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Renomear o Board</h4>
        <p className="text-sm text-zinc-400">Clique no título do board no cabeçalho do canvas para editar inline. Pressione Enter para confirmar ou Escape para cancelar.</p>
      </div>
    </div>
  ) : (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">Origo saves your data locally. There is no account, server, or cloud sync.</p>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">File Operations</h4>
        <div className="space-y-3">
          {[
            { icon: '📄', title: 'New Universe', desc: 'Creates a blank board. If there are unsaved changes, the system asks for confirmation before discarding.' },
            { icon: '📂', title: 'Load from Disk', desc: 'Opens a previously saved .origo.json file. Uses the File System Access API when available.' },
            { icon: '💾', title: 'Save File', desc: 'Saves the board to a .origo.json file. On first save, opens a location dialog; on subsequent saves, writes to the same file.' },
          ].map(o => (
            <div key={o.title} className="flex gap-3 items-start bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <span className="text-xl shrink-0">{o.icon}</span>
              <div>
                <div className="text-sm font-semibold text-white mb-1">{o.title}</div>
                <p className="text-xs text-zinc-400 leading-relaxed">{o.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Auto-save & Backup</h4>
        <div className="space-y-2 text-sm text-zinc-400">
          <p>Origo performs <strong className="text-white">automatic auto-save</strong> to the browser's IndexedDB every 1 second of inactivity after a change.</p>
          <p>When opening the app, if a previous session exists, it is automatically restored — even if the file was not saved to disk.</p>
        </div>
        <Warning>The IndexedDB backup is lost if the user clears browser data or switches browsers. Always save to disk to be safe.</Warning>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">File Format</h4>
        <p className="text-sm text-zinc-400 mb-2">Files are plain JSON with the <code className="text-zinc-300">.origo.json</code> extension. Structure:</p>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 font-mono text-xs text-zinc-400 space-y-1">
          <div>{'{'}</div>
          <div className="pl-4"><span className="text-emerald-400">"id"</span>: "b_xxxxx",</div>
          <div className="pl-4"><span className="text-emerald-400">"title"</span>: "Board name",</div>
          <div className="pl-4"><span className="text-emerald-400">"module"</span>: "origo",</div>
          <div className="pl-4"><span className="text-emerald-400">"lastEdited"</span>: 1711800000000,</div>
          <div className="pl-4"><span className="text-emerald-400">"items"</span>: [...]</div>
          <div>{'}'}</div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Renaming the Board</h4>
        <p className="text-sm text-zinc-400">Click the board title in the canvas header to edit it inline. Press Enter to confirm or Escape to cancel.</p>
      </div>
    </div>
  );

// ─── main component ────────────────────────────────────────────────────────────

export const Documentation: React.FC<DocumentationProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<string>('what');
  const { t, lang } = useLanguage();

  const SECTIONS: DocSection[] = [
    { id: 'what',        title: t('docSection_what'),        icon: <Book size={18} />,          content: <SectionWhat lang={lang} /> },
    { id: 'entities',    title: t('docSection_entities'),    icon: <Layers size={18} />,        content: <SectionEntities lang={lang} /> },
    { id: 'navigation',  title: t('docSection_navigation'),  icon: <MousePointer2 size={18} />, content: <SectionNavigation lang={lang} /> },
    { id: 'connections', title: t('docSection_connections'), icon: <GitMerge size={18} />,      content: <SectionConnections lang={lang} /> },
    { id: 'engine',      title: t('docSection_engine'),      icon: <Activity size={18} />,      content: <SectionEngine lang={lang} /> },
    { id: 'synthesis',   title: t('docSection_synthesis'),   icon: <SynthesisIcon size={18} />, content: <SectionSynthesis lang={lang} /> },
    { id: 'files',       title: t('docSection_files'),       icon: <FileText size={18} />,      content: <SectionFiles lang={lang} /> },
  ];

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
      <div className="w-[1020px] h-[780px] bg-[#09090b] border border-zinc-800 rounded-2xl shadow-2xl flex overflow-hidden">

        {/* Sidebar Navigation */}
        <div className="w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
          <div className="p-5 border-b border-zinc-800">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Book size={18} className="text-zinc-400" /> {t('documentation')}
            </h2>
            <p className="text-[10px] text-zinc-500 mt-1">{t('docSubtitle')}</p>
          </div>
          <div className="flex-1 py-3 space-y-0.5 overflow-y-auto">
            {SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full px-5 py-2.5 text-left text-sm font-medium flex items-center gap-2.5 transition-colors border-l-2
                  ${activeSection === section.id
                    ? 'bg-zinc-800/60 text-white border-indigo-500'
                    : 'text-zinc-500 hover:text-zinc-300 border-transparent hover:bg-zinc-800/30'
                  }`}
              >
                {React.cloneElement(section.icon as React.ReactElement<any>, { size: 14 })}
                <span className="text-xs">{section.title}</span>
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-zinc-800 text-[10px] text-zinc-600">
            {t('updatedAt')} {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-[#09090b] min-w-0">
          <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-900/30 shrink-0">
            <h3 className="font-bold text-zinc-200 text-sm">
              {SECTIONS.find(s => s.id === activeSection)?.title}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-8">
            {SECTIONS.find(s => s.id === activeSection)?.content}
          </div>
        </div>

      </div>
    </div>
  );
};
