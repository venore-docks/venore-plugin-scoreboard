"use client";

import { useActionState } from "react";
import { X } from "lucide-react";
import { Button, useActionToast } from "@venore/plugin-sdk/ui";
import { unassignWidgetGroupAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

export function UnassignGroupButton({
  boardId,
  widgetId,
  kind,
  groupKey,
  groupLabel,
}: {
  boardId: string;
  widgetId: string;
  kind: "goal_progress" | "funnel";
  groupKey: string;
  groupLabel: string;
}) {
  const [state, formAction, pending] = useActionState(unassignWidgetGroupAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: `"${groupLabel}" removido deste widget.` });

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Remover "${groupLabel}" deste widget? Os números lançados aqui se perdem — o curso continua no catálogo.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="boardId" value={boardId} />
      <input type="hidden" name="widgetId" value={widgetId} />
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="groupKey" value={groupKey} />
      <Button type="submit" variant="ghost" size="icon" disabled={pending} aria-label={`Remover ${groupLabel} deste widget`} className="size-6">
        <X className="size-3.5" />
      </Button>
    </form>
  );
}
