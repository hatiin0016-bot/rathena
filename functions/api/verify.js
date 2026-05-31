export async function onRequest(context) {
  const url = new URL(context.request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return Response.json({ valid: false, error: 'no token' });
  }

  const db = context.env.DB;

  const result = await db.prepare(
    "SELECT char_id FROM passive_tokens WHERE token = ? AND expire_at > NOW()"
  ).bind(token).first();

  if (!result) {
    return Response.json({ valid: false, error: 'invalid or expired token' });
  }

  return Response.json({ valid: true, char_id: result.char_id });
}
