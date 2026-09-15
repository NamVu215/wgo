// Cloudflare Pages Function: /api/luot-xem
// GET  → { tong, homNay }   POST → counts one visit, then returns the same.
// Stores one number per day (Vietnam time) in D1 (binding DB, schema in db/luot-xem.sql). No IP, no cookies.

type D1Result<T> = { results: T[] };
type D1Statement = { bind: (...values: unknown[]) => D1Statement; run: () => Promise<unknown>; all: <T>() => Promise<D1Result<T>> };
type Env = { DB?: { prepare: (sql: string) => D1Statement } };
type Context = { request: Request; env: Env };

const today = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const SCHEMA = 'CREATE TABLE IF NOT EXISTS luot_xem (ngay TEXT PRIMARY KEY, so INTEGER NOT NULL DEFAULT 0)';

// Creates the table on a fresh database, then retries once.
async function withTable<T>(env: Env, job: () => Promise<T>): Promise<T> {
  try {
    return await job();
  } catch (err) {
    if (!/no such table/i.test(String(err))) throw err;
    await env.DB!.prepare(SCHEMA).run();
    return job();
  }
}

async function totals(env: Env, ngay: string) {
  const { results } = await env.DB!
    .prepare('SELECT COALESCE(SUM(so), 0) AS tong, COALESCE(MAX(CASE WHEN ngay = ?1 THEN so END), 0) AS homNay FROM luot_xem')
    .bind(ngay)
    .all<{ tong: number; homNay: number }>();
  return results[0] ?? { tong: 0, homNay: 0 };
}

export async function onRequestGet({ env }: Context) {
  if (!env.DB) return json({ error: 'chua-noi-db' }, 503);
  return json(await withTable(env, () => totals(env, today())));
}

export async function onRequestPost({ request, env }: Context) {
  if (!env.DB) return json({ error: 'chua-noi-db' }, 503);
  // Only count visits sent by WGo pages themselves.
  const origin = request.headers.get('origin');
  if (!origin || new URL(origin).host !== new URL(request.url).host) return json({ error: 'khong-hop-le' }, 403);
  const ngay = today();
  const db = env.DB;
  await withTable(env, () =>
    db.prepare('INSERT INTO luot_xem (ngay, so) VALUES (?1, 1) ON CONFLICT(ngay) DO UPDATE SET so = so + 1').bind(ngay).run());
  return json(await totals(env, ngay));
}
