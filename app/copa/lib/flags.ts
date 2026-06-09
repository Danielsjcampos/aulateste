export const FLAG_CDN: Record<string, string> = {
  BRA: 'br', ESP: 'es', NGA: 'ng', NZL: 'nz',
  ARG: 'ar', FRA: 'fr', CMR: 'cm', JOR: 'jo',
  GER: 'de', POR: 'pt', MAR: 'ma', ECU: 'ec',
  ENG: 'gb-eng', NED: 'nl', JPN: 'jp', KSA: 'sa',
  ITA: 'it', BEL: 'be', SEN: 'sn', AUS: 'au',
  USA: 'us', MEX: 'mx', URU: 'uy', BOL: 'bo',
  COL: 'co', POL: 'pl', EGY: 'eg', IRN: 'ir',
  CRO: 'hr', SRB: 'rs', GHA: 'gh', KOR: 'kr',
  CAN: 'ca', CRC: 'cr', CIV: 'ci', QAT: 'qa',
  SUI: 'ch', DEN: 'dk', ALG: 'dz', UZB: 'uz',
  UKR: 'ua', TUR: 'tr', HON: 'hn', PAN: 'pa',
  VEN: 've', PER: 'pe', MLI: 'ml', CHI: 'cl',
};

export function getFlagUrl(teamCode: string, size: 40 | 80 | 160 = 80): string {
  const iso = FLAG_CDN[teamCode];
  if (!iso) return '';
  return `https://flagcdn.com/w${size}/${iso}.png`;
}
