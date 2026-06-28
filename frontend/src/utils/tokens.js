export const MODELS = [
  { key: 'Groq Llama 3.3',   provider: 'groq',      label: 'Groq Llama 3.3',    color: '#8b5cf6', in: 0.00059,  out: 0.00079, free: true  },
  { key: 'GPT-4o',            provider: 'openai',    label: 'GPT-4o',            color: '#10a37f', in: 0.005,    out: 0.015,   free: false },
  { key: 'GPT-4o Mini',       provider: 'openai',    label: 'GPT-4o Mini',       color: '#34d399', in: 0.00015,  out: 0.0006,  free: false },
  { key: 'Claude 3.5 Sonnet', provider: 'anthropic', label: 'Claude 3.5 Sonnet', color: '#d97706', in: 0.003,    out: 0.015,   free: false },
  { key: 'Claude 3.5 Haiku',  provider: 'anthropic', label: 'Claude 3.5 Haiku',  color: '#fbbf24', in: 0.0008,   out: 0.004,   free: false },
  { key: 'Gemini 1.5 Pro',    provider: 'gemini',    label: 'Gemini 1.5 Pro',    color: '#3b82f6', in: 0.00125,  out: 0.005,   free: false },
  { key: 'Gemini 1.5 Flash',  provider: 'gemini',    label: 'Gemini 1.5 Flash',  color: '#60a5fa', in: 0.000075, out: 0.0003,  free: false },
];

export const PROVIDERS = [
  { key: 'groq',      label: 'Groq',      color: '#8b5cf6', signupUrl: 'https://console.groq.com',          free: true  },
  { key: 'openai',    label: 'OpenAI',    color: '#10a37f', signupUrl: 'https://platform.openai.com/api-keys', free: false },
  { key: 'anthropic', label: 'Anthropic', color: '#d97706', signupUrl: 'https://console.anthropic.com',     free: false },
  { key: 'gemini',    label: 'Gemini',    color: '#3b82f6', signupUrl: 'https://aistudio.google.com/apikey', free: false },
];

export const MODEL_MAP = Object.fromEntries(MODELS.map(m => [m.key, m]));
export const PROVIDER_MAP = Object.fromEntries(PROVIDERS.map(p => [p.key, p]));

export function calcCost(model, inputTokens, outputTokens) {
  const m = MODEL_MAP[model];
  if (!m) return 0;
  return (inputTokens / 1000) * m.in + (outputTokens / 1000) * m.out;
}

export function approxTokens(text) {
  return Math.max(1, Math.round(text.trim().split(/\s+/).filter(Boolean).length * 1.35));
}

export function gradePrompt(inputTokens) {
  if (inputTokens < 150)  return 'A+';
  if (inputTokens < 400)  return 'A';
  if (inputTokens < 1000) return 'B+';
  if (inputTokens < 2500) return 'B';
  if (inputTokens < 5000) return 'C';
  return 'D';
}

export function gradeColor(grade) {
  const map = { 'A+': '#10b981', 'A': '#34d399', 'B+': '#60a5fa', 'B': '#93c5fd', 'C': '#fbbf24', 'D': '#f87171' };
  return map[grade] || '#94a3b8';
}

export function formatTokens(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return (n || 0).toString();
}

export function formatCost(n) {
  n = n || 0;
  if (n < 0.001) return '$' + n.toFixed(6);
  if (n < 0.01)  return '$' + n.toFixed(5);
  return '$' + n.toFixed(4);
}

export function formatDate(d) {
  return new Date(d).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
