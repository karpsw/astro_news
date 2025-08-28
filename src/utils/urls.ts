export const getHostnameFromUrl = (url: string): string => new URL(url).hostname;
export const wrapUrl = (url: string): string => {
  const SITE_URL = import.meta.env.SITE_URL;

  if (url.startsWith('/')) {
    return SITE_URL + url;
  } else {
    try {
      const parsed = new URL(url);
      parsed.hostname = new URL(SITE_URL).hostname;
      parsed.protocol = new URL(SITE_URL).protocol;
      parsed.port = new URL(SITE_URL).port;
      return SITE_URL + parsed.pathname + parsed.search + parsed.hash;
    } catch {
      return url; // fallback если URL некорректный
    }
  }
  return url;
};
