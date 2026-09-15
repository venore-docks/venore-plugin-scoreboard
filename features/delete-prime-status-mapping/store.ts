import { eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardPrimeStatusMapping } from "../../database/schema";

export async function deleteMappingById(id: string): Promise<boolean> {
  const rows = await db
    .delete(scoreboardPrimeStatusMapping)
    .where(eq(scoreboardPrimeStatusMapping.id, id))
    .returning({ id: scoreboardPrimeStatusMapping.id });
  return rows.length > 0;
}
