import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import { es } from "date-fns/locale";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={es}
      navLayout="after"
      showOutsideDays={showOutsideDays}
      fixedWeeks={true}
      className={cn("p-3", className)}
      classNames={{
        month: "flex flex-col items-center capitalize",
        nav: "flex justify-between items-center w-full mb-2",
        month_caption: "text-sm font-medium text-center absolute top-4",
        weekdays: "text-xs text-muted-foreground font-normal flex justify-between items-center text-center",
        button_next: cn(
          buttonVariants({ variant: "outline", size: "sm", className: "size-8" })
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "sm", className: "size-8" })
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        range_end: "day-range-end",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };