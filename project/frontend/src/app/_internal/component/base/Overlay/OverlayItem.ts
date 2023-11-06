import { OverlayComponentProps } from './OverlayComponentProps';

export interface OverlayItem {
  component: React.ComponentType<OverlayComponentProps<unknown>>;
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  counter: number;
}
