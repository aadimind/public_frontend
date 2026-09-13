import { Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

interface CalloutProps { tone: "info" | "warning" | "success"; title?: string; children: ReactNode }
const toneConfig = {
  info: { Icon: Info, className: "border-border bg-bg-subtle", iconClass: "text-fg-muted" },
  warning: { Icon: AlertTriangle, className: "border-warning/30 bg-warning/5", iconClass: "text-warning" },
  success: { Icon: CheckCircle2, className: "border-success/30 bg-success/5", iconClass: "text-success" },
};
export function Callout({ tone, title, children }: CalloutProps) {
  const { Icon, className, iconClass } = toneConfig[tone];
  return <aside className={`my-8 flex min-w-0 gap-4 rounded-lg border p-5 ${className}`} role="note">
    <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconClass}`} aria-hidden />
    <div className="min-w-0 break-words [overflow-wrap:anywhere]">
      {title && <div className="mb-1 break-words text-sm font-semibold text-fg">{title}</div>}
      <div className="text-sm leading-relaxed text-fg-muted">{children}</div>
    </div>
  </aside>;
}
