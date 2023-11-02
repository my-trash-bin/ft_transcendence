import { Merge } from '@ft_transcendence/common/type/object/Merge';

import { CircularDependencyException } from './CircularDependencyException';
import { InvalidDependencyException } from './InvalidDependencyException';
import { InvalidOverrideException } from './InvalidOverrideException';
import { InvalidRegistrationException } from './InvalidRegistrationException';
import { NotRegisteredException } from './NotRegisteredException';
import { UseAfterRegisterException } from './UseAfterRegisterException';

export type Resolver<T> = <K extends string & keyof T>(name: K) => T[K];

type ClassRegistration<TType, TMap extends {}> = new (
  resolver: Resolver<TMap>,
) => TType;
type FunctionRegistration<TType, TMap extends {}> = (
  resolver: Resolver<TMap>,
) => TType;

type RegistrationInternal<TType, TMap extends {}> =
  | [type: 'value', value: TType]
  // lifetime: per scope
  | [type: 'scoped-class', value: ClassRegistration<TType, TMap>]
  | [type: 'scoped-function', value: FunctionRegistration<TType, TMap>]
  // lifetime: (none)
  | [type: 'transient-class', value: ClassRegistration<TType, TMap>]
  | [type: 'transient-function', value: FunctionRegistration<TType, TMap>]
  // lifetime: whole time
  | [type: 'singleton-class', value: ClassRegistration<TType, TMap>]
  | [type: 'singleton-function', value: FunctionRegistration<TType, TMap>];
type RegistrationInternalType = RegistrationInternal<any, {}>[0];

export class Registration<TType, TMap extends {}> {
  readonly internal: RegistrationInternal<TType, TMap>;

  private constructor(internal: RegistrationInternal<TType, TMap>) {
    this.internal = internal;
  }

  public static asValue<TType>(value: TType): Registration<TType, any> {
    return new Registration(['value', value]);
  }

  public static asClass<TType, TMap extends {}>(
    value: ClassRegistration<TType, TMap>,
  ): Registration<TType, TMap> {
    return new Registration<TType, TMap>(['scoped-class', value]);
  }

  public static asFunction<TType, TMap extends {}>(
    value: FunctionRegistration<TType, TMap>,
  ): Registration<TType, TMap> {
    return new Registration<TType, TMap>(['scoped-function', value]);
  }

  public singleton(): Registration<TType, TMap> {
    switch (this.internal[0]) {
      case 'scoped-class':
      case 'transient-class':
        return new Registration(['singleton-class', this.internal[1]]);
      case 'scoped-function':
      case 'transient-function':
        return new Registration(['singleton-function', this.internal[1]]);
      default:
        return this;
    }
  }

  public transient(): Registration<TType, TMap> {
    switch (this.internal[0]) {
      case 'scoped-class':
      case 'singleton-class':
        return new Registration(['transient-class', this.internal[1]]);
      case 'scoped-function':
      case 'singleton-function':
        return new Registration(['transient-function', this.internal[1]]);
      default:
        return this;
    }
  }

  public scoped(): Registration<TType, TMap> {
    switch (this.internal[0]) {
      case 'transient-class':
      case 'singleton-class':
        return new Registration(['scoped-class', this.internal[1]]);
      case 'transient-function':
      case 'singleton-function':
        return new Registration(['scoped-function', this.internal[1]]);
      default:
        return this;
    }
  }
}

export const asValue = Registration.asValue;
export const asClass = Registration.asClass;
export const asFunction = Registration.asFunction;

type RegistrationMap<T extends {}> = {
  [K in keyof T]: RegistrationInternal<T[K], T>;
};
type InitializeMap<T extends {}> = Partial<Record<keyof T, boolean>>;

function isSingleton(type: RegistrationInternalType) {
  return type === 'singleton-class' || type === 'singleton-function';
}

export class Container<T extends {}> {
  private readonly registrationMap: RegistrationMap<T>;
  private readonly scopedMap: Partial<T>;
  private readonly singletonMap: Partial<T>;
  private readonly initializeMap: InitializeMap<T>;
  private readonly scoped: boolean;

  private resolvingScoped: number;
  private resolvingSingleton: number;
  private registered: boolean;

  private constructor(
    registrationMap: RegistrationMap<T>,
    singletonMap: Partial<T>,
    scoped: boolean,
  ) {
    this.registrationMap = registrationMap;
    this.scopedMap = {};
    this.singletonMap = singletonMap;
    this.initializeMap = {};
    this.scoped = scoped;
    this.resolvingScoped = 0;
    this.resolvingSingleton = 0;
    this.registered = false;
  }

  public scope(): Container<T> {
    return new Container<T>(this.registrationMap, this.singletonMap, true);
  }

  public static empty(): Container<{}> {
    return new Container<{}>({}, {}, false);
  }

  public static register<TName extends string, TType>(
    name: TName,
    registration: Registration<TType, {}>,
  ): Container<Record<TName, TType>> {
    return new Container<Record<TName, TType>>(
      { [name]: registration.internal } as any,
      {},
      false,
    );
  }

  public register<TName extends string, TType>(
    name: TName,
    registration: Registration<TType, T>,
    override?: boolean,
  ): Container<Merge<[T, Record<TName, TType>]>> {
    if (this.registered) throw new UseAfterRegisterException();
    if (name in this.registrationMap && !override)
      throw new InvalidOverrideException(name);
    if (
      name in this.registrationMap &&
      (isSingleton(this.registrationMap[name][0]) ||
        isSingleton(registration.internal[0]))
    )
      throw new InvalidRegistrationException(
        'Cannot override singleton registration',
      );
    // TODO: prevent invalid registration
    this.registered = true;
    return new Container<Merge<[T, Record<TName, TType>]>>(
      { ...this.registrationMap, [name]: registration.internal } as any,
      this.singletonMap as any,
      this.scoped,
    );
  }

  public resolve<TName extends string & keyof T>(name: TName): T[TName] {
    if (this.registered) throw new UseAfterRegisterException();
    if (name in this.registrationMap) {
      const registration = this.registrationMap[name];
      switch (registration[0]) {
        case 'value':
          return registration[1];
        case 'scoped-class': {
          if (this.initializeMap[name])
            throw new CircularDependencyException(name);
          if (this.resolvingSingleton)
            throw new InvalidDependencyException(name);
          if (name in this.scopedMap) return this.scopedMap[name]!;
          this.initializeMap[name] = true;
          const resolve: Resolver<T> = <K extends string & keyof T>(
            name: K,
          ) => {
            this.resolvingScoped++;
            try {
              return this.resolve(name);
            } finally {
              this.resolvingScoped--;
            }
          };
          try {
            const result = new registration[1](resolve);
            this.scopedMap[name] = result;
            return result;
          } finally {
            this.initializeMap[name] = false;
          }
        }
        case 'scoped-function': {
          if (this.initializeMap[name])
            throw new CircularDependencyException(name);
          if (this.resolvingSingleton)
            throw new InvalidDependencyException(name);
          if (name in this.scopedMap) return this.scopedMap[name]!;
          this.initializeMap[name] = true;
          const resolve: Resolver<T> = <K extends string & keyof T>(
            name: K,
          ) => {
            this.resolvingScoped++;
            try {
              return this.resolve(name);
            } finally {
              this.resolvingScoped--;
            }
          };
          try {
            const result = registration[1](resolve);
            this.scopedMap[name] = result;
            return result;
          } finally {
            this.initializeMap[name] = false;
          }
        }
        case 'transient-class': {
          if (this.initializeMap[name])
            throw new CircularDependencyException(name);
          if (this.resolvingSingleton || this.resolvingScoped)
            throw new InvalidDependencyException(name);
          this.initializeMap[name] = true;
          const resolve: Resolver<T> = <K extends string & keyof T>(name: K) =>
            this.resolve(name);
          try {
            return new registration[1](resolve);
          } finally {
            this.initializeMap[name] = false;
          }
        }
        case 'transient-function': {
          if (this.initializeMap[name])
            throw new CircularDependencyException(name);
          if (this.resolvingSingleton || this.resolvingScoped)
            throw new InvalidDependencyException(name);
          this.initializeMap[name] = true;
          const resolve: Resolver<T> = <K extends string & keyof T>(name: K) =>
            this.resolve(name);
          try {
            return registration[1](resolve);
          } finally {
            this.initializeMap[name] = false;
          }
        }
        case 'singleton-class': {
          if (this.initializeMap[name])
            throw new CircularDependencyException(name);
          if (name in this.singletonMap) return this.singletonMap[name]!;
          this.initializeMap[name] = true;
          const resolve: Resolver<T> = <K extends string & keyof T>(
            name: K,
          ) => {
            this.resolvingSingleton++;
            try {
              return this.resolve(name);
            } finally {
              this.resolvingSingleton--;
            }
          };
          try {
            const result = new registration[1](resolve);
            this.singletonMap[name] = result;
            return result;
          } finally {
            this.initializeMap[name] = false;
          }
        }
        case 'singleton-function': {
          if (this.initializeMap[name])
            throw new CircularDependencyException(name);
          if (name in this.singletonMap) return this.singletonMap[name]!;
          this.initializeMap[name] = true;
          const resolve: Resolver<T> = <K extends string & keyof T>(
            name: K,
          ) => {
            this.resolvingSingleton++;
            try {
              return this.resolve(name);
            } finally {
              this.resolvingSingleton--;
            }
          };
          try {
            const result = registration[1](resolve);
            this.singletonMap[name] = result;
            return result;
          } finally {
            this.initializeMap[name] = false;
          }
        }
      }
    }
    throw new NotRegisteredException(name);
  }
}
