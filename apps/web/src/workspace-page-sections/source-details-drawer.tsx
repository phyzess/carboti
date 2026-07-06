import { Button, DetailDrawer } from "@carboti/ui";
import { X } from "lucide-react";
import { useI18n } from "../i18n";
import type { ImportJobListItem, SourceFile } from "../types";
import { SourceDetailsContent } from "./source-details-content";

export function SourceDetailsDrawer(props: {
  file: SourceFile | null;
  jobs: ImportJobListItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();

  return (
    <DetailDrawer
      closeAction={
        <Button
          aria-label={t("action.closeDetails")}
          className="size-8 px-0"
          size="sm"
          title={t("action.closeDetails")}
          variant="ghost"
          onClick={() => props.onOpenChange(false)}
        >
          <X size={14} />
        </Button>
      }
      description={t("sources.detailsDescription")}
      open={props.open}
      title={props.file?.filename ?? ""}
      onOpenChange={props.onOpenChange}
    >
      {props.file ? <SourceDetailsContent file={props.file} jobs={props.jobs} /> : null}
    </DetailDrawer>
  );
}
