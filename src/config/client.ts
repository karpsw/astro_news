import {PLAUSIBLE_SCRIPT_URL, SITE_URL} from 'astro:env/client';

import { configClientSchema } from '@/schemas/config';
import { validateData } from '@/utils/validation';

import type { ConfigClientType } from '@/types/config';

const configClientData: ConfigClientType = {
  /** all urls without '/' */
  SITE_URL,
  SEARCH_URL:'/search',
  SITE_TITLE: 'Новости Беларуси и мира сегодня: последние, свежие и главные новости часа - Telegraf.news',
  SITE_DESCRIPTION: 'Горячие новости Беларуси и мира ✅ Только свежие и последние актуальные белорусские и мировые новости ✅ Видеоролики и фотографии.',
  PLAUSIBLE_SCRIPT_URL,
  PAGE_SIZE_POST_CARD: 3,
  PAGE_SIZE_POST_CARD_SMALL: 6,
  MORE_POSTS_COUNT: 3,
  DEFAULT_MODE: 'light',
  DEFAULT_THEME: 'default-light',
  AUTHOR_NAME: 'Astro.news',
  AUTHOR_EMAIL: 'email@email.com',
  AUTHOR_GITHUB: 'https://github.com/nemanjam',
  AUTHOR_LINKEDIN: 'https://www.linkedin.com/in/nemanja-mitic',
  AUTHOR_TWITTER: 'https://x.com/nemanja_codes',
  AUTHOR_YOUTUBE: 'https://www.youtube.com/@nemanja_codes',
  REPO_URL: 'https://github.com/nemanjam/nemanjam.github.io',
};

export const CONFIG_CLIENT = validateData(configClientData, configClientSchema);
