export type StickerType = 'intro' | 'flag' | 'badge' | 'coach' | 'player' | 'squad' | 'stadium' | 'special';
export type Position = 'GOL' | 'ZAG' | 'LAT' | 'VOL' | 'MEI' | 'ATA';
export type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';

export interface Player {
  name: string;
  number: number;
  position: Position;
  stars?: boolean;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  group: string;
  confederation: Confederation;
  colors: [string, string];
  flag: string;
  players: Player[];
}

export interface Sticker {
  id: number;
  name: string;
  team?: string;
  teamCode?: string;
  type: StickerType;
  section: string;
  colors: [string, string];
  flag?: string;
  position?: Position;
  playerNumber?: number;
  stars?: boolean;
}

export interface AlbumStickers {
  [stickerId: number]: {
    owned: boolean;
    duplicates: number;
  };
}

export interface Album {
  id: string;
  name: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  stickers: AlbumStickers;
}

export interface AlbumStats {
  total: number;
  owned: number;
  missing: number;
  duplicatesCount: number;
  percentage: number;
}
