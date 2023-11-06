import { noop } from '@-ft/noop';
import { WatchTarget } from '@-ft/watch-target';
import { useWatchTarget, useWatchValue } from '@-ft/watch-target-react';
import {
  CSSProperties,
  ComponentType,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { OverlayComponentProps } from '../../base/Overlay/OverlayComponentProps';
import { OverlayContext } from '../../base/Overlay/OverlayContext';

export interface OverlayProps extends PropsWithChildren {
  open: boolean;
  className?: string;
  style?: CSSProperties;
}

function overlayInternal(
  watchTarget: WatchTarget<ReactNode>['watch'],
  className?: string,
  style?: CSSProperties,
): ComponentType<OverlayComponentProps<void>> {
  return function OverlayInternal() {
    return (
      <div className={className} style={style}>
        {useWatchValue(watchTarget)}
      </div>
    );
  };
}

export function Overlay({ children, open, className, style }: OverlayProps) {
  const { watch } = useWatchTarget(children);
  const { addOverlay } = useContext(OverlayContext);
  useEffect(() => {
    if (open) {
      const { cancel, promise } = addOverlay(
        overlayInternal(watch, className, style),
      );
      promise.catch(noop);
      return cancel;
    }
  }, [open, className, style, addOverlay, watch]);
  return null;
}
