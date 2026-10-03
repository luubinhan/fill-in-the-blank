function normalizeForMatch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^\p{L}\p{N}'\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const previous = new Array<number>(b.length + 1);
  const current = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) previous[j] = j;

  for (let i = 1; i <= a.length; i++) {
    current[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) previous[j] = current[j];
  }

  return previous[b.length];
}

function similarity(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  if (longest === 0) return 0;
  return 1 - levenshtein(a, b) / longest;
}

export function hiddenPhraseMatches(transcript: string, phrase: string, threshold = 0.8): boolean {
  const normalizedPhrase = normalizeForMatch(phrase);
  if (!normalizedPhrase) return false;

  const normalizedTranscript = normalizeForMatch(transcript);
  if (normalizedTranscript.includes(normalizedPhrase)) return true;

  const phraseWords = normalizedPhrase.split(' ');
  const transcriptWords = normalizedTranscript ? normalizedTranscript.split(' ') : [];
  const phraseWordCount = phraseWords.length;
  let best = 0;

  for (const windowLength of [phraseWordCount - 1, phraseWordCount, phraseWordCount + 1]) {
    if (windowLength < 1 || transcriptWords.length < windowLength) continue;
    for (let start = 0; start <= transcriptWords.length - windowLength; start++) {
      const candidate = transcriptWords.slice(start, start + windowLength).join(' ');
      best = Math.max(best, similarity(candidate, normalizedPhrase));
    }
  }

  if (normalizedTranscript.length < normalizedPhrase.length) {
    best = Math.max(best, similarity(normalizedTranscript, normalizedPhrase));
  }

  return best >= threshold;
}
