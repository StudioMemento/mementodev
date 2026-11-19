import type { CSSProperties } from "react";

type Props = { id: string; text: string; splitAfter?: number };

/** Distribute the actual glyphs between the same gutters as the menu. */
export function SpreadTitle({ id, text, splitAfter }: Props) {
  const words = text.trim().split(/\s+/);
  const lines = splitAfter ? [words.slice(0, splitAfter).join(" "), words.slice(splitAfter).join(" ")] : [text];
  const letters = Array.from(text);
  const style = { "--letters": letters.length, "--line-letters": Math.max(...lines.map(line => Array.from(line).length)) } as CSSProperties;
  return <h2 id={id} className="spread-title" aria-label={text} style={style}>
    <span className="spread-ink" aria-hidden="true">
      {lines.map((line, row) => <span className="spread-line" key={row}>
        {row > 0 && <span className="spread-break"> </span>}
        {Array.from(line).map((char, i) => <span className={char === " " ? "spread-space" : undefined} key={i}>{char}</span>)}
      </span>)}
    </span>
  </h2>;
}
