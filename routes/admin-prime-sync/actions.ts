"use server";

import { revalidatePath } from "next/cache";
import { triggerPrimeSync } from "../../index";
import { isPluginActive } from "@venore/plugin-sdk";

export type ScoreboardActionState = { error: string | null };

const returnTo = "/admin/scoreboard/prime-sync";

export async function triggerSyncAction(
  _prevState: ScoreboardActionState,
  _formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) {
    return { error: "O plugin de Indicadores está desabilitado." };
  }

  const result = await triggerPrimeSync();
  revalidatePath(returnTo);

  // Uma falha aqui é esperada enquanto a Prime não está configurada (stubPrimeClient) — o registro
  // completo (status "failed", mensagem) já está em prime_sync_log, a tabela abaixo mostra.
  if (!result.success) {
    return { error: result.error.message };
  }
  return { error: null };
}
