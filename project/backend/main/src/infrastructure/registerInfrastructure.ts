import { asFunction, Container } from "@ft_transcendence/common/di/Container";
import { Merge } from "@ft_transcendence/common/type/object/Merge";
import { InfrastructureExports } from "./InfrastructureExports";
import { createRepository } from "./Repository";

export function registerInfrastructure<T extends {}>(container: Container<T>): Container<Merge<[T, InfrastructureExports]>> {
  return container.register('repository', asFunction(createRepository));
}
