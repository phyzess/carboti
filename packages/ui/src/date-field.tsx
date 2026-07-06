import { Field as BaseField } from "@base-ui/react/field";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "./popover";
import { cn } from "./utils";

export type CalendarLabels = {
  nextMonth: string;
  previousMonth: string;
  weekdays?: readonly [string, string, string, string, string, string, string] | undefined;
};

export function DateField(props: {
  className?: string | undefined;
  endMonth?: Date | undefined;
  label: string;
  labels: CalendarLabels;
  locale?: string | undefined;
  name?: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string | undefined;
  startMonth?: Date | undefined;
  value: string;
  weekStartsOn?: 0 | 1 | undefined;
}) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDateValue(props.value);
  const endMonth = props.endMonth ?? new Date(new Date().getFullYear() + 25, 11);
  const label = props.value
    ? formatDateValue(props.value, props.locale)
    : (props.placeholder ?? "Select date");
  const startMonth = props.startMonth ?? new Date(1900, 0);

  return (
    <BaseField.Root className={cn("qitu-form-field", props.className)}>
      <BaseField.Label className="qitu-form-label">{props.label}</BaseField.Label>
      {props.name ? <Input name={props.name} type="hidden" value={props.value} /> : null}
      <PopoverRoot open={open} onOpenChange={(nextOpen: boolean) => setOpen(nextOpen)}>
        <PopoverTrigger className="qitu-field-control qitu-date-trigger" type="button">
          <span className={cn("truncate", !props.value && "text-[var(--qitu-dim)]")}>{label}</span>
          <CalendarDays aria-hidden="true" size={14} />
        </PopoverTrigger>
        <PopoverContent className="qitu-date-popover">
          <Calendar
            captionLayout="dropdown"
            endMonth={endMonth}
            mode="single"
            selected={selectedDate ?? undefined}
            startMonth={startMonth}
            weekStartsOn={props.weekStartsOn}
            onSelect={(date) => {
              if (!date) return;
              props.onChange(dateValue(date));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </PopoverRoot>
    </BaseField.Root>
  );
}

function parseDateValue(value: string | null | undefined): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

function dateValue(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateValue(value: string, locale: string | undefined): string {
  const date = parseDateValue(value);
  if (!date) return value;
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
