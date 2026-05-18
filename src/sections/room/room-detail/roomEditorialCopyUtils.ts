import type { Room } from '@/features/rooms/types';

export function toParagraphs(description: string): string[] {
  const plain = description
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!plain) {
    return [];
  }
  const parts = plain.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (parts.length > 1) return parts;
  if (plain.length > 480) {
    const half = Math.floor(plain.length / 2);
    const breakAt = plain.lastIndexOf(' ', half + 120);
    if (breakAt > half - 120 && breakAt > 0) {
      return [plain.slice(0, breakAt).trim(), plain.slice(breakAt).trim()];
    }
  }
  return [plain];
}

export function hasRoomEditorialStory(room: Room, lang: string): boolean {
  const tr =
    room.translations?.[lang] ??
    room.translations?.vi ??
    room.translations?.en;
  return toParagraphs(tr?.description ?? '').length > 0;
}

