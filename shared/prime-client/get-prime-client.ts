import type { PrimeClient } from "./types";
import { stubPrimeClient } from "./stub-prime-client";

// Único ponto a trocar quando a API real da Prime estiver disponível (Fase 2) — implementar
// shared/prime-client/http-prime-client.ts e retornar ele aqui em vez do stub. Nenhum outro
// arquivo do plugin importa stubPrimeClient/httpPrimeClient diretamente.
export function getPrimeClient(): PrimeClient {
  return stubPrimeClient;
}
