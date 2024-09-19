import { ROUTES } from '@/constants/routes';

/** Doesn't contain Home nav item. */
export const NAVIGATION_ITEMS = [
  {
    title: 'Новости',
    path: ROUTES.NEWS,
  },
  {
    title: 'Беларусь',
    path: ROUTES.BELARUS,
  },
  {
    title: 'Мир',
    path: ROUTES.WORLD,
  },
  {
    title: 'Политика',
    path: ROUTES.POLITICA,
  },
  {
    title: 'Общество',
    path: ROUTES.OBSHESTVO,
  },
  {
    title: 'Технологии',
    path: ROUTES.IT,
  }
] as const;
