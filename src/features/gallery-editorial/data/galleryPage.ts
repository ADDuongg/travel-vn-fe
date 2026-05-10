const u = (id: string) =>
  `https://images.unsplash.com/${id}?ixlib=rb-4.1.0&auto=format&fit=crop&q=85&w=2400`;

export const galleryVisuals = {
  hero: u('photo-1529692236671-f1f6cf9683ba'),
  featured1: u('photo-1559827260-dc66d52bef19'),
  featured2: u('photo-1583417319070-4a69db38a482'),
  closing: u('photo-1476514525535-07fb3b4ae5f1'),
} as const;

export type GalleryChapterImage = {
  src: string;
  aspect: string;
  span: string;
};

export type GalleryChapterMeta = {
  id: string;
  tint: string;
  images: readonly GalleryChapterImage[];
  hasHint?: boolean;
};

export const galleryChapterIds = [
  'ch01',
  'ch02',
  'ch03',
  'ch04',
  'ch05',
  'ch06',
  'ch07',
  'ch08',
  'ch09',
  'ch10',
] as const;

export type GalleryChapterId = (typeof galleryChapterIds)[number];

export const galleryChapters: readonly GalleryChapterMeta[] = [
  {
    id: 'ch01',
    images: [
      { src: u('photo-1559827260-dc66d52bef19'), aspect: 'aspect-[4/5]', span: 'md:col-span-5' },
      { src: u('photo-1555396273-367ea4eb4db5'), aspect: 'aspect-[16/11]', span: 'md:col-span-7' },
    ],
    tint: 'from-charcoal/38 via-transparent to-charcoal/16',
  },
  {
    id: 'ch02',
    images: [
      { src: u('photo-1464822759023-fed622ff2c3b'), aspect: 'aspect-[16/10]', span: 'md:col-span-7' },
      { src: u('photo-1506905925346-21bda4d32df4'), aspect: 'aspect-[3/4]', span: 'md:col-span-5' },
    ],
    tint: 'from-charcoal/34 via-transparent to-charcoal/22',
  },
  {
    id: 'ch03',
    images: [
      { src: u('photo-1583417319070-4a69db38a482'), aspect: 'aspect-[5/6]', span: 'md:col-span-4' },
      { src: u('photo-1551218808-94e220e084d2'), aspect: 'aspect-[16/11]', span: 'md:col-span-8' },
    ],
    tint: 'from-charcoal/42 via-transparent to-charcoal/18',
  },
  {
    id: 'ch04',
    images: [
      { src: u('photo-1559827260-dc66d52bef19'), aspect: 'aspect-[16/9]', span: 'md:col-span-8' },
      { src: u('photo-1507525428034-b723cf961d3e'), aspect: 'aspect-[4/5]', span: 'md:col-span-4' },
    ],
    tint: 'from-charcoal/32 via-transparent to-charcoal/20',
  },
  {
    id: 'ch05',
    images: [
      { src: u('photo-1500530855697-b586d89ba3ee'), aspect: 'aspect-[3/4]', span: 'md:col-span-5' },
      { src: u('photo-1559827260-dc66d52bef19'), aspect: 'aspect-[16/10]', span: 'md:col-span-7' },
    ],
    tint: 'from-charcoal/48 via-charcoal/10 to-charcoal/24',
    hasHint: true,
  },
  {
    id: 'ch06',
    images: [
      { src: u('photo-1495474472287-4d71bcdd2085'), aspect: 'aspect-[16/11]', span: 'md:col-span-7' },
      { src: u('photo-1517248135467-4c7edcad34c4'), aspect: 'aspect-[4/5]', span: 'md:col-span-5' },
    ],
    tint: 'from-charcoal/36 via-transparent to-charcoal/18',
  },
  {
    id: 'ch07',
    images: [
      { src: u('photo-1469474968028-56623f02e42e'), aspect: 'aspect-[16/10]', span: 'md:col-span-6' },
      { src: u('photo-1469854523086-cc02fe5d8800'), aspect: 'aspect-[16/10]', span: 'md:col-span-6' },
    ],
    tint: 'from-charcoal/30 via-transparent to-charcoal/16',
  },
  {
    id: 'ch08',
    images: [
      { src: u('photo-1507525428034-b723cf961d3e'), aspect: 'aspect-[5/6]', span: 'md:col-span-4' },
      { src: u('photo-1528164344705-47542687000d'), aspect: 'aspect-[16/11]', span: 'md:col-span-8' },
    ],
    tint: 'from-charcoal/40 via-transparent to-charcoal/22',
  },
  {
    id: 'ch09',
    images: [
      { src: u('photo-1555396273-367ea4eb4db5'), aspect: 'aspect-[16/10]', span: 'md:col-span-7' },
      { src: u('photo-1520250497591-112f2f40a3f4'), aspect: 'aspect-[3/4]', span: 'md:col-span-5' },
    ],
    tint: 'from-charcoal/44 via-transparent to-charcoal/20',
  },
  {
    id: 'ch10',
    images: [
      { src: u('photo-1469854523086-cc02fe5d8800'), aspect: 'aspect-[16/9]', span: 'md:col-span-8' },
      { src: u('photo-1500530855697-b586d89ba3ee'), aspect: 'aspect-[4/5]', span: 'md:col-span-4' },
    ],
    tint: 'from-charcoal/34 via-transparent to-charcoal/24',
  },
];

export const storyStillIds = ['ss1', 'ss2', 'ss3'] as const;
export type StoryStillId = (typeof storyStillIds)[number];

export const galleryStoryStills: Record<StoryStillId, { src: string }> = {
  ss1: { src: u('photo-1551218808-94e220e084d2') },
  ss2: { src: u('photo-1528164344705-47542687000d') },
  ss3: { src: u('photo-1476514525535-07fb3b4ae5f1') },
};
