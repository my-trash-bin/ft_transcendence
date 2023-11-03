export interface OverlayComponentProps<T> {
  resolve(value: T): void;
  reject(reason?: any): void;
}
