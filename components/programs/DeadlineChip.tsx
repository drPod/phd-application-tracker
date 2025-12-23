import { Badge } from "@/components/ui/badge";
import { differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

interface DeadlineChipProps {
  deadline: Date;
}

export function DeadlineChip({ deadline }: DeadlineChipProps) {
  const daysUntil = differenceInDays(deadline, new Date());
  
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  let className = "";

  if (daysUntil < 0) {
    variant = "destructive";
  } else if (daysUntil < 15) {
    variant = "destructive";
  } else if (daysUntil < 30) {
    variant = "secondary";
    className = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
  } else {
    variant = "secondary";
    className = "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
  }

  const formatDeadline = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Badge variant={variant} className={cn("font-medium", className)}>
      {daysUntil < 0
        ? `Overdue: ${formatDeadline(deadline)}`
        : daysUntil === 0
        ? "Due today"
        : daysUntil === 1
        ? "Due tomorrow"
        : `${daysUntil} days until ${formatDeadline(deadline)}`}
    </Badge>
  );
}

