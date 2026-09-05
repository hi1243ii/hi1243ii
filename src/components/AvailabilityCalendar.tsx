import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isWithinInterval,
  startOfMonth,
} from "date-fns";

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

const REASON_COLOR: Record<AvailabilityBlockSummary["reason"], string> = {
  BOOKED: "bg-red-100 text-red-700",
  MAINTENANCE: "bg-amber-100 text-amber-700",
  OWNER_BLOCKED: "bg-gray-200 text-gray-600",
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
      isWithinInterval(day, { start: new Date(block.startDate), end: new Date(block.endDate) })
    );
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-700">{format(month, "MMMM yyyy")}</p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="py-1 font-semibold text-gray-400">
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
              className={`rounded py-1.5 ${block ? REASON_COLOR[block.reason] : "bg-green-50 text-green-700"}`}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-green-50" /> Available
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-red-100" /> Booked
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-amber-100" /> Maintenance
        </span>
      </div>
    </div>
  );
}
