"use client";

import { useActionState } from "react";
import { Button, Input, Switch, Textarea, useActionToast } from "@venore/plugin-sdk/ui";
import { updateBoardSettingsAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

export function BoardSettingsForm({
  boardId,
  name,
  sector,
  description,
  published,
}: {
  boardId: string;
  name: string;
  sector: string;
  description: string | null;
  published: boolean;
}) {
  const [state, formAction, pending] = useActionState(updateBoardSettingsAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Quadro atualizado." });

  return (
    <form action={formAction} className="space-y-3 rounded-panel border border-border bg-card p-4 shadow-panel">
      <input type="hidden" name="boardId" value={boardId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Nome do quadro
          <Input name="name" defaultValue={name} required />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Setor dono
          <Input name="sector" defaultValue={sector} required />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Descrição
        <Textarea name="description" defaultValue={description ?? ""} rows={2} />
      </label>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <Switch name="published" defaultChecked={published} />
        Publicado (visível na tela web e na TV)
      </label>
      <Button type="submit" disabled={pending}>
        Salvar
      </Button>
    </form>
  );
}
