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
import { createMappingAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

export function CreateMappingForm({ boardId, stages }: { boardId: string; stages: { key: string; label: string }[] }) {
  const [state, formAction, pending] = useActionState(createMappingAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Mapeamento criado." });

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-panel border border-dashed border-border p-3">
      <input type="hidden" name="boardId" value={boardId} />
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Status cru da Prime
        <Input name="rawStatus" placeholder="ex.: MATRICULA_CONFIRMADA" required className="w-56" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Etapa de destino
        <Select name="stageKey" required disabled={stages.length === 0}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder={stages.length === 0 ? "sem etapas neste board" : "selecione..."} />
          </SelectTrigger>
          <SelectContent>
            {stages.map((stage) => (
              <SelectItem key={stage.key} value={stage.key}>
                {stage.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Rótulo (opcional)
        <Input name="label" placeholder="descrição livre" className="w-48" />
      </label>
      <Button type="submit" disabled={pending || stages.length === 0}>
        Adicionar mapeamento
      </Button>
    </form>
  );
}
