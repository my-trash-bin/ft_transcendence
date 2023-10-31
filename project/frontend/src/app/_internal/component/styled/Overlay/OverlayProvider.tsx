import { AnimatePresence, motion } from 'framer-motion';
import { ComponentType, PropsWithChildren } from 'react';
import { overlayContainer } from '../../base/Overlay/overlayContainer';
import { overlayProvider } from '../../essential/Overlay/overlayProvider';

function OverlayContainer({ children }: PropsWithChildren) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none">
      <AnimatePresence>{children}</AnimatePresence>
    </div>
  );
}

export const OverlayProvider = overlayProvider(
  overlayContainer(
    OverlayContainer,
    motion.div as ComponentType<PropsWithChildren>,
  ),
);
