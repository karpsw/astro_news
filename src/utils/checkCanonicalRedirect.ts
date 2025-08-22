export async function checkCanonicalRedirect(
  request: Request,
  canonicalUrl: string
): Promise<string | null> {
  const currentPath = new URL(request.url).pathname;
  const canonicalPath = new URL(canonicalUrl).pathname;

  if (canonicalPath !== currentPath) {
    return canonicalUrl.replace('https://telegraf.news/', 'http://localhost:3000/');
  }

  return null;
}
