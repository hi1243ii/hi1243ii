import { format } from "date-fns";
import { ClipboardCheck, Wrench, Cog } from "lucide-react";

const TYPE_META = {
  INSPECTION: { label: "Inspection", icon: ClipboardCheck },
  REPAIR: { label: "Repair", icon: Wrench },
  ROUTINE_SERVICE: { label: "Routine service", icon: Cog },
} as const;

export interface MaintenanceLogEntrySummary {
  id: string;
  type: keyof typeof TYPE_META;
  description: string;
  performedBy: string | null;
  performedAt: string | Date;
}

export function MaintenanceLog({ entries }: { entries: MaintenanceLogEntrySummary[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No maintenance history on file yet.</p>;
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime(),
  );

  return (
    <ul className="flex flex-col gap-3">
      {sorted.map((entry) => {
        const meta = TYPE_META[entry.type];
        const Icon = meta.icon;
        return (
          <li key={entry.id} className="flex gap-3 rounded-lg border border-border bg-card p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
              <Icon className="h-4 w-4" aria-hidden />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{meta.label}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(entry.performedAt), "MMM d, yyyy")}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{entry.description}</p>
              {entry.performedBy && (
                <p className="mt-1 text-xs text-muted-foreground">By {entry.performedBy}</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
