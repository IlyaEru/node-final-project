// import original module declarations
import 'styled-components';
import { Theme } from '../theme/theme';

// and extend them!
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
