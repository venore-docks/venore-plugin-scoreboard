import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPrimeSyncStatus } from "../../index";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminAccessDenied, AdminPageHeader, Badge, Button } from "@venore/plugin-sdk/ui";
import { TriggerSyncButton } from "./trigger-sync-button";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

const STATUS_BADGE = {
  running: { label: "Rodando", variant: "outline" as const },
  success: { label: "Sucesso", variant: "default" as const },
  failed: { label: "Falhou", variant: "destructive" as const },
};

export default async function ScoreboardPrimeSyncPage() {
  const gate = await getPluginAdminPageData("scoreboard");
  if (!gate.granted) {
    return <AdminAccessDenied message="Você não tem permissão para gerenciar a sincronização com a Prime." />;
  }

  const result = await getPrimeSyncStatus();
  const logs = result.success ? result.data : [];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Sincronização Prime"
        description="Consulta a API da Prime, atualiza o espelho local e recalcula os widgets dos boards com dataSource=prime_sync."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/admin/scoreboard">
                <ArrowLeft className="size-4" />
                Voltar
              </Link>
            </Button>
            <TriggerSyncButton />
          </>
        }
      />

      {!result.success && <p className="text-sm text-destructive">Erro ao carregar o histórico: {result.error.message}</p>}

      <div className="overflow-x-auto rounded-panel border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-caps text-muted-foreground/56">
              <th className="px-4 py-2 font-semibold">Início</th>
              <th className="px-3 py-2 font-semibold">Status</th>
              <th className="px-3 py-2 font-semibold tabular-nums">Alunos</th>
              <th className="px-3 py-2 font-semibold tabular-nums">Boards</th>
              <th className="px-3 py-2 font-semibold">Erro</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  Nenhuma sincronização disparada ainda.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-2.5 tabular-nums text-foreground">{dateFormatter.format(log.startedAt)}</td>
                  <td className="px-3 py-2.5">
                    <Badge variant={STATUS_BADGE[log.status].variant} className="text-[10px]">
                      {STATUS_BADGE[log.status].label}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{log.studentsUpserted ?? log.studentsFetched ?? "—"}</td>
                  <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{log.boardsRecomputed?.length ?? "—"}</td>
                  <td className="px-3 py-2.5 text-xs text-destructive">{log.errorMessage ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
