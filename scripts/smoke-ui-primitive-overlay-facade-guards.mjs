export function assertUiPrimitiveOverlayFacadeGuards(context) {
  const { assert, exists, text } = context;

  assert(
    exists("packages/ui/src/alert-dialog-actions.tsx") &&
      exists("packages/ui/src/alert-dialog-base.tsx") &&
      exists("packages/ui/src/alert-dialog-content.tsx") &&
      exists("packages/ui/src/alert-dialog-layout.tsx") &&
      text("packages/ui/src/alert-dialog.tsx").includes("alert-dialog-actions") &&
      text("packages/ui/src/alert-dialog.tsx").includes("alert-dialog-base") &&
      text("packages/ui/src/alert-dialog.tsx").includes("alert-dialog-content") &&
      text("packages/ui/src/alert-dialog.tsx").includes("alert-dialog-layout") &&
      !text("packages/ui/src/alert-dialog.tsx").includes("AlertDialogPrimitive.Popup") &&
      text("packages/ui/src/alert-dialog-actions.tsx").includes("function AlertDialogAction") &&
      text("packages/ui/src/alert-dialog-actions.tsx").includes("function AlertDialogCancel") &&
      text("packages/ui/src/alert-dialog-base.tsx").includes("function AlertDialog") &&
      text("packages/ui/src/alert-dialog-base.tsx").includes("function AlertDialogPortal") &&
      text("packages/ui/src/alert-dialog-content.tsx").includes("function AlertDialogContent") &&
      text("packages/ui/src/alert-dialog-content.tsx").includes("function AlertDialogOverlay") &&
      text("packages/ui/src/alert-dialog-layout.tsx").includes("function AlertDialogHeader") &&
      text("packages/ui/src/alert-dialog-layout.tsx").includes("function AlertDialogTitle") &&
      exists("packages/ui/src/dialog-base.tsx") &&
      exists("packages/ui/src/dialog-content.tsx") &&
      exists("packages/ui/src/dialog-layout.tsx") &&
      text("packages/ui/src/dialog.tsx").includes("dialog-base") &&
      text("packages/ui/src/dialog.tsx").includes("dialog-content") &&
      text("packages/ui/src/dialog.tsx").includes("dialog-layout") &&
      !text("packages/ui/src/dialog.tsx").includes("DialogPrimitive.Popup") &&
      text("packages/ui/src/dialog-base.tsx").includes("function Dialog") &&
      text("packages/ui/src/dialog-base.tsx").includes("const DialogRoot") &&
      text("packages/ui/src/dialog-content.tsx").includes("function DialogContent") &&
      text("packages/ui/src/dialog-content.tsx").includes("function DialogOverlay") &&
      text("packages/ui/src/dialog-content.tsx").includes("XIcon") &&
      text("packages/ui/src/dialog-layout.tsx").includes("function DialogFooter") &&
      text("packages/ui/src/dialog-layout.tsx").includes("function DialogDescription") &&
      exists("packages/ui/src/dropdown-menu-base.tsx") &&
      exists("packages/ui/src/dropdown-menu-choice-items.tsx") &&
      exists("packages/ui/src/dropdown-menu-submenu.tsx") &&
      text("packages/ui/src/menu.tsx").includes("DropdownMenu") &&
      text("packages/ui/src/dropdown-menu.tsx").includes("dropdown-menu-base") &&
      text("packages/ui/src/dropdown-menu.tsx").includes("dropdown-menu-choice-items") &&
      text("packages/ui/src/dropdown-menu.tsx").includes("dropdown-menu-submenu") &&
      !text("packages/ui/src/dropdown-menu.tsx").includes("MenuPrimitive.Popup") &&
      text("packages/ui/src/dropdown-menu-base.tsx").includes("function DropdownMenuContent") &&
      text("packages/ui/src/dropdown-menu-base.tsx").includes("function DropdownMenuItem") &&
      text("packages/ui/src/dropdown-menu-choice-items.tsx").includes(
        "function DropdownMenuCheckboxItem",
      ) &&
      text("packages/ui/src/dropdown-menu-choice-items.tsx").includes(
        "function DropdownMenuRadioItem",
      ) &&
      text("packages/ui/src/dropdown-menu-submenu.tsx").includes(
        "function DropdownMenuSubTrigger",
      ) &&
      text("packages/ui/src/dropdown-menu-submenu.tsx").includes("DropdownMenuContent"),
    "@carboti/ui overlay facade primitives must keep split package-internal implementations.",
  );
}
