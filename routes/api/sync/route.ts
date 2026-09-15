import { isPluginActive } from "@venore/plugin-sdk";
import { triggerPrimeSyncHandler } from "../../../features/trigger-prime-sync/handler";

// Usado tanto pelo botão "Sincronizar agora" do admin (routes/admin-prime-sync) quanto,
// futuramente, por um cron externo batendo nesta rota — autenticação é por sessão (scoreboard.manage),
// não por token, então o cron externo precisaria de uma credencial de serviço; fora de escopo do v1.
export async function POST(): Promise<Response> {
  if (!(await isPluginActive("scoreboard"))) {
    return Response.json({ error: "O plugin de Indicadores está desabilitado." }, { status: 404 });
  }

  const result = await triggerPrimeSyncHandler();
  if (!result.success) {
    return Response.json({ error: result.error.message }, { status: 400 });
  }

  return Response.json(result.data);
}
