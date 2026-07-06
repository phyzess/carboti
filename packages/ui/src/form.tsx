import { Field as BaseField } from "@base-ui/react/field";
import type { ChangeEvent, ComponentProps } from "react";
import { Input as RegistryInput } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { cn } from "./utils";

export type InputProps = ComponentProps<typeof RegistryInput>;
export { RegistryInput as Input };

export function TextField(props: {
  className?: string | undefined;
  label: string;
  onChange: (value: string) => void;
  type?: string | undefined;
  value: string;
}) {
  return (
    <BaseField.Root className={cn("qitu-form-field", props.className)}>
      <BaseField.Label className="qitu-form-label">{props.label}</BaseField.Label>
      <RegistryInput
        type={props.type ?? "text"}
        value={props.value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          props.onChange(event.currentTarget.value)
        }
      />
    </BaseField.Root>
  );
}

export function SelectField(props: {
  className?: string | undefined;
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <BaseField.Root className={cn("qitu-form-field", props.className)}>
      <BaseField.Label className="qitu-form-label">{props.label}</BaseField.Label>
      <Select
        items={props.options}
        modal={false}
        value={props.value}
        onValueChange={(value) => {
          if (value !== null) props.onChange(String(value));
        }}
      >
        <SelectTrigger className="qitu-field-control qitu-select-trigger">
          <SelectValue>
            {(value) =>
              props.options.find((option) => option.value === value)?.label ?? String(value ?? "")
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          align="start"
          className="qitu-surface qitu-overlay-surface qitu-select-popup"
          sideOffset={6}
        >
          {props.options.map((option) => (
            <SelectItem
              className="qitu-panel-action qitu-select-item"
              key={option.value}
              label={option.label}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </BaseField.Root>
  );
}
