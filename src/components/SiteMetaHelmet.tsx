import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LANGS = new Set(['en', 'vi']);

function normalizeDocumentLang(code: string): 'en' | 'vi' {
  const base = code.split('-')[0]?.toLowerCase() ?? 'en';
  return SUPPORTED_LANGS.has(base) ? (base as 'en' | 'vi') : 'en';
}

export function SiteMetaHelmet() {
  const { t, i18n } = useTranslation('translation');
  const lang = normalizeDocumentLang(i18n.language);

  const fromEnv = import.meta.env.VITE_APP_ORIGIN;
  const origin =
    typeof fromEnv === 'string' && fromEnv.length > 0
      ? fromEnv.replace(/\/$/, '')
      : typeof window !== 'undefined'
        ? window.location.origin
        : '';

  const pageUrl = origin ? `${origin}/` : '/';
  const imageUrl = origin ? `${origin}/images/logox1.png` : '/images/logox1.png';

  const title = t('site_meta.title');
  const description = t('site_meta.description');
  const siteName = t('site_meta.site_name');

  return (
    <Helmet htmlAttributes={{ lang }} prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}

