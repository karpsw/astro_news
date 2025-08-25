import type { PostBlocks } from '@/types/PostBlocks';

export async function getPostBlocks(): Promise<PostBlocks> {
  const res = await fetch(`https://telegraf.news/api/v1/postBlocks.php`);
  if (!res.ok) throw new Error('Home not found');
  const raw = await res.json(); // вместо res.text()
  const data = raw as PostBlocks;
  return data;
}
