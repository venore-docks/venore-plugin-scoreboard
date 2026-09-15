import type { ScoreboardLiveEvent } from "../contracts/types";

// Pub/sub em memória, por processo — mesmo padrão e mesma suposição de venore-plugin-broadcast/
// runtime/output-bus.ts: assume um único processo Node de longa duração (servidor local, não
// serverless multi-instância). Se isso mudar, precisa virar Redis pub/sub ou equivalente — mesmo
// Known Gap já registrado no README do broadcast, vale igual aqui.
type Subscriber = (event: ScoreboardLiveEvent) => void;

type Connection = { subscriber: Subscriber; onEvict: () => void };

// Teto de conexões SSE simultâneas por board. Mesmo racional do broadcast (MAX_CONNECTIONS_PER_TOKEN):
// um proxy/switch numa LAN pode derrubar um socket ocioso sem o Node perceber; o heartbeat da
// rota já detecta isso cedo, este teto é a rede de segurança. Normal é 1-2 conexões por board
// (a TV do Broadcast + alguém com a tela web aberta).
export const MAX_CONNECTIONS_PER_BOARD = 8;

// Guardado em globalThis, não numa variável de módulo — mesmo motivo documentado em
// output-bus.ts: Server Actions e Route Handlers podem cair em "camadas" de bundle diferentes no
// Next.js, cada uma com sua própria cópia avaliada do módulo.
type BoardBusGlobal = typeof globalThis & {
  __scoreboardBoardConnections?: Map<string, Set<Connection>>;
};

function getConnectionsByBoard(): Map<string, Set<Connection>> {
  const globalWithBus = globalThis as BoardBusGlobal;
  if (!globalWithBus.__scoreboardBoardConnections) {
    globalWithBus.__scoreboardBoardConnections = new Map();
  }
  return globalWithBus.__scoreboardBoardConnections;
}

export function subscribeToBoardEvents(boardId: string, subscriber: Subscriber, onEvict: () => void = () => {}): () => void {
  const connectionsByBoard = getConnectionsByBoard();
  const connections = connectionsByBoard.get(boardId) ?? new Set<Connection>();
  const connection: Connection = { subscriber, onEvict };
  connections.add(connection);
  connectionsByBoard.set(boardId, connections);

  while (connections.size > MAX_CONNECTIONS_PER_BOARD) {
    const oldest: Connection | undefined = connections.values().next().value;
    if (!oldest || oldest === connection) break;
    connections.delete(oldest);
    try {
      oldest.onEvict();
    } catch {
      // A rota pode já ter fechado o controller por conta própria — evicção é best-effort.
    }
  }

  return () => {
    connections.delete(connection);
    if (connections.size === 0) {
      connectionsByBoard.delete(boardId);
    }
  };
}

export function publishBoardEvent(boardId: string, event: ScoreboardLiveEvent): void {
  const connections = getConnectionsByBoard().get(boardId);
  if (!connections) return;
  for (const connection of connections) connection.subscriber(event);
}
