import {
  ComponentType,
  Fragment,
  PropsWithChildren,
  memo,
  useContext,
  useMemo,
} from 'react';
import { OverlayContainerProps } from './OverlayContainerProps';
import { OverlayContext } from './OverlayContext';

interface OverlayInternalProviderProps extends PropsWithChildren {
  shouldInteractive: boolean;
}

const OverlayInternalProvider = memo(function OverlayInternalProvider({
  children,
  shouldInteractive,
}: OverlayInternalProviderProps) {
  const { addOverlay } = useContext(OverlayContext);
  const value = useMemo(
    () => ({ shouldInteractive, addOverlay }),
    [shouldInteractive, addOverlay],
  );
  return (
    <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>
  );
});

export function overlayContainer(
  outerContainer: ComponentType<PropsWithChildren> | undefined,
  innerContainer: ComponentType<PropsWithChildren> | undefined,
): ComponentType<OverlayContainerProps> {
  return memo(function Overlays({ items }: OverlayContainerProps) {
    const InnerContainer = innerContainer ?? Fragment;
    const OuterContainer = outerContainer ?? Fragment;
    return (
      <OuterContainer>
        {items.map(({ component: Component, resolve, reject, counter }, i) => (
          <InnerContainer key={counter}>
            <OverlayInternalProvider shouldInteractive={i === items.length - 1}>
              <Component resolve={resolve} reject={reject} />
            </OverlayInternalProvider>
          </InnerContainer>
        ))}
      </OuterContainer>
    );
  });
}
