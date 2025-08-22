import type { MetaHead } from '../schemas/meat-head';
import type { PostCardItem } from '../schemas/post-card';

export type HomeData = {
  metaHead: MetaHead;
  newsBlockOne?: PostCardItem[];
};
