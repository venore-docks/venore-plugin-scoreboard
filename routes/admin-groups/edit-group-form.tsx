"use client";

import { useActionState } from "react";
import { Button, Input, useActionToast } from "@venore/plugin-sdk/ui";
import { updateGroupAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

export function EditGroupForm({
  groupId,
  label,
  primeSegmentKey,
  onSuccess,
}: {
  groupId: string;
  label: string;
  primeSegmentKey: string | null;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(updateGroupAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Curso/segmento atualizado.", onSuccess });

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="groupId" value={groupId} />
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Nome
        <Input name="label" defaultValue={label} required />
      </label>
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Código na Prime (opcional)
        <Input name="primeSegmentKey" defaultValue={primeSegmentKey ?? ""} placeholder="ex.: PED" />
      </label>
      <Button type="submit" disabled={pending} className="w-full">
        Salvar
      </Button>
    </form>
  );
}
