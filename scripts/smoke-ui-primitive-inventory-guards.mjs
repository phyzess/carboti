export function assertUiPrimitiveInventoryGuards(context) {
  const { assert, exists } = context;

  const registryBackedUiFiles = [
    "packages/ui/src/alert-dialog.tsx",
    "packages/ui/src/badge.tsx",
    "packages/ui/src/button.tsx",
    "packages/ui/src/calendar.tsx",
    "packages/ui/src/card.tsx",
    "packages/ui/src/checkbox.tsx",
    "packages/ui/src/command.tsx",
    "packages/ui/src/dialog.tsx",
    "packages/ui/src/drawer.tsx",
    "packages/ui/src/dropdown-menu.tsx",
    "packages/ui/src/input.tsx",
    "packages/ui/src/input-group.tsx",
    "packages/ui/src/popover.tsx",
    "packages/ui/src/radio-group.tsx",
    "packages/ui/src/select.tsx",
    "packages/ui/src/separator.tsx",
    "packages/ui/src/sheet.tsx",
    "packages/ui/src/table.tsx",
    "packages/ui/src/tabs.tsx",
    "packages/ui/src/textarea.tsx",
  ];

  assert(
    registryBackedUiFiles.every((path) => exists(path)),
    "@carboti/ui registry-backed primitive facades must exist.",
  );
}
