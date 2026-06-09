import type { Sticker, StickerType, Position } from '../types';
import { teams } from './teams';

const introStickers: Sticker[] = [
  { id: 1, name: 'Capa do Álbum', type: 'intro', section: 'Introdução', colors: ['#009C3B', '#FFDF00'] },
  { id: 2, name: 'Copa do Mundo 2026', type: 'intro', section: 'Introdução', colors: ['#002395', '#FFFFFF'] },
  { id: 3, name: 'EUA - País Sede', type: 'intro', section: 'Introdução', colors: ['#B22234', '#3C3B6E'] },
  { id: 4, name: 'México - País Sede', type: 'intro', section: 'Introdução', colors: ['#006847', '#CE1126'] },
  { id: 5, name: 'Canadá - País Sede', type: 'intro', section: 'Introdução', colors: ['#FF0000', '#FFFFFF'] },
  { id: 6, name: 'MetLife Stadium', type: 'stadium', section: 'Estádios', colors: ['#1A1A2E', '#FFFFFF'] },
  { id: 7, name: 'SoFi Stadium', type: 'stadium', section: 'Estádios', colors: ['#002244', '#FFFFFF'] },
  { id: 8, name: 'AT&T Stadium', type: 'stadium', section: 'Estádios', colors: ['#003087', '#FFFFFF'] },
  { id: 9, name: "Levi's Stadium", type: 'stadium', section: 'Estádios', colors: ['#AA0000', '#B3995D'] },
  { id: 10, name: 'Rose Bowl', type: 'stadium', section: 'Estádios', colors: ['#003DA5', '#FFFFFF'] },
  { id: 11, name: 'Arrowhead Stadium', type: 'stadium', section: 'Estádios', colors: ['#E31837', '#FFB81C'] },
  { id: 12, name: 'NRG Stadium', type: 'stadium', section: 'Estádios', colors: ['#03202F', '#A71930'] },
  { id: 13, name: 'Estadio Azteca', type: 'stadium', section: 'Estádios', colors: ['#006847', '#CE1126'] },
  { id: 14, name: 'Estadio Guadalajara', type: 'stadium', section: 'Estádios', colors: ['#CC0000', '#FFFFFF'] },
  { id: 15, name: 'BC Place', type: 'stadium', section: 'Estádios', colors: ['#002855', '#FFFFFF'] },
  { id: 16, name: 'BMO Field', type: 'stadium', section: 'Estádios', colors: ['#CC0000', '#000000'] },
  { id: 17, name: 'Estadio BBVA', type: 'stadium', section: 'Estádios', colors: ['#003087', '#FFFFFF'] },
  { id: 18, name: 'Mascote', type: 'intro', section: 'Introdução', colors: ['#FF6B00', '#FFFFFF'] },
  { id: 19, name: 'Troféu FIFA', type: 'intro', section: 'Introdução', colors: ['#C9A84C', '#FFFFFF'] },
  { id: 20, name: 'Bola Oficial', type: 'intro', section: 'Introdução', colors: ['#000000', '#FFFFFF'] },
  { id: 21, name: 'Craque Especial - Lionel Messi', type: 'special', section: 'Especiais', colors: ['#74ACDF', '#FFFFFF'], stars: true },
  { id: 22, name: 'Craque Especial - Kylian Mbappé', type: 'special', section: 'Especiais', colors: ['#002395', '#ED2939'], stars: true },
  { id: 23, name: 'Craque Especial - Vinicius Jr', type: 'special', section: 'Especiais', colors: ['#009C3B', '#FFDF00'], stars: true },
  { id: 24, name: 'Craque Especial - Cristiano Ronaldo', type: 'special', section: 'Especiais', colors: ['#006600', '#FF0000'], stars: true },
  { id: 25, name: 'Craque Especial - Erling Haaland', type: 'special', section: 'Especiais', colors: ['#EF0107', '#FFFFFF'], stars: true },
  { id: 26, name: 'Craque Especial - Jude Bellingham', type: 'special', section: 'Especiais', colors: ['#FFFFFF', '#CF081F'], stars: true },
  { id: 27, name: 'Craque Especial - Lamine Yamal', type: 'special', section: 'Especiais', colors: ['#AA151B', '#F1BF00'], stars: true },
  { id: 28, name: 'Craque Especial - Rodri', type: 'special', section: 'Especiais', colors: ['#AA151B', '#F1BF00'], stars: true },
  { id: 29, name: 'Craque Especial - Son Heung-min', type: 'special', section: 'Especiais', colors: ['#CD2E3A', '#003478'], stars: true },
  { id: 30, name: 'Craque Especial - Luka Modrić', type: 'special', section: 'Especiais', colors: ['#FF0000', '#FFFFFF'], stars: true },
];

let currentId = 31;

const teamStickers: Sticker[] = teams.flatMap((team) => {
  const section = `Grupo ${team.group} - ${team.name}`;
  const base = { team: team.name, teamCode: team.code, colors: team.colors, flag: team.flag, section };

  const stickers: Sticker[] = [
    { id: currentId++, name: `${team.name} - Bandeira`, type: 'flag' as StickerType, ...base },
    { id: currentId++, name: `${team.name} - Escudo`, type: 'badge' as StickerType, ...base },
    { id: currentId++, name: `${team.name} - Técnico`, type: 'coach' as StickerType, ...base },
  ];

  for (const player of team.players) {
    stickers.push({
      id: currentId++,
      name: player.name,
      type: 'player' as StickerType,
      position: player.position as Position,
      playerNumber: player.number,
      stars: player.stars,
      ...base,
    });
  }

  stickers.push({ id: currentId++, name: `${team.name} - Seleção`, type: 'squad' as StickerType, ...base });

  return stickers;
});

export const stickers: Sticker[] = [...introStickers, ...teamStickers];
export const TOTAL_STICKERS: number = stickers.length;
