export type Token = { text: string; kind?: "str" | "kw" | "tag" | "num" | "fn" };

const RE = /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(export|default|function|const|let|var|return|await|async|if|elif|else|def|try|catch|throw|true|false|null|None|import|from|type|new|class|for|of|in)\b|(<\/?[A-Z]\w*|\/>)|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)(?=\s*\()/g;

/** Splits one line of JS/TS/Python into coloured tokens. Small on purpose: display only. */
export function highlight(line: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const m of line.matchAll(RE)) {
    if (m.index! > last) out.push({ text: line.slice(last, m.index) });
    out.push({ text: m[0], kind: m[1] ? "str" : m[2] ? "kw" : m[3] ? "tag" : m[4] ? "num" : "fn" });
    last = m.index! + m[0].length;
  }
  if (last < line.length) out.push({ text: line.slice(last) });
  return out;
}
