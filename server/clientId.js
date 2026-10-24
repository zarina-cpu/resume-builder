const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function parseClientId(req) {
  const id = req.query?.clientId || req.headers?.['x-client-id']
  if (!id || typeof id !== 'string' || !UUID_RE.test(id)) return null
  return id
}
