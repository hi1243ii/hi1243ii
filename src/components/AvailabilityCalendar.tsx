import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isWithinInterval,
  startOfMonth,
} from "date-fns";

import { cn } from "@/lib/cn";

export interface AvailabilityBlockSummary {
  id: string;
  startDate: string | Date;
  endDate: string | Date;
  reason: "BOOKED" | "MAINTENANCE" | "OWNER_BLOCKED";
}

const REASON_LABEL: Record<AvailabilityBlockSummary["reason"], string> = {
  BOOKED: "Booked",
  MAINTENANCE: "Maintenance",
  OWNER_BLOCKED: "Unavailable",
};

const REASON_CLASS: Record<AvailabilityBlockSummary["reason"], string> = {
  BOOKED: "bg-destructive/10 text-destructive",
  MAINTENANCE: "bg-warning/20 text-warning-foreground",
  OWNER_BLOCKED: "bg-muted text-muted-foreground",
};

/** Read-only single-month availability grid for a listing. */
export function AvailabilityCalendar({
  month = new Date(),
  blocks,
}: {
  month?: Date;
  blocks: AvailabilityBlockSummary[];
}) {
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const leadingBlanks = startOfMonth(month).getDay();

  function blockForDay(day: Date) {
    return blocks.find((block) =>
      isWithinInterval(day, { start: new Date(block.startDate), end: new Date(block.endDate) }),
    );
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">{format(month, "MMMM yyyy")}</p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="py-1 font-semibold text-muted-foreground">
            {d}
          </div>
        ))}
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((day) => {
          const block = blockForDay(day);
          return (
            <div
              key={day.toISOString()}
              title={block ? REASON_LABEL[block.reason] : "Available"}
              className={cn(
                "rounded py-1.5",
                block ? REASON_CLASS[block.reason] : "bg-success/10 text-success",
              )}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-success/10" /> Available
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-destructive/10" /> Booked
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-warning/20" /> Maintenance
        </span>
      </div>
    </div>
  );
}
