"use client";

import { useActionState } from "react";
import { Button, Input, useActionToast } from "@venore/plugin-sdk/ui";
import { setBoardEditorsAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

// Responsáveis (scoreboard.boards.manage escopado) — v1 é uma lista de user ids separados por
// vírgula, não um seletor de usuário com busca por nome (não existe um componente compartilhado
// pra isso no @venore/plugin-sdk/ui hoje), e SUBSTITUI a lista inteira (não mostra quem já está
// atribuído — limitação aceita do v1). Quem tem scoreboard.manage não precisa disso pra editar
// nada; é só pra delegar um board específico a um setor sem dar acesso aos outros.
export function BoardEditorsForm({ boardId }: { boardId: string }) {
  const [state, formAction, pending] = useActionState(setBoardEditorsAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Responsáveis atualizados." });

  return (
    <form action={formAction} className="space-y-2 rounded-panel border border-border bg-card p-4 shadow-panel">
      <input type="hidden" name="boardId" value={boardId} />
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Responsáveis (ids de usuário separados por vírgula — substitui a lista atual)
        <Input name="userIds" placeholder="user-id-1, user-id-2" />
      </label>
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        Salvar responsáveis
      </Button>
    </form>
  );
}
