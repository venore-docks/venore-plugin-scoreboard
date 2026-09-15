import { PrimeClientNotConfiguredError, type PrimeClient, type PrimeStudentDTO } from "./types";

// v1 — sem doc nem payload real da Prime ainda. Falha de forma explícita e previsível em vez de
// inventar um formato que provavelmente vai estar errado; trigger-prime-sync captura este erro e
// grava status "failed" em prime_sync_log com mensagem amigável, nunca deixa subir como 500 cru.
export const stubPrimeClient: PrimeClient = {
  async fetchStudents(): Promise<PrimeStudentDTO[]> {
    throw new PrimeClientNotConfiguredError();
  },
};
