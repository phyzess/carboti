export function assertUiPrimitiveFormFacadeGuards(context) {
  const { assert, exists, text } = context;

  assert(
    exists("packages/ui/src/calendar-class-names.ts") &&
      exists("packages/ui/src/calendar-day-button.tsx") &&
      exists("packages/ui/src/calendar-parts.tsx") &&
      text("packages/ui/src/calendar.tsx").includes("buildCalendarClassNames") &&
      text("packages/ui/src/calendar.tsx").includes("CalendarDayButton") &&
      text("packages/ui/src/calendar.tsx").includes("CalendarChevron") &&
      !text("packages/ui/src/calendar.tsx").includes("getDefaultClassNames") &&
      text("packages/ui/src/calendar-class-names.ts").includes(
        "function buildCalendarClassNames",
      ) &&
      text("packages/ui/src/calendar-class-names.ts").includes("buttonVariants") &&
      text("packages/ui/src/calendar-day-button.tsx").includes("function CalendarDayButton") &&
      text("packages/ui/src/calendar-day-button.tsx").includes("modifiers.focused") &&
      text("packages/ui/src/calendar-parts.tsx").includes("function CalendarRoot") &&
      text("packages/ui/src/calendar-parts.tsx").includes("function CalendarChevron") &&
      text("packages/ui/src/calendar-parts.tsx").includes("function CalendarWeekNumber") &&
      exists("packages/ui/src/command-base.tsx") &&
      exists("packages/ui/src/command-dialog.tsx") &&
      exists("packages/ui/src/command-input.tsx") &&
      exists("packages/ui/src/command-item.tsx") &&
      text("packages/ui/src/command.tsx").includes("command-base") &&
      text("packages/ui/src/command.tsx").includes("command-dialog") &&
      text("packages/ui/src/command.tsx").includes("command-input") &&
      text("packages/ui/src/command.tsx").includes("command-item") &&
      !text("packages/ui/src/command.tsx").includes("CommandPrimitive.Item") &&
      text("packages/ui/src/command-base.tsx").includes("function Command") &&
      text("packages/ui/src/command-base.tsx").includes("function CommandList") &&
      text("packages/ui/src/command-dialog.tsx").includes("function CommandDialog") &&
      text("packages/ui/src/command-dialog.tsx").includes("DialogContent") &&
      text("packages/ui/src/command-input.tsx").includes("function CommandInput") &&
      text("packages/ui/src/command-input.tsx").includes("InputGroup") &&
      text("packages/ui/src/command-input.tsx").includes("SearchIcon") &&
      text("packages/ui/src/command-item.tsx").includes("function CommandItem") &&
      text("packages/ui/src/command-item.tsx").includes("function CommandShortcut") &&
      text("packages/ui/src/command-item.tsx").includes("CheckIcon") &&
      exists("packages/ui/src/input-group-addon.tsx") &&
      exists("packages/ui/src/input-group-base.tsx") &&
      exists("packages/ui/src/input-group-button.tsx") &&
      exists("packages/ui/src/input-group-controls.tsx") &&
      text("packages/ui/src/input-group.tsx").includes("input-group-addon") &&
      text("packages/ui/src/input-group.tsx").includes("input-group-base") &&
      text("packages/ui/src/input-group.tsx").includes("input-group-button") &&
      text("packages/ui/src/input-group.tsx").includes("input-group-controls") &&
      !text("packages/ui/src/input-group.tsx").includes("inputGroupAddonVariants") &&
      text("packages/ui/src/input-group-addon.tsx").includes("function InputGroupAddon") &&
      text("packages/ui/src/input-group-addon.tsx").includes("inputGroupAddonVariants") &&
      text("packages/ui/src/input-group-addon.tsx").includes('querySelector("input")') &&
      text("packages/ui/src/input-group-base.tsx").includes("function InputGroup") &&
      text("packages/ui/src/input-group-button.tsx").includes("function InputGroupButton") &&
      text("packages/ui/src/input-group-button.tsx").includes("inputGroupButtonVariants") &&
      text("packages/ui/src/input-group-controls.tsx").includes("function InputGroupInput") &&
      text("packages/ui/src/input-group-controls.tsx").includes("function InputGroupTextarea") &&
      exists("packages/ui/src/select-base.tsx") &&
      exists("packages/ui/src/select-content.tsx") &&
      exists("packages/ui/src/select-items.tsx") &&
      text("packages/ui/src/select.tsx").includes("select-base") &&
      text("packages/ui/src/select.tsx").includes("select-content") &&
      text("packages/ui/src/select.tsx").includes("select-items") &&
      !text("packages/ui/src/select.tsx").includes("SelectPrimitive.Popup") &&
      text("packages/ui/src/select-base.tsx").includes("function SelectTrigger") &&
      text("packages/ui/src/select-base.tsx").includes("ChevronDownIcon") &&
      text("packages/ui/src/select-content.tsx").includes("function SelectContent") &&
      text("packages/ui/src/select-content.tsx").includes("function SelectScrollUpButton") &&
      text("packages/ui/src/select-content.tsx").includes("SelectPrimitive.List") &&
      text("packages/ui/src/select-items.tsx").includes("function SelectItem") &&
      text("packages/ui/src/select-items.tsx").includes("SelectPrimitive.ItemIndicator"),
    "@carboti/ui form/control facade primitives must keep split package-internal implementations.",
  );
}
