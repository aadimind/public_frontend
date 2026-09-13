import type { ComparisonDiagramData, DiagramVariant, PipelineDiagramData } from "@/types";

interface DiagramProps {
  variant: DiagramVariant;
  caption?: string;
  title?: string;
  data?: PipelineDiagramData | ComparisonDiagramData;
}

export function Diagram({ variant, caption, title, data }: DiagramProps) {
  return (
    <figure className="my-8 overflow-hidden rounded-lg border border-border bg-bg-subtle">
      <div className="overflow-x-auto px-3 py-5 sm:px-4 sm:py-6" role="img" aria-label={title ?? `${variant} diagram`}>
        <div className="min-w-0 sm:min-w-[480px]">
          <DiagramContent variant={variant} title={title} data={data} />
        </div>
      </div>
      {caption && <figcaption className="break-words border-t border-border bg-bg px-4 py-3 text-center text-sm text-fg-muted">{caption}</figcaption>}
    </figure>
  );
}

function DiagramContent({ variant, title, data }: DiagramProps) {
  if (variant === "architecture") return <ArchitectureDiagram title={title} />;
  if (variant === "pipeline") return <PipelineDiagram title={title} data={data} />;
  if (variant === "flow") return <FlowDiagram title={title} />;
  if (variant === "comparison") return <ComparisonDiagram title={title} data={data} />;
  return <ConceptMap title={title} />;
}

function DiagramFrame({ title, children }: { title?: string; children: React.ReactNode }) {
  return <div>{title && <div className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-fg-subtle">{title}</div>}<div className="flex justify-center">{children}</div></div>;
}

function ArchitectureDiagram({ title }: { title?: string }) {
  return <DiagramFrame title={title}><svg viewBox="0 0 640 240" className="h-auto w-full max-w-2xl min-w-[560px]" xmlns="http://www.w3.org/2000/svg" aria-hidden><g fill="none" stroke="currentColor" strokeWidth="1.5" className="text-fg-muted"><rect x="20" y="90" width="100" height="60" rx="6" /><text x="70" y="125" textAnchor="middle" fill="currentColor" className="text-xs" fontFamily="Inter">Input</text><rect x="170" y="60" width="120" height="120" rx="6" /><text x="230" y="115" textAnchor="middle" fill="currentColor" className="text-xs" fontFamily="Inter">Encoder</text><text x="230" y="135" textAnchor="middle" fill="currentColor" className="text-[10px]" fontFamily="Inter">Self-Attention</text><rect x="340" y="60" width="120" height="120" rx="6" /><text x="400" y="115" textAnchor="middle" fill="currentColor" className="text-xs" fontFamily="Inter">Decoder</text><text x="400" y="135" textAnchor="middle" fill="currentColor" className="text-[10px]" fontFamily="Inter">Cross-Attention</text><rect x="510" y="90" width="100" height="60" rx="6" /><text x="560" y="125" textAnchor="middle" fill="currentColor" className="text-xs" fontFamily="Inter">Output</text><line x1="120" y1="120" x2="170" y2="120" /><line x1="290" y1="120" x2="340" y2="120" /><line x1="460" y1="120" x2="510" y2="120" /><line x1="400" y1="60" x2="230" y2="180" strokeDasharray="3,3" /></g></svg></DiagramFrame>;
}

function PipelineDiagram({ title, data }: { title?: string; data?: PipelineDiagramData | ComparisonDiagramData }) {
  const steps = data && "steps" in data ? data.steps : ["Encode", "Process", "Decode", "Output"];
  return <DiagramFrame title={title}><div className="flex min-w-max flex-col items-stretch gap-2 sm:flex-row sm:items-center">{steps.map((step, i) => <div key={`${step}-${i}`} className="flex items-center gap-2"><div className="min-w-[7rem] rounded-md border border-border bg-bg px-4 py-2 text-center text-sm font-medium text-fg break-words">{step}</div>{i < steps.length - 1 && <svg className="mx-auto h-3 w-6 shrink-0 rotate-90 sm:rotate-0" viewBox="0 0 24 12" fill="none" aria-hidden><path d="M0 6 H18 M14 2 L18 6 L14 10" stroke="currentColor" strokeWidth="1.5" className="text-fg-muted" /></svg>}</div>)}</div></DiagramFrame>;
}

function FlowDiagram({ title }: { title?: string }) {
  return <DiagramFrame title={title}><svg viewBox="0 0 480 160" className="h-auto w-full max-w-md min-w-[440px]" aria-hidden><g fill="none" stroke="currentColor" strokeWidth="1.5" className="text-fg-muted"><ellipse cx="80" cy="80" rx="60" ry="30" /><text x="80" y="84" textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="Inter">Start</text><rect x="190" y="50" width="120" height="60" rx="6" /><text x="250" y="84" textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="Inter">Decision</text><ellipse cx="400" cy="80" rx="60" ry="30" /><text x="400" y="84" textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="Inter">End</text><path d="M140 80 L190 80 M310 80 L340 80 M250 110 L250 130 L80 130 L80 110" /></g></svg></DiagramFrame>;
}

function ComparisonDiagram({ title, data }: { title?: string; data?: PipelineDiagramData | ComparisonDiagramData }) {
  const labels = data && "labels" in data ? data.labels : ["Before", "After"];
  const descriptions = data && "descriptions" in data ? data.descriptions : ["Sequential processing", "Parallel processing"];
  return <DiagramFrame title={title}><div className="grid w-full max-w-xl gap-3 sm:grid-cols-2 sm:gap-4">{labels.slice(0, 2).map((label, i) => <div key={`${label}-${i}`} className="min-w-0 rounded-md border border-border bg-bg p-4"><div className="break-words text-xs font-semibold uppercase tracking-wider text-fg-subtle">{label}</div><div className="mt-2 break-words text-sm text-fg">{descriptions[i] ?? ""}</div></div>)}</div></DiagramFrame>;
}

function ConceptMap({ title }: { title?: string }) {
  return <DiagramFrame title={title}><svg viewBox="0 0 480 200" className="h-auto w-full max-w-md min-w-[440px]" aria-hidden><g fill="none" stroke="currentColor" strokeWidth="1.5" className="text-fg-muted"><line x1="240" y1="100" x2="120" y2="50" /><line x1="240" y1="100" x2="360" y2="50" /><line x1="240" y1="100" x2="120" y2="150" /><line x1="240" y1="100" x2="360" y2="150" /><circle cx="240" cy="100" r="30" fill="currentColor" className="text-bg" /><text x="240" y="104" textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="Inter">Core</text><circle cx="120" cy="50" r="24" fill="currentColor" className="text-bg" /><text x="120" y="54" textAnchor="middle" fill="currentColor" fontSize="10" fontFamily="Inter">Idea 1</text><circle cx="360" cy="50" r="24" fill="currentColor" className="text-bg" /><text x="360" y="54" textAnchor="middle" fill="currentColor" fontSize="10" fontFamily="Inter">Idea 2</text><circle cx="120" cy="150" r="24" fill="currentColor" className="text-bg" /><text x="120" y="154" textAnchor="middle" fill="currentColor" fontSize="10" fontFamily="Inter">Idea 3</text><circle cx="360" cy="150" r="24" fill="currentColor" className="text-bg" /><text x="360" y="154" textAnchor="middle" fill="currentColor" fontSize="10" fontFamily="Inter">Idea 4</text></g></svg></DiagramFrame>;
}
