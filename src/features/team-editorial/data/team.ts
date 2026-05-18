export const teamImage = (id: string) =>
  `https://images.unsplash.com/${id}?ixlib=rb-4.1.0&auto=format&fit=crop&q=85&w=2400`;

export const TEAM_CHAPTER_IDS = ['s01', 's02', 's03', 's04'] as const;
export type TeamChapterId = (typeof TEAM_CHAPTER_IDS)[number];

export type TeamSecondaryStill = {
  src: string;
  aspect: string;
};

export type TeamPortraitChapterMeta = {
  scene: TeamChapterId;
  portraitSrc: string;
  secondaryStill?: TeamSecondaryStill;
};
export const teamVisuals = {
  hero: teamImage('photo-1488646953014-85cb44e25828'),
  interlude: teamImage('photo-1464822759023-fed622ff2c3b'),
  closing: teamImage('photo-1559827260-dc66d52bef19'),
} as const;
export const teamPortraitChapters: readonly TeamPortraitChapterMeta[] = [
  {
    scene: 's01',
    portraitSrc: teamImage('photo-1544005313-94ddf0286df2'),
    secondaryStill: {
      src: teamImage('photo-1469474968028-56623f02e42e'),
      aspect: 'aspect-[16/10]',
    },
  },
  {
    scene: 's02',
    portraitSrc: teamImage('photo-1506794778202-cad84cf45f1d'),
    secondaryStill: {
      src: teamImage('photo-1583417319070-4a69db38a482'),
      aspect: 'aspect-[5/6]',
    },
  },
  {
    scene: 's03',
    portraitSrc: teamImage('photo-1507003211169-0a1dd7228f2d'),
  },
  {
    scene: 's04',
    portraitSrc: teamImage('photo-1534528741775-53994a69daeb'),
    secondaryStill: {
      src: teamImage('photo-1500530855697-b586d89ba3ee'),
      aspect: 'aspect-[3/4]',
    },
  },
];

