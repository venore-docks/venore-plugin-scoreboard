import { isPluginActive } from "@venore/plugin-sdk";
import { getBoardViewHandler } from "../../../features/get-board-view/handler";

export async function GET(_request: Request, { params }: { params: Promise<{ boardId: string }> }): Promise<Response> {
  if (!(await isPluginActive("scoreboard"))) {
    return Response.json({ error: "O plugin de Indicadores está desabilitado." }, { status: 404 });
  }

  const { boardId } = await params;
  const result = await getBoardViewHandler({ boardId });
  if (!result.success) {
    const status = result.error.code === "rbac.authorization.unauthenticated" ? 401 : 404;
    return Response.json({ error: result.error.message }, { status });
  }

  return Response.json(result.data);
}
