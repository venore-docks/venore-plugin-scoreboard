"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { Button, Input, useActionToast } from "@venore/plugin-sdk/ui";
import { addWidgetItemAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

const FIELD_LABEL: Record<"goal_progress" | "funnel" | "metric_free", string> = {
  goal_progress: "Novo grupo",
  funnel: "Nova etapa",
  metric_free: "Novo item",
};

const LABEL_PLACEHOLDER: Record<"goal_progress" | "funnel" | "metric_free", string> = {
  goal_progress: "Ensino Médio",
  funnel: "Documentação",
  metric_free: "Doações do mês",
};

// "Método clean pra inserir os dados" — pede só o rótulo (a key vira um slug dele
// automaticamente, ver features/add-widget-item/service.ts), sem exigir que quem está cadastrando
// pense em slug ou edite JSON.
export function AddItemForm({ boardId, widgetId, kind }: { boardId: string; widgetId: string; kind: "goal_progress" | "funnel" | "metric_free" }) {
  const [state, formAction, pending] = useActionState(addWidgetItemAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Adicionado." });

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2 rounded-panel border border-dashed border-border p-3">
      <input type="hidden" name="boardId" value={boardId} />
      <input type="hidden" name="widgetId" value={widgetId} />
      <input type="hidden" name="kind" value={kind} />
      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        {FIELD_LABEL[kind]}
        <Input name="label" placeholder={LABEL_PLACEHOLDER[kind]} required className="h-8 w-48" />
      </label>
      {kind === "metric_free" && (
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Unidade (opcional)
          <Input name="unit" placeholder="R$, alunos..." className="h-8 w-32" />
        </label>
      )}
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        <Plus className="size-4" />
        Adicionar
      </Button>
    </form>
  );
}
