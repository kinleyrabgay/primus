/**
 * Application-specific Color Tokens
 *
 * Custom colors for app layouts, overlays, and branding.
 * NOT semantic colors—use PrimeNG semantic tokens (primary, success, error, etc.) for those.
 *
 * These are exposed as CSS variables via the PrimeNG preset (--p-dark-87, --p-oslo-gray, etc.).
 * For SCSS: `color: var(--p-oslo-gray)`
 * For Tailwind: Add to @theme in styles.css for utilities like `bg-oslo-gray`
 *
 * @see COLOR_ARCHITECTURE.md
 */

export const appColors = {
  // Overlay / opacity shades
  'dark-60': '#02102599',
  'dark-87': '#04142EDE',

  // Utility
  'white': '#ffffff',

  // App-specific grays and states
  'disable': '#D9DBDC',
  'black-light': '#9E9E9E',
  'func-green': '#99B2A7',
  'func-pink': '#DE849E',
  'func-danube': '#5E94CF',
  'func-taupe': '#C48D8A',
  'func-petrol': '#008187',
  'func-purple': '#8064A2',
  'crimson-red': '#E2271E',
  'jaffa-orange': '#EF7C3C',
  'surface-light': '#F7F6F5',
  'black-medium': '#5F5955',
  
  // Status / brand
  'status-active': '#C3DFB2',
  'citrine-white': '#F8EDD2',
  'oslo-gray': '#8D989B',


  // Opportunity stages
  'opportunity-stage-prospecting': '#325269',
  'opportunity-stage-qualification': '#86A7BC',
  'opportunity-stage-proposal': '#BB968C',
  'opportunity-stage-offered': '#8FBC94',
  'opportunity-stage-negotiation': '#BAB196',
  'opportunity-stage-accepted': '#99B2A6',
  'opportunity-stage-closure': '#B7B9EF',
  'opportunity-stage-closed-won': '#D093A6',
  'opportunity-stage-lost': '#E7C9BC',

  'lava-red': '#DA291C',
  'dark-gray-blue': '#325269',
  'cadet-gray': '#86A7BC',
  'sea-green': '#8FBC94',
  'pinkish-gray': '#BAB196',
  'clay-ash': '#B9CAB9',
  'blue-haze': '#B7B9EF',
  'light-orchid': '#D093A6',
  'light-violet': '#E7C9BC',
  'dark-gray': '#9E9E9D',
  'storm-white': '#F7F7F7',
  'seashell-white': '#EDEDED',
  'dawn-pink': '#EBEBEB',
  'info-blue': '#3F87DE',
  'purplish-red': '#BF0760',
  'purplish-red-16': 'rgba(191, 7, 96, 0.16)',
  'pink-sky': '#DE849E',
  'cyan-blue': '#5E94C5',
  'primary-light': '#FEF2F2',
  'blue-link': 'rgb(94 148 197)',
  'coral-pink': '#EE837B',
  'surface-300': '#E0E0E0',
  'orange': '#FFA500',
  'pistachio-green': '#8FD200',
  'pale-pink': '#DE849E14',

  //Case Files Status
  'dark-cyan': '#258B89',
  'turtle-green': '#86B051',
  'yellowish-orange': '#F3A340',
  'pale-red': '#DB634F',
  'gray': '#A0A7AC',
  'quick-sand': '#BB968C',

  //Case Files
  'nickle-gray': '#C5C5C5'
} as const;

export type AppColors = typeof appColors;
