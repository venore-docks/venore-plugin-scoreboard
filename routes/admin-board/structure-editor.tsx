"use client";

import { useActionState } from "react";
import { Button, Textarea, useActionToast } from "@venore/plugin-sdk/ui";
import { updateWidgetStructureAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

// Editor de ESTRUTURA via JSON cru — adicionar/remover um grupo, etapa ou item. Os números do dia
// a dia têm inputs próprios (goal-progress-editor.tsx etc.); isto é só pra quando a FORMA do
// widget muda, o que acontece raramente (montar o board pela primeira vez, ou adicionar um
// segmento/curso novo no meio da campanha).
export function StructureEditor({ boardId, widgetId, config }: { boardId: string; widgetId: string; config: Record<string, unknown> }) {
  const [state, formAction, pending] = useActionState(updateWidgetStructureAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Estrutura atualizada." });

  return (
    <details className="rounded-panel border border-border/60 bg-background/40 p-3">
      <summary className="cursor-pointer text-xs font-medium text-muted-foreground">Editar estrutura (JSON)</summary>
      <form action={formAction} className="mt-3 space-y-2">
        <input type="hidden" name="boardId" value={boardId} />
        <input type="hidden" name="widgetId" value={widgetId} />
        <Textarea name="config" defaultValue={JSON.stringify(config, null, 2)} rows={10} className="font-mono text-xs" />
        <Button type="submit" size="sm" variant="outline" disabled={pending}>
          Salvar estrutura
        </Button>
      </form>
    </details>
  );
}
