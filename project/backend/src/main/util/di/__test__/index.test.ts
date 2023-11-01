import { describe, it } from 'vitest';
import { CircularDependencyException } from '../CircularDependencyException';
import { asClass, Container, Resolver } from '../Container';
import { InvalidDependencyException } from '../InvalidDependencyException';

describe('basic test', () => {
  class A {
    value = 42;
  }
  class B {
    value = '42';
  }
  class C {
    a: A;
    b: B;

    constructor(resolve: Resolver<{ a: A; b: B }>) {
      this.a = resolve('a');
      this.b = resolve('b');
    }
  }
  class ANeedC {
    constructor(resolve: Resolver<{ c: C }>) {
      resolve('c');
    }
  }
  class D {}

  it('should work', ({ expect }) => {
    const container = Container.register('a', asClass(A).singleton())
      .register('b', asClass(B))
      .register('c', asClass(C))
      .register('d', asClass(D).transient());

    expect(container.resolve('c')).toBeInstanceOf(C);
    expect(container.resolve('c')).equals(container.resolve('c'));
    expect(container.resolve('d')).not.equals(container.resolve('d'));

    const container2 = container.scope();

    expect(container.resolve('a')).equals(container2.resolve('a'));
    expect(container.resolve('b')).not.equals(container2.resolve('b'));
    expect(container.resolve('c')).not.equals(container2.resolve('c'));
  });

  it('should detect circular dependency', ({ expect }) => {
    const container = Container.register('a', asClass(A))
      .register('b', asClass(B))
      .register('c', asClass(C))
      .register('a', asClass(ANeedC), true);
    expect(() => container.resolve('a')).toThrowError(
      CircularDependencyException
    );

    // check if cleanup is done even if exception occurred
    expect((container as any).resolvingScoped).equals(0);
    expect((container as any).resolvingSingleton).equals(0);
  });

  it('should prevent depends on shorter elements', ({ expect }) => {
    {
      const container = Container.register('a', asClass(A).transient())
        .register('b', asClass(B))
        .register('c', asClass(C));
      expect(() => container.resolve('c')).toThrowError(
        InvalidDependencyException
      );
    }
    {
      const container = Container.register('a', asClass(A))
        .register('b', asClass(B))
        .register('c', asClass(C).singleton());
      expect(() => container.resolve('c')).toThrowError(
        InvalidDependencyException
      );
    }
    {
      const container = Container.register('a', asClass(A).transient())
        .register('b', asClass(B).transient())
        .register('c', asClass(C).singleton());
      expect(() => container.resolve('c')).toThrowError(
        InvalidDependencyException
      );
    }
  });
});
