"use client";

import { useActionState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, useActionToast } from "@venore/plugin-sdk/ui";
import { triggerSyncAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

export function TriggerSyncButton() {
  const [state, formAction, pending] = useActionState(triggerSyncAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Sincronização concluída." });

  return (
    <form action={formAction}>
      <Button type="submit" disabled={pending}>
        <RefreshCw className={`size-4 ${pending ? "animate-spin" : ""}`} />
        Sincronizar agora
      </Button>
    </form>
  );
}
