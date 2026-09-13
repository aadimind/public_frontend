import type { ContentBlock } from "@/types";
import { isExternalUrl, safeHref } from "@/lib/url";
import { MathBlock } from "./MathBlock";
import { CodeBlock } from "./CodeBlock";
import { Figure } from "./Figure";
import { Diagram } from "./Diagram";
import { Table } from "./Table";
import { Quote } from "./Quote";
import { Callout } from "./Callout";
import { Citation } from "./Citation";

interface ContentRendererProps { blocks: ContentBlock[] }
export function ContentRenderer({ blocks }: ContentRendererProps) {
  return <div className="prose-paper">{blocks.map((block, i) => <BlockRenderer key={i} block={block} />)}</div>;
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph": return <p>{renderInline(block.text)}</p>;
    case "heading": { const Tag = `h${block.level}` as "h2" | "h3" | "h4"; return <Tag id={block.id}>{block.text}</Tag>; }
    case "list": return block.ordered ? <ol>{block.items.map((item, i) => <li key={i}>{renderInline(item)}</li>)}</ol> : <ul>{block.items.map((item, i) => <li key={i}>{renderInline(item)}</li>)}</ul>;
    case "math": return <MathBlock tex={block.tex} display={block.display} />;
    case "code": return <CodeBlock code={block.code} language={block.language} />;
    case "quote": return <Quote text={block.text} attribution={block.attribution} />;
    case "figure": return <Figure src={block.src} alt={block.alt} caption={block.caption} />;
    case "diagram": return <Diagram variant={block.variant} caption={block.caption} title={block.variant === "architecture" ? "Architecture" : undefined} data={block.data} />;
    case "table": return <Table headers={block.headers} rows={block.rows} caption={block.caption} />;
    case "callout": return <Callout tone={block.tone} title={block.title}>{renderInline(block.text)}</Callout>;
    case "citations": return <Citation items={block.items} />;
    default: return null;
  }
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  const patterns: Array<{ regex: RegExp; render: (match: RegExpExecArray) => React.ReactNode }> = [
    { regex: /\$([^$]+)\$/g, render: (m) => <MathBlock key={`m-${key++}`} tex={m[1]} display="inline" /> },
    { regex: /`([^`]+)`/g, render: (m) => <code key={`c-${key++}`}>{m[1]}</code> },
    { regex: /\*\*([^*]+)\*\*/g, render: (m) => <strong key={`b-${key++}`}>{m[1]}</strong> },
    { regex: /\*([^*]+)\*/g, render: (m) => <em key={`i-${key++}`}>{m[1]}</em> },
    { regex: /\[([^\]]+)\]\(([^)]+)\)/g, render: (m) => { const href = safeHref(m[2]); const external = isExternalUrl(href); return <a key={`l-${key++}`} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{m[1]}</a>; } },
  ];
  while (remaining.length > 0) {
    let earliest: { index: number; match: RegExpExecArray; render: (m: RegExpExecArray) => React.ReactNode } | null = null;
    for (const p of patterns) { p.regex.lastIndex = 0; const m = p.regex.exec(remaining); if (m && (earliest === null || m.index < earliest.index)) earliest = { index: m.index, match: m, render: p.render }; }
    if (!earliest) { parts.push(remaining); break; }
    if (earliest.index > 0) parts.push(remaining.slice(0, earliest.index));
    parts.push(earliest.render(earliest.match));
    remaining = remaining.slice(earliest.index + earliest.match[0].length);
  }
  return parts;
}
