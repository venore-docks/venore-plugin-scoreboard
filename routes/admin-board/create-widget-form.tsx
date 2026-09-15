"use client";

import { useActionState } from "react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useActionToast,
} from "@venore/plugin-sdk/ui";
// Import direto do módulo folha, não do barrel (../../index) — este componente é client, e o
// barrel reexporta handlers que arrastam @venore/plugin-sdk/db pro bundle do browser (mesmo
// racional de venore-plugin-birthdays/routes/admin/birthday-fields.tsx).
import { WIDGET_KINDS, type WidgetKind } from "../../shared/widget-config/types";
import { createWidgetAction, type ScoreboardActionState } from "./actions";

const KIND_LABELS: Record<WidgetKind, string> = {
  goal_progress: "Meta com % atingido",
  funnel: "Funil de etapas",
  metric_free: "Métrica livre",
};

const initialState: ScoreboardActionState = { error: null };

export function CreateWidgetForm({ boardId }: { boardId: string }) {
  const [state, formAction, pending] = useActionState(createWidgetAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Widget criado." });

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-panel border border-dashed border-border p-3">
      <input type="hidden" name="boardId" value={boardId} />
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Tipo
        <Select name="kind" defaultValue="goal_progress" required>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WIDGET_KINDS.map((kind) => (
              <SelectItem key={kind} value={kind}>
                {KIND_LABELS[kind]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Título
        <Input name="title" placeholder="Metas por segmento" required className="w-56" />
      </label>
      <Button type="submit" disabled={pending}>
        Adicionar widget
      </Button>
    </form>
  );
}
