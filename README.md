# Origo

Origo e uma ferramenta de diagnostico organizacional `local-first` para mapear equipes, pessoas e evidencias em um canvas infinito.

Ele foi pensado para contextos em que entender a operacao real importa mais do que olhar apenas para o organograma: reestruturacoes, entrevistas de discovery, consultoria organizacional, leitura de gargalos entre areas e investigacao de dependencias criticas.

## O que o Origo faz

- Mapeia equipes, pessoas, evidencias e notas em um board visual.
- Permite colar transcricoes, depoimentos e sinais operacionais no proprio canvas.
- Relaciona entidades para formar um grafo organizacional navegavel.
- Roda um motor de correlacao local para detectar padroes estruturais.
- Oferece uma camada opcional de sintese com IA para analise narrativa e relatorio executivo.
- Salva a sessao localmente no navegador e tambem permite exportar e importar arquivos do board.

## Principais recursos

- Canvas infinito com pan, zoom, selecao, drag, resize e conexoes entre entidades.
- Tipos de item para `TEAM`, `PERSON`, `EVIDENCE` e `NOTE`.
- Motor analitico local para identificar SPOFs, contradicoes dirigidas, gaps de percepcao, sobrecarga cognitiva e atritos entre areas.
- Sintese Sistemica opcional com provedores de IA configuraveis.
- Interface em portugues e ingles.
- Documentacao tecnica integrada no proprio app.

## Persistencia local

O Origo foi construido com uma abordagem `local-first`.

- A sessao ativa e persistida localmente no navegador via `IndexedDB`.
- Ao recarregar a pagina, o app tenta restaurar a ultima sessao automaticamente.
- O board tambem pode ser salvo manualmente em arquivo.
- O app aceita arquivos `.origo` e `.json`, com sugestao de nome em `.origo`.
- Em navegadores compativeis, o Origo usa a `File System Access API` para abrir e salvar diretamente no disco.
- Quando essa API nao esta disponivel, o app usa fallback de download e upload para preservar compatibilidade.

## IA opcional

O nucleo analitico do Origo funciona sem backend e sem IA.

A camada de IA e opcional e usada para transformar o grafo e os achados locais em uma analise narrativa mais profunda.

Hoje o app oferece suporte a:

- `Gemini`
- `Claude`
- `OpenAI`

As chaves sao inseridas diretamente na interface da funcionalidade de `Sintese Sistemica`, e as requisicoes sao feitas do navegador para o provedor escolhido.

## Stack

- `React 19`
- `TypeScript`
- `Vite`
- `D3`
- `IndexedDB`
- `File System Access API` quando disponivel

## Rodando localmente

### Pre-requisitos

- `Node.js`
- `npm`

### Instalacao

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Com o servidor em execucao:

- landing page: `http://localhost:3000/`
- app: `http://localhost:3000/app/`

## Scripts disponiveis

```bash
npm run dev
```

Inicia o ambiente de desenvolvimento com Vite.

```bash
npm run lint
```

Executa a checagem de tipos com TypeScript.

```bash
npm run build
```

Gera o build de producao.

```bash
npm run preview
```

Sobe uma previa local do build gerado.

## Estrutura do projeto

```text
.
|- app/                # entrada HTML do app
|- components/         # UI e camadas do canvas
|- hooks/              # interacao, persistencia e estado
|- services/           # integracoes e camada de IA
|- utils/              # motor analitico, storage, i18n e helpers
|- index.html          # landing page
|- index.tsx           # bootstrap principal
`- vite.config.ts      # configuracao do build
```

## Observacoes importantes

- O board demo incluido no projeto e sintetico e serve para demonstracao do fluxo analitico do Origo.
- O app nao depende de servidor para a experiencia principal.
- O build atual gera duas entradas: a landing em `/` e a aplicacao em `/app/`.
