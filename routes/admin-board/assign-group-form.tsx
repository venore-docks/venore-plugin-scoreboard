"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useActionToast,
} from "@venore/plugin-sdk/ui";
import { assignWidgetGroupAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

// Atribui um curso/segmento JÁ CADASTRADO no catálogo (/admin/scoreboard/groups) — cadastrar um
// novo curso é lá, não aqui (pedido explícito do usuário: "em outro lugar", lista compartilhada
// entre boards). `availableGroups` já vem filtrado (sem os que já estão neste widget).
export function AssignGroupForm({
  boardId,
  widgetId,
  kind,
  availableGroups,
}: {
  boardId: string;
  widgetId: string;
  kind: "goal_progress" | "funnel";
  availableGroups: { key: string; label: string }[];
}) {
  const [state, formAction, pending] = useActionState(assignWidgetGroupAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Curso/segmento atribuído." });

  if (availableGroups.length === 0) {
    return (
      <p className="px-1 text-xs text-muted-foreground">
        Todos os cursos/segmentos cadastrados já estão atribuídos aqui — cadastre um novo em{" "}
        <Link href="/admin/scoreboard/groups" className="text-primary hover:underline">
          Cursos e segmentos
        </Link>
        .
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2 rounded-panel border border-dashed border-border p-3">
      <input type="hidden" name="boardId" value={boardId} />
      <input type="hidden" name="widgetId" value={widgetId} />
      <input type="hidden" name="kind" value={kind} />
      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        Atribuir curso/segmento
        <Select name="groupKey" required>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="selecione..." />
          </SelectTrigger>
          <SelectContent>
            {availableGroups.map((group) => (
              <SelectItem key={group.key} value={group.key}>
                {group.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        <Plus className="size-4" />
        Atribuir
      </Button>
    </form>
  );
}
