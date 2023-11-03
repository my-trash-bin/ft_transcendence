export interface AddOverlayResult<T> {
  cancel: (reason?: any) => void;
  promise: Promise<T>;
}
