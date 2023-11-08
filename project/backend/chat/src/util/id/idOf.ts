import { Id } from '../../application/interface/Id';

// 타입 오류내기 위한 장치, 같은 string인 서로 다른 id류 클래스를 혼용하는것을 방지
export function idOf<T extends string>(id: string): Id<T> {
  return { value: id } as Id<T>;
}
