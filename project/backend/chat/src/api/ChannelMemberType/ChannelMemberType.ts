import { registerEnumType } from 'type-graphql';

export enum ChannelMemberType {
  ADMINISTRATOR,
  MEMBER,
  BANNED,
}

// 타입스크립트의 열거형을 GraphQL 열거형 타입으로 등록
registerEnumType(ChannelMemberType, {
  name: 'ChannelMemberType', // this one is mandatory
  description: 'The basic roles of a channel member', // this one is optional
});
