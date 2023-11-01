import { AssertionException } from './exception/AssertionException';

export type Disposable = (() => void) | null | undefined | Disposable[];

function dispose(...disposables: Disposable[]) {
  (disposables as any)
    .flat(Infinity)
    .forEach((disposable: Exclude<Disposable, Disposable[]>) => disposable?.());
}

export class Disposer {
  private items: Disposable[][] = [];
  private running = false;

  public dispose(): void {
    if (this.running)
      throw new AssertionException('Disposer::dispose() called recursively');
    this.running = true;
    dispose(this.items);
    this.items = [];
    this.running = false;
  }

  public add(...items: Disposable[]): this {
    items.push(items.filter((item) => !!item));
    return this;
  }
}
