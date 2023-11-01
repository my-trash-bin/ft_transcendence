import { ComponentType } from 'react';
import { AddOverlayResult } from './AddOverlayResult';
import { OverlayComponentProps } from './OverlayComponentProps';

export interface OverlayContextType {
  shouldInteractive: boolean;
  addOverlay<T>(
    component: ComponentType<OverlayComponentProps<T>>,
  ): AddOverlayResult<T>;
}
