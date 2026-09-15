import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBoard, listPrimeStatusMapping } from "../../index";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminAccessDenied, AdminPageHeader, Button } from "@venore/plugin-sdk/ui";
import type { FunnelWidgetConfig } from "../../shared/widget-config/types";
import { CreateMappingForm } from "./create-mapping-form";
import { DeleteMappingButton } from "./delete-mapping-button";

export default async function ScoreboardPrimeMappingPage({ params }: { params: Promise<{ boardId: string }> }) {
  const gate = await getPluginAdminPageData("scoreboard");
  if (!gate.granted) {
    return <AdminAccessDenied message="Você não tem permissão para gerenciar o mapeamento deste quadro." />;
  }

  const { boardId } = await params;
  const boardResult = await getBoard({ boardId });
  if (!boardResult.success) {
    notFound();
  }

  const board = boardResult.data;
  const funnelWidget = board.widgets.find((widget) => widget.kind === "funnel");
  const stages = funnelWidget ? ((funnelWidget.config as FunnelWidgetConfig).stages ?? []) : [];

  const mappingResult = await listPrimeStatusMapping({ boardId });
  const mappings = mappingResult.success ? mappingResult.data : [];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`Mapeamento Prime — ${board.name}`}
        description='Traduz o status cru devolvido pela Prime pra uma etapa do funil deste board — editável aqui, nunca hardcoded em código.'
        actions={
          <Button variant="outline" asChild>
            <Link href={`/admin/scoreboard/${board.id}`}>
              <ArrowLeft className="size-4" />
              Voltar ao quadro
            </Link>
          </Button>
        }
      />

      {stages.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Este board não tem um widget de funil ainda — crie um antes de cadastrar mapeamentos.
        </p>
      )}

      {!mappingResult.success && <p className="text-sm text-destructive">Erro ao carregar mapeamentos: {mappingResult.error.message}</p>}

      <div className="overflow-x-auto rounded-panel border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-caps text-muted-foreground/56">
              <th className="px-4 py-2 font-semibold">Status cru (Prime)</th>
              <th className="px-3 py-2 font-semibold">Etapa</th>
              <th className="px-3 py-2 font-semibold">Rótulo</th>
              <th className="px-3 py-2 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {mappings.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  Nenhum mapeamento cadastrado ainda.
                </td>
              </tr>
            ) : (
              mappings.map((mapping) => (
                <tr key={mapping.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-2.5 font-mono text-xs text-foreground">{mapping.rawStatus}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {stages.find((stage) => stage.key === mapping.stageKey)?.label ?? mapping.stageKey}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{mapping.label ?? "—"}</td>
                  <td className="px-3 py-2.5 text-right">
                    <DeleteMappingButton boardId={board.id} mappingId={mapping.id} rawStatus={mapping.rawStatus} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CreateMappingForm boardId={board.id} stages={stages} />
    </div>
  );
}
