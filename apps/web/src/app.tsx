import { AuthenticatedWorkspace } from "./authenticated-workspace";
import { useAppController } from "./use-app-controller";

export function App() {
  const { routeGate, workspaceProps } = useAppController();

  if (routeGate) return routeGate;
  if (!workspaceProps) return null;

  return <AuthenticatedWorkspace {...workspaceProps} />;
}
