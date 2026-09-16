import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { listGroups } from "../../index";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminAccessDenied, AdminPageHeader, Button, EmptyState } from "@venore/plugin-sdk/ui";
import { CreateGroupDialog } from "./create-group-dialog";
import { EditGroupDialog } from "./edit-group-dialog";
import { DeleteGroupButton } from "./delete-group-button";

export default async function ScoreboardAdminGroupsPage() {
  const gate = await getPluginAdminPageData("scoreboard");
  if (!gate.granted) {
    return <AdminAccessDenied message="Você não tem permissão para gerenciar cursos e segmentos." />;
  }

  const result = await listGroups();
  const groups = result.success ? result.data : [];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Cursos e segmentos"
        description="Catálogo compartilhado entre todos os quadros — atribua um curso/segmento a um widget de meta ou funil em vez de digitar o nome de novo a cada board."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/admin/scoreboard">
                <ArrowLeft className="size-4" />
                Voltar
              </Link>
            </Button>
            <CreateGroupDialog />
          </>
        }
      />

      {!result.success && <p className="text-sm text-destructive">Erro ao carregar o catálogo: {result.error.message}</p>}

      {groups.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="size-8" strokeWidth={1.5} />}
          title="Nenhum curso/segmento cadastrado ainda"
          description="Crie o primeiro para poder atribuí-lo aos widgets dos quadros."
          action={<CreateGroupDialog />}
        />
      ) : (
        <div className="overflow-x-auto rounded-panel border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-caps text-muted-foreground/56">
                <th className="px-4 py-2 font-semibold">Nome</th>
                <th className="px-3 py-2 font-semibold">Código na Prime</th>
                <th className="px-3 py-2 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-2.5 font-medium text-foreground">{group.label}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{group.primeSegmentKey ?? "—"}</td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex justify-end gap-1">
                      <EditGroupDialog groupId={group.id} label={group.label} primeSegmentKey={group.primeSegmentKey} />
                      <DeleteGroupButton groupId={group.id} groupLabel={group.label} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
