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

export interface SideBarCurrDaysDto {
  today: SideBarCurrDto; // Дата обновления (например, "2025-08-26")
  previous: SideBarCurrDto; // Дата обновления (например, "2025-08-26")
}

interface SideBarCurrDto {
  date: string; // Дата обновления (например, "2025-08-26")
  currencies: CurrencyDto[];
}
export interface SideBarDto {
  curr: SideBarCurrDto; // Дата обновления (например, "2025-08-26")
  news_lenta: PostCardItem[];
  nadvor: NadvorDto;
}

export interface NadvorDto {
  last_updated: string; // "2025-08-26 12:36:56"
  cities_count: number;
  data: Record<string, CityWeather | CityWeatherError>;
}

interface CityWeatherError {
  error: string;
}

export interface CityWeather {
  name: string;
  current: CurrentWeather;
  forecast_tomorrow: ForecastWeather;
  forecast_day_after: ForecastWeather;
}

interface CurrentWeather {
  date: string; // "26.08.2025 16:30"
  temperature: string; // "+24"
  icon: string;
  condition: string;
  wind: {
    speed: number;
    gust: number;
    direction: string;
  };
  humidity: number;
  precipitation: number;
  pressure: number;
  feels_like: string; // "+23"
}

interface ForecastWeather {
  date: string; // "27.08.2025"
  max_temp: string; // "+24"
  min_temp: string; // "+9"
  icon: string;
  wind_speed: number;
  humidity: number;
  precipitation: number;
}
