import { OverviewPage, type WorkspaceHomeProps } from "./workspace-pages";

export type { WorkspaceHomeProps };

export function WorkspaceHomeSlot(props: WorkspaceHomeProps) {
  return <OverviewPage {...props} />;
}
