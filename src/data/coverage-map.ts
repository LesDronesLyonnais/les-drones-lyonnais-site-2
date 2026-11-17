// Homepage coverage map (CoverageMap.astro), drawn after the map on les-formateurs-ia.fr:
// one simplified outline of mainland France, cities in the same projection
// (viewBox -70 -30 1040 1020; ≈ 0.95 unit per km, so 100 km ≈ 95 units).
export const COVERAGE_MAP = {
  viewBox: '-70 -30 1040 1020',
  outline:
    'M552.3,26.5L496.2,42.4L492.5,116.6L394,169.6L386.7,196.1L357.5,212L299.2,206.7L284.6,169.6L237.1,169.6L262.7,222.6L270,280.9L182.4,296.8L116.7,265L32.8,291.5L65.7,318L36.5,349.8L65.7,371L131.3,381.6L197,402.8L222.5,434.6L233.5,477L291.9,530L299.2,572.4L288.2,625.4L291.9,704.9L284.6,773.8L266.3,826.8L249.5,841.6L284.6,874.5L357.5,895.7L430.5,901L503.5,932.8L610.7,938.1L602,879.8L634.8,848L685.9,832.1L744.2,842.7L769.8,858.6L824.5,874.5L868.3,837.4L908.4,810.9L926.7,795L937.6,757.9L882.9,731.4L886.5,651.9L875.6,583L828.2,540.6L824.5,498.2L886.5,418.7L930.3,397.5L934,339.2L948.6,286.2L977.7,247L919.4,227.9L871.9,222.6L846.4,195L802.6,185.5L733.3,137.8L729.7,121.9L678.6,106L642.1,84.8L605.6,55.1L565.5,23.3Z',
  lyon: { x: 732.2, y: 586.5 },
  ring100km: 95.4,
  // Labels: side of the dot ('start' = right, 'end' = left, 'top' = above, 'top-end' = above, ending on the dot).
  cities: [
    { name: 'Paris', x: 550.9, y: 258.6, label: 'end' },
    { name: 'Lille', x: 602.5, y: 70.6, label: 'start' },
    { name: 'Strasbourg', x: 945.1, y: 288.6, label: 'top-end' },
    { name: 'Nantes', x: 265.9, y: 432.2, label: 'end' },
    { name: 'Bordeaux', x: 337.0, y: 684.7, label: 'end' },
    { name: 'Toulouse', x: 484.7, y: 815.4, label: 'end' },
    { name: 'Marseille', x: 771.2, y: 848.0, label: 'start' },
    { name: 'Nice', x: 909.4, y: 804.2, label: 'top' },
  ],
} as const;
