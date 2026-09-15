"use client";

import { useActionState } from "react";
import { Input, useActionToast } from "@venore/plugin-sdk/ui";
import { setWidgetManualValueAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

// Um número editável = um mini-form próprio (server action por campo, não um form gigante por
// widget) — salva no blur se o valor mudou, sem precisar de um botão "salvar" separado. É o
// caminho do dia a dia (lançar inscrições, documentação etc.); mudar a ESTRUTURA (adicionar
// grupo/etapa/item) é o textarea JSON em structure-editor.tsx.
export function InlineNumberField({
  boardId,
  widgetId,
  kind,
  hidden,
  value,
  disabled = false,
}: {
  boardId: string;
  widgetId: string;
  kind: "goal_progress" | "funnel" | "metric_free";
  hidden: Record<string, string>;
  value: number;
  disabled?: boolean;
}) {
  const [state, formAction, pending] = useActionState(setWidgetManualValueAction, initialState);
  useActionToast({ pending, error: state.error });

  return (
    <form action={formAction}>
      <input type="hidden" name="boardId" value={boardId} />
      <input type="hidden" name="widgetId" value={widgetId} />
      <input type="hidden" name="kind" value={kind} />
      {Object.entries(hidden).map(([key, fieldValue]) => (
        <input key={key} type="hidden" name={key} value={fieldValue} />
      ))}
      <Input
        type="number"
        name="value"
        min={0}
        defaultValue={value}
        disabled={disabled || pending}
        className="h-8 w-24 text-right tabular-nums"
        onBlur={(event) => {
          if (Number(event.currentTarget.value) !== value) {
            event.currentTarget.form?.requestSubmit();
          }
        }}
      />
    </form>
  );
}
