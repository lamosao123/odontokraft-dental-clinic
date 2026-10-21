import { createServerFn } from "@tanstack/react-start";
import { CLINIC_STAFF, SERVICES } from "@/lib/finance/seed";

const COLLECTIONS = [
  "sales",
  "dailySales",
  "balances",
  "advances",
  "expenses",
  "employees",
  "payroll",
  "services",
  "others",
  "beginnings",
  "control",
] as const;

type Collection = (typeof COLLECTIONS)[number];

function asCollection(value: unknown): Collection {
  if (typeof value === "string" && (COLLECTIONS as readonly string[]).includes(value)) return value as Collection;
  throw new Error("Unknown book entry.");
}

export const pullClinic = createServerFn({ method: "POST" })
  .validator((data: { since?: number }) => {
    const since = Number(data?.since ?? 0);
    if (!Number.isFinite(since) || since < 0) throw new Error("Bad cursor.");
    return { since: Math.floor(since) };
  })
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const count = await sql<{ n: number }>`select count(*)::int as n from clinic_ops`;
    if (Number(count[0]?.n ?? 0) === 0) {
      for (const person of CLINIC_STAFF) {
        await sql`insert into clinic_ops (collection, item_id, payload) values ('employees', ${person.id}, ${JSON.stringify(person)}::jsonb)`;
      }
      for (const service of SERVICES) {
        await sql`insert into clinic_ops (collection, item_id, payload) values ('services', ${service.id}, ${JSON.stringify(service)}::jsonb)`;
      }
    }
    const rows = await sql<{ id: number; collection: string; item_id: string; payload: unknown }>`
      select id, collection, item_id, payload
      from clinic_ops
      where id > ${data.since}
      order by id asc
      limit 400
    `;
    return {
      ops: rows.map((row) => ({
        id: Number(row.id),
        collection: row.collection,
        itemId: row.item_id,
        payload: typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload,
      })),
    };
  });

export const pushClinic = createServerFn({ method: "POST" })
  .validator((data: { collection?: unknown; itemId?: unknown; payload?: unknown }) => {
    const collection = asCollection(data?.collection);
    const itemId = typeof data?.itemId === "string" ? data.itemId.trim() : "";
    if (!itemId || itemId.length > 80) throw new Error("Bad entry.");
    if (data?.payload != null && typeof data.payload !== "object") throw new Error("Bad entry.");
    const payload = data?.payload ?? null;
    if (payload && JSON.stringify(payload).length > 800000) throw new Error("Entry is too large.");
    return { collection, itemId, payload };
  })
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const json = data.payload == null ? null : JSON.stringify(data.payload);
    const rows = await sql<{ id: number }>`
      insert into clinic_ops (collection, item_id, payload)
      values (${data.collection}, ${data.itemId}, ${json}::jsonb)
      returning id
    `;
    return { id: Number(rows[0]?.id ?? 0) };
  });
