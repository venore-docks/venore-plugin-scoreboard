// Porta pra API externa "Prime" (plataforma de gestão escolar) — SUPOSIÇÃO de formato, não
// confirmada: o usuário não tem doc nem payload de exemplo ainda ("vamos ter que criar no
// escuro"). rawStatus é passado adiante tal como a Prime devolve (nunca traduzido aqui) — a
// tradução pra etapa do funil é feita depois, via prime_status_mapping (editável por board).
export type PrimeStudentDTO = {
  externalId: string;
  segmentOrCourse: string;
  enrollmentType: "new" | "reenrollment";
  rawStatus: string;
};

// Implementação real (Fase 2, quando a API existir) troca só get-prime-client.ts — nenhum
// chamador (features/trigger-prime-sync) conhece a implementação concreta.
export type PrimeClient = {
  fetchStudents(): Promise<PrimeStudentDTO[]>;
};

export class PrimeClientNotConfiguredError extends Error {
  constructor() {
    super(
      "Integração com a Prime ainda não configurada — não há credenciais, endpoint nem payload de exemplo definidos.",
    );
    this.name = "PrimeClientNotConfiguredError";
  }
}
