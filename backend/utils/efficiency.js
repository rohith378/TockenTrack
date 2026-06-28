function gradePrompt(inputTokens) {
  if (inputTokens < 150)  return 'A+';
  if (inputTokens < 400)  return 'A';
  if (inputTokens < 1000) return 'B+';
  if (inputTokens < 2500) return 'B';
  if (inputTokens < 5000) return 'C';
  return 'D';
}

function generateSuggestions(prompt, inputTokens, outputTokens) {
  const suggestions = [];
  const lower = prompt.toLowerCase();
  const words = prompt.trim().split(/\s+/);
  const sentences = prompt.split(/[.!?]+/).filter(Boolean);

  // Long prompt
  if (inputTokens > 1000) {
    suggestions.push('Reduce context length — your prompt is in the top 10% by size');
  }

  // Repeated words/instructions (naive duplicate sentence detection)
  const seen = new Set();
  let hasDuplicates = false;
  sentences.forEach(s => {
    const key = s.trim().toLowerCase();
    if (key.length > 8 && seen.has(key)) hasDuplicates = true;
    seen.add(key);
  });
  if (hasDuplicates) {
    suggestions.push('Remove repeated instructions — duplicate sentences detected');
  }

  // No structured output requested but output is long
  if (outputTokens > 400 && !lower.includes('json') && !lower.includes('bullet') && !lower.includes('list') && !lower.includes('table')) {
    suggestions.push('Use a structured output format (JSON/bullets) to reduce verbose responses');
  }

  // Vague prompt (very short, no specifics)
  if (words.length < 5) {
    suggestions.push('Add more specificity — very short prompts often need follow-up clarification');
  }

  // Multi-task prompt detection
  const taskMarkers = ['and also', 'additionally', 'then also', 'as well as'];
  if (taskMarkers.some(m => lower.includes(m)) || (lower.match(/\?/g) || []).length > 2) {
    suggestions.push('Split multi-task prompts into separate calls for better focus and lower cost');
  }

  // Excessive politeness / filler
  const filler = ['please kindly', 'i was wondering if', 'could you possibly', 'if you don\'t mind'];
  if (filler.some(f => lower.includes(f))) {
    suggestions.push('Remove conversational filler — direct instructions use fewer tokens');
  }

  // Good prompt — no issues found
  if (suggestions.length === 0) {
    suggestions.push('Well-optimized prompt — no major efficiency issues detected');
  }

  return suggestions.slice(0, 4); // cap at 4
}

module.exports = { gradePrompt, generateSuggestions };
