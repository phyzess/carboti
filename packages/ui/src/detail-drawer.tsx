import type { ReactNode } from "react";
import { DrawerClose, DrawerContent, DrawerDescription, DrawerRoot, DrawerTitle } from "./drawer";

export function DetailDrawer(props: {
  children: ReactNode;
  closeAction: ReactNode;
  description?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  open: boolean;
  title: ReactNode;
}) {
  const rootProps = props.onOpenChange
    ? { onOpenChange: props.onOpenChange, open: props.open }
    : { open: props.open };

  return (
    <DrawerRoot {...rootProps}>
      <DrawerContent>
        <div className="qitu-detail-drawer-header">
          <div className="qitu-detail-drawer-heading">
            <DrawerTitle className="qitu-detail-drawer-title">{props.title}</DrawerTitle>
            {props.description ? (
              <DrawerDescription className="qitu-detail-drawer-description">
                {props.description}
              </DrawerDescription>
            ) : null}
          </div>
          <DrawerClose asChild>{props.closeAction}</DrawerClose>
        </div>
        {props.children}
      </DrawerContent>
    </DrawerRoot>
  );
}
