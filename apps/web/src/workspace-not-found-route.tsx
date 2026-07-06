import { AnimatedIcon, Button } from "@carboti/ui";
import { defaultAuthenticatedPath } from "./app-routes";
import { Panel, SectionTitle } from "./app-ui";
import { useI18n } from "./i18n";

export function WorkspaceNotFoundRoute(props: { onNavigateHome: () => void }) {
  const { t } = useI18n();

  return (
    <Panel>
      <SectionTitle icon={<AnimatedIcon name="activity" size={16} />} label={t("route.notFound")} />
      <div className="mt-4">
        <Button onClick={props.onNavigateHome}>
          <AnimatedIcon name="workbench" size={15} /> {t("action.openWorkspace")}
        </Button>
      </div>
    </Panel>
  );
}

export const workspaceNotFoundHomePath = defaultAuthenticatedPath;
