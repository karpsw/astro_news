import type { MetaHead } from '@/schemas/meat-head';
import type { PostCardItem } from '@/schemas/post-card';

export type HomeData = {
  metaHead: MetaHead;
  newsBlockOne?: PostCardItem[];
};

export interface CurrencyDto {
  code: string; // Валютный код, например "USD"
  scale: number; // Масштаб (например, 1, 10, 100)
  name: string; // Название валюты
  rate: number; // Курс в BYN
  date: string; // Дата в ISO-формате
}

export interface SideBarCurrDto {
  date: string; // Дата обновления (например, "2025-08-26")
  currencies: CurrencyDto[];
}
export interface SideBarDto {
  curr: SideBarCurrDto; // Дата обновления (например, "2025-08-26")
  news_lenta: PostCardItem[];
}
