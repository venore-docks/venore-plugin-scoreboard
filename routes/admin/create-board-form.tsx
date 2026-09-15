"use client";

import { useActionState } from "react";
import { Button, Input, Textarea, useActionToast } from "@venore/plugin-sdk/ui";
import { createBoardAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

export function CreateBoardForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, pending] = useActionState(createBoardAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Quadro criado.", onSuccess });

  return (
    <form action={formAction} className="space-y-3">
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Nome do quadro
        <Input name="name" placeholder="Erasto 2027" required />
      </label>
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Setor dono
        <Input name="sector" placeholder="Secretaria Acadêmica" required />
      </label>
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Descrição (opcional)
        <Textarea name="description" placeholder="Campanha de matrícula 2027 — metas por segmento." rows={2} />
      </label>
      <Button type="submit" disabled={pending} className="w-full">
        Criar quadro
      </Button>
    </form>
  );
}
