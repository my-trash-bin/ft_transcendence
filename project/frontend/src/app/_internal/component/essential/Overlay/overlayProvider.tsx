import { ComponentType, PropsWithChildren, useContext, useEffect } from 'react';
import { OverlayContainerProps } from '../../base/Overlay/OverlayContainerProps';
import { OverlayContext } from '../../base/Overlay/OverlayContext';
import { overlayProvider as baseOverlayProvider } from '../../base/Overlay/overlayProvider';

function BodyScrollLocker(): null {
  const { shouldInteractive } = useContext(OverlayContext);
  useEffect(() => {
    if (!shouldInteractive) {
      const previousOverflowX = document.body.style.overflowX;
      const previousOverflowY = document.body.style.overflowY;
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'hidden';
      return () => {
        document.body.style.overflowX = previousOverflowX;
        document.body.style.overflowY = previousOverflowY;
      };
    }
  }, [shouldInteractive]);

  return null;
}

export function overlayProvider(
  overlayContainer: ComponentType<OverlayContainerProps>,
): ComponentType<PropsWithChildren> {
  const BaseOverlayProvider = baseOverlayProvider(overlayContainer);

  return function OverlayProvider({ children }) {
    return (
      <BaseOverlayProvider>
        {children}
        <BodyScrollLocker />
      </BaseOverlayProvider>
    );
  };
}
