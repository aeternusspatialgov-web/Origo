// --- PROVIDER TYPES ---

import { tStatic } from '../utils/i18n';

export type AIProvider = 'gemini' | 'claude' | 'openai';

export interface StageConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
}

export interface PipelineConfig {
  ingestion: StageConfig;
  synthesis: StageConfig;
  report: StageConfig;
}

// --- DEFAULT MODELS PER PROVIDER ---

export const DEFAULT_MODELS: Record<AIProvider, string[]> = {
  gemini: [
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-3.1-pro-preview',
    'gemini-3-flash-preview',
  ],
  claude: [
    'claude-sonnet-4-6',
    'claude-opus-4-6',
    'claude-haiku-4-5-20251001',
    'claude-sonnet-4-5',
    'claude-opus-4-5',
  ],
  openai: [
    'gpt-5.4-mini',
    'gpt-5.4-nano',
    'o4-mini',
  ],
};

export type Stage = 'ingestion' | 'synthesis' | 'report';

// --- DETECT PROVIDER FROM API KEY PREFIX ---

export const detectProvider = (apiKey: string): AIProvider | null => {
  if (!apiKey) return null;
  if (apiKey.startsWith('sk-ant-')) return 'claude';
  if (apiKey.startsWith('sk-') || apiKey.startsWith('sk-proj-')) return 'openai';
  if (apiKey.startsWith('AIza')) return 'gemini';
  return null;
};

// --- TIMEOUT FETCH HELPER ---

// --- CALL LLM ---

export const callAI = async (
  prompt: string,
  config: StageConfig,
  systemPrompt?: string,
  signal?: AbortSignal
): Promise<string> => {
  const { provider, model, apiKey } = config;

  if (!apiKey) throw new Error(tStatic('apiKeyNotConfigured'));

  switch (provider) {
    case 'gemini':
      return callGemini(prompt, model, apiKey, signal);
    case 'claude':
      return callClaude(prompt, model, apiKey, systemPrompt, signal);
    case 'openai':
      return callOpenAI(prompt, model, apiKey, systemPrompt, signal);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
};

// --- GEMINI ---

const callGemini = async (
  prompt: string,
  model: string,
  apiKey: string,
  signal?: AbortSignal
): Promise<string> => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 },
      }),
      signal,
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Gemini error: ${err?.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

// --- CLAUDE ---

const callClaude = async (
  prompt: string,
  model: string,
  apiKey: string,
  systemPrompt?: string,
  signal?: AbortSignal
): Promise<string> => {
  const messages: any[] = [{ role: 'user', content: prompt }];

  const body: any = {
    model,
    max_tokens: 32000,
    messages,
  };

  if (systemPrompt) body.system = systemPrompt;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Claude error: ${err?.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data?.content?.[0]?.text || '';
};

// --- OPENAI ---

// O-series reasoning models: no temperature support
const OPENAI_REASONING_PREFIXES = ['o1', 'o3', 'o4'];

const isReasoningModel = (model: string): boolean =>
  OPENAI_REASONING_PREFIXES.some(prefix => model.startsWith(prefix));

// --- OPENAI CHAT COMPLETIONS (v1/chat/completions) ---
// Used by: gpt-5.4-mini, gpt-5.4-nano, o4-mini, and most models

const callOpenAIChatCompletions = async (
  prompt: string,
  model: string,
  apiKey: string,
  systemPrompt?: string,
  signal?: AbortSignal
): Promise<string> => {
  const messages: any[] = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });

  const reasoning = isReasoningModel(model);

  const body: any = {
    model,
    messages,
    max_completion_tokens: 100000,
  };

  // O-series reasoning models do not support temperature
  if (!reasoning) {
    body.temperature = 0.2;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`OpenAI error: ${err?.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
};

// --- OPENAI ROUTER ---

const callOpenAI = async (
  prompt: string,
  model: string,
  apiKey: string,
  systemPrompt?: string,
  signal?: AbortSignal
): Promise<string> => {
  return callOpenAIChatCompletions(prompt, model, apiKey, systemPrompt, signal);
};
