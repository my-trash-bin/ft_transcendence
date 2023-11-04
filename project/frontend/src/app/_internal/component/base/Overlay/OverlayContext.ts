import { createContext } from 'react';
import { OverlayContextType } from './OverlayContextType';

export const OverlayContext = createContext<OverlayContextType>({
  shouldInteractive: true,
  addOverlay() {
    throw new Error('addOverlay can be called only in the OverlayContext');
  },
});
