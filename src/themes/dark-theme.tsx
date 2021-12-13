//This next line causes and error because it is lazy loaded using webpack
// @ts-ignore
import styles from './dark.theme.less';
import { useApplyStyles } from '../theming'

export default function DarkTheme() {
  useApplyStyles(styles);
  return null;
}