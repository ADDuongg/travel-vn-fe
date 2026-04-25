import { pickLocale } from '@/features/provinces/locale';
import type { BlogCategory, BlogPostDetail, BlogPostTranslation, BlogTag, EditorJsBlock } from './types';
import type { LangKey } from '@/utils/addressOptions';

function fallbackTranslation(
  translations: Record<string, BlogPostTranslation> | undefined,
  lang: LangKey,
  language: string,
): BlogPostTranslation {
  const short = language.split('-')[0]?.toLowerCase() ?? language;
  if (!translations) return {};
  return (
    translations[language] ??
    translations[short] ??
    translations[lang] ??
    translations.vi ??
    translations.en ??
    Object.values(translations).find((item) => !!item) ??
    {}
  );
}

export function pickBlogTranslation(
  post: Pick<BlogPostDetail, 'translations'> | { translations?: Record<string, BlogPostTranslation> },
  lang: LangKey,
  language: string,
) {
  const translation = fallbackTranslation(post.translations, lang, language);
  return {
    title: translation.title ?? '',
    excerpt: translation.excerpt ?? '',
    content: translation.content ?? [],
    tableOfContents: translation.tableOfContents ?? [],
    readingTime: translation.readingTime ?? 0,
  };
}

export function pickCategoryName(category: BlogCategory | null | undefined, language: string) {
  return pickLocale(category?.name, language) ?? category?.slug ?? '';
}

export function pickTagName(tag: BlogTag | null | undefined, language: string) {
  return pickLocale(tag?.name, language) ?? tag?.slug ?? '';
}

function getTextFromBlockData(data: Record<string, unknown> | undefined): string {
  if (!data) return '';
  const values = Object.values(data);
  return values
    .map((value) => {
      if (typeof value === 'string') return value;
      if (Array.isArray(value)) return value.filter((item) => typeof item === 'string').join(' ');
      return '';
    })
    .join(' ');
}

export function getBlogPlainText(blocks: EditorJsBlock[] | undefined) {
  if (!blocks?.length) return '';
  return blocks
    .map((block) => getTextFromBlockData(block.data))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
