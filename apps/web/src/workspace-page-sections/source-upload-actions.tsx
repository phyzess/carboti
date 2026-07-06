import { Button } from "@carboti/ui";
import { FileUp } from "lucide-react";
import { useI18n } from "../i18n";

export function SourceCompactUploadActions(props: {
  canUploadSources: boolean;
  isBusy: boolean;
  onChooseFiles: () => void;
  onUploadSample: () => void;
}) {
  const { t } = useI18n();

  return (
    <>
      <Button
        disabled={props.isBusy || !props.canUploadSources}
        size="sm"
        type="button"
        variant="secondary"
        onClick={props.onChooseFiles}
      >
        <FileUp size={14} /> {t("action.chooseFiles")}
      </Button>
      <Button
        disabled={props.isBusy || !props.canUploadSources}
        size="sm"
        type="button"
        variant="ghost"
        onClick={props.onUploadSample}
      >
        <FileUp size={14} /> {t("action.uploadSample")}
      </Button>
    </>
  );
}

export function SourceUploadActions(props: {
  canUploadSources: boolean;
  hidden: boolean;
  isBusy: boolean;
  onChooseFiles: () => void;
  onUploadSample: () => void;
  onUploadSelected: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className={props.hidden ? "hidden" : "flex flex-wrap gap-2"}>
      <Button
        disabled={props.isBusy || !props.canUploadSources}
        size="sm"
        type="button"
        variant="ghost"
        onClick={props.onChooseFiles}
      >
        <FileUp size={14} /> {t("action.chooseFiles")}
      </Button>
      <Button
        disabled={props.isBusy || !props.canUploadSources}
        size="sm"
        variant="secondary"
        onClick={props.onUploadSelected}
      >
        <FileUp size={14} /> {t("action.uploadSelected")}
      </Button>
      <Button
        disabled={props.isBusy || !props.canUploadSources}
        size="sm"
        variant="ghost"
        onClick={props.onUploadSample}
      >
        <FileUp size={14} /> {t("action.uploadSample")}
      </Button>
    </div>
  );
}
