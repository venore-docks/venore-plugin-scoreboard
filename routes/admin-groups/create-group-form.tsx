"use client";

import { useActionState } from "react";
import { Button, Input, useActionToast } from "@venore/plugin-sdk/ui";
import { createGroupAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

export function CreateGroupForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, pending] = useActionState(createGroupAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Curso/segmento criado.", onSuccess });

  return (
    <form action={formAction} className="space-y-3">
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Nome
        <Input name="label" placeholder="Pedagogia" required />
      </label>
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Código na Prime (opcional)
        <Input name="primeSegmentKey" placeholder="ex.: PED" />
      </label>
      <Button type="submit" disabled={pending} className="w-full">
        Criar
      </Button>
    </form>
  );
}
