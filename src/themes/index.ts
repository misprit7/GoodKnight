import { lazy } from 'react';
import { Theme } from '../theming/types';

export const themes: Theme[] = [
  {
    id: 'light', // used as value in the select
    displayName: 'Light', // used as label in the select
    filename: 'light.theme.less',
    component: lazy(() => import('../themes/light-theme'))
  },
  {
    id: 'dark',
    displayName: 'Dark',
    filename: 'light.theme.less',
    component: lazy(() => import('../themes/dark-theme')),
  },
];