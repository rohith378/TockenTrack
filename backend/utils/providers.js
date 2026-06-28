require('dotenv').config();
const Groq = require('groq-sdk');
const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const PRICING = {
  'Groq Llama 3.3':     { provider: 'groq',      in: 0.00059,  out: 0.00079 },
  'GPT-4o':             { provider: 'openai',    in: 0.005,    out: 0.015   },
  'GPT-4o Mini':        { provider: 'openai',    in: 0.00015,  out: 0.0006  },
  'Claude 3.5 Sonnet':  { provider: 'anthropic', in: 0.003,    out: 0.015   },
  'Claude 3.5 Haiku':   { provider: 'anthropic', in: 0.0008,   out: 0.004   },
  'Gemini 1.5 Pro':     { provider: 'gemini',    in: 0.00125,  out: 0.005   },
  'Gemini 1.5 Flash':   { provider: 'gemini',    in: 0.000075, out: 0.0003  },
};

function getPricing(model) { return PRICING[model]; }

async function callGroq(apiKey, prompt) {
  const groq = new Groq({ apiKey });
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
  });
  return {
    text: completion.choices[0]?.message?.content || '',
    inputTokens: completion.usage.prompt_tokens,
    outputTokens: completion.usage.completion_tokens,
  };
}

async function callOpenAI(apiKey, prompt, model) {
  const openai = new OpenAI({ apiKey });
  const modelId = model === 'GPT-4o Mini' ? 'gpt-4o-mini' : 'gpt-4o';
  const completion = await openai.chat.completions.create({
    model: modelId,
    messages: [{ role: 'user', content: prompt }],
  });
  return {
    text: completion.choices[0]?.message?.content || '',
    inputTokens: completion.usage.prompt_tokens,
    outputTokens: completion.usage.completion_tokens,
  };
}

async function callAnthropic(apiKey, prompt, model) {
  const anthropic = new Anthropic({ apiKey });
  const modelId = model === 'Claude 3.5 Haiku' ? 'claude-3-5-haiku-20241022' : 'claude-3-5-sonnet-20241022';
  const msg = await anthropic.messages.create({
    model: modelId, max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });
  return {
    text: msg.content[0]?.text || '',
    inputTokens: msg.usage.input_tokens,
    outputTokens: msg.usage.output_tokens,
  };
}

async function callGemini(apiKey, prompt, model) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelId = model === 'Gemini 1.5 Flash' ? 'gemini-1.5-flash' : 'gemini-1.5-pro';
  const genModel = genAI.getGenerativeModel({ model: modelId });
  const result = await genModel.generateContent(prompt);
  const usage = result.response.usageMetadata;
  return {
    text: result.response.text(),
    inputTokens: usage?.promptTokenCount || 0,
    outputTokens: usage?.candidatesTokenCount || 0,
  };
}

async function callProvider(model, apiKeys, prompt) {
  const pricing = getPricing(model);
  if (!pricing) throw new Error(`Unknown model: ${model}`);
  const provider = pricing.provider;

  // User's saved key takes priority → fall back to server .env key
  const envKeys = {
    groq:      process.env.GROQ_API_KEY,
    openai:    process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    gemini:    process.env.GEMINI_API_KEY,
  };
  const key = (apiKeys && apiKeys[provider]) || envKeys[provider];

  if (!key) throw new Error(
    `No API key for ${provider}. Add one in Settings → API Keys, or set ${provider.toUpperCase()}_API_KEY in backend/.env`
  );

  switch (provider) {
    case 'groq':      return { ...(await callGroq(key, prompt)),              provider, pricing };
    case 'openai':    return { ...(await callOpenAI(key, prompt, model)),     provider, pricing };
    case 'anthropic': return { ...(await callAnthropic(key, prompt, model)), provider, pricing };
    case 'gemini':    return { ...(await callGemini(key, prompt, model)),     provider, pricing };
    default: throw new Error('Unsupported provider');
  }
}

module.exports = { callProvider, getPricing, PRICING };
