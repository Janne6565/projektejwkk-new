const SGA_MAP: Record<string, string> = {
  A: 'ᔑ', B: 'ʖ', C: 'ᓵ', D: '↸', E: 'ᒷ', F: '⎓', G: '⊣', H: '⍑',
  I: '╎', J: '⋮', K: 'ꖌ', L: 'ꖎ', M: 'ᒲ', N: 'リ', O: '𝙹', P: '!¡',
  Q: 'ᑑ', R: '∷', S: 'ᓭ', T: 'ℸ', U: '⚍', V: '⍊', W: '∴', X: '̇/',
  Y: 'ǁ', Z: '⨅',
};

export function toRoman(n: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) {
      result += syms[i];
      n -= vals[i];
    }
  }
  return result;
}

export function toSGA(text: string): string {
  const MARKER_START = '\x01';
  const MARKER_END = '\x02';
  const romanized = text.replace(/\d+/g, (match) =>
    `${MARKER_START}${toRoman(Number(match))}${MARKER_END}`,
  );
  let inRoman = false;
  return romanized
    .split('')
    .map((ch) => {
      if (ch === MARKER_START) { inRoman = true; return ''; }
      if (ch === MARKER_END) { inRoman = false; return ''; }
      if (inRoman) return ch;
      return SGA_MAP[ch.toUpperCase()] ?? ch;
    })
    .join('');
}
