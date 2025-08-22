import type { HomeData } from '@/types/home';

export async function getHome(): Promise<HomeData> {
  const res = await fetch(`https://telegraf.news/api/v1/home.php`);
  if (!res.ok) throw new Error('Home not found');
  const raw = await res.json(); // вместо res.text()
  const data = raw as HomeData;

  // if (!result.success) {
  //   console.error(result.error);
  //   throw new Error('Frontmatter does not match archiveScheme');
  // }

  return data;
}
