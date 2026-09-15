import { isPluginActive } from "@venore/plugin-sdk";
import { authorizeBoardReadActor } from "../../../shared/scoped-authorization";
import { subscribeToBoardEvents } from "../../../runtime/board-bus";
import type { ScoreboardLiveEvent } from "../../../contracts/types";

// `export const dynamic` precisa ficar declarado direto no arquivo de rota dentro de app/ — Next
// só lê route segment config de export direto no arquivo de rota, não segue re-export (mesmo
// racional de venore-plugin-broadcast/routes/api/output-events/route.ts).
export const dynamic = "force-dynamic";

// Heartbeat evita que um proxy/switch de LAN derrube a conexão ociosa (mesma justificativa do
// broadcast) — aqui um evento de verdade pode não vir por HORAS (board muda algumas vezes por
// dia), então o heartbeat é ainda mais importante pra manter o caminho vivo.
const HEARTBEAT_INTERVAL_MS = 20_000;

// Gateada por sessão + permissão (authorizeBoardReadActor) — ao contrário do output SSE do
// broadcast, que é por token anônimo. Uma tela de indicadores não é feita pra qualquer um na rede
// local abrir.
export async function GET(request: Request, { params }: { params: Promise<{ boardId: string }> }): Promise<Response> {
  if (!(await isPluginActive("scoreboard"))) {
    return Response.json({ error: "O plugin de Indicadores está desabilitado." }, { status: 404 });
  }

  const { boardId } = await params;
  const authz = await authorizeBoardReadActor(boardId);
  if (!authz.authorized) {
    return Response.json({ error: authz.error.message }, { status: 401 });
  }

  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;
  const stopHeartbeat = () => {
    if (heartbeat) {
      clearInterval(heartbeat);
      heartbeat = null;
    }
  };

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (payload: ScoreboardLiveEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      controller.enqueue(encoder.encode("retry: 5000\n\n"));

      heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          stopHeartbeat();
        }
      }, HEARTBEAT_INTERVAL_MS);

      unsubscribe = subscribeToBoardEvents(boardId, send, () => {
        stopHeartbeat();
        unsubscribe?.();
        try {
          controller.close();
        } catch {
          // Já fechado.
        }
      });
    },
    cancel() {
      stopHeartbeat();
      unsubscribe?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
