import {
  ComponentType,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { OverlayComponentProps } from './OverlayComponentProps';
import { OverlayContainerProps } from './OverlayContainerProps';
import { OverlayContext } from './OverlayContext';
import { OverlayItem } from './OverlayItem';

interface OverlayProviderState {
  items: OverlayItem[];
  counter: number;
}

const overlayProviderInitialState: OverlayProviderState = {
  items: [],
  counter: 0,
};

export function overlayProvider(
  OverlayContainer: ComponentType<OverlayContainerProps>,
): ComponentType<PropsWithChildren> {
  return function OverlayProvider({ children }) {
    const [state, setState] = useState(overlayProviderInitialState);

    const addOverlay = useCallback(
      (component: React.ComponentType<OverlayComponentProps<unknown>>) => {
        let counterToRemove: number;
        let resolve: (value: unknown) => void;
        let reject: (reason?: any) => void;
        const promise = new Promise((innerResolve, innerReject) => {
          resolve = innerResolve;
          reject = innerReject;
        });
        const removeWithoutResolve = () =>
          setState(({ items, counter }) => ({
            items: items.filter(({ counter }) => counter !== counterToRemove),
            counter,
          }));
        const outerResolve = (value: unknown) => {
          removeWithoutResolve();
          resolve(value);
        };
        const outerReject = (reason?: any) => {
          removeWithoutResolve();
          reject(reason);
        };
        setState(({ items, counter }) => {
          counterToRemove = counter + 1;
          return {
            items: [
              ...items,
              {
                component,
                resolve: outerResolve,
                reject: outerReject,
                counter: counterToRemove,
              },
            ],
            counter: counterToRemove,
          };
        });
        return {
          cancel: outerReject,
          promise,
        };
      },
      [setState],
    ) as <T>(component: React.ComponentType<OverlayComponentProps<T>>) => {
      cancel: (reason?: any) => void;
      promise: Promise<T>;
    };

    const shouldInteractive = state.items.length === 0;

    const value = useMemo(
      () => ({ shouldInteractive, addOverlay }),
      [shouldInteractive, addOverlay],
    );

    return (
      <OverlayContext.Provider value={value}>
        {children}
        <OverlayContainer items={state.items} />
      </OverlayContext.Provider>
    );
  };
}
