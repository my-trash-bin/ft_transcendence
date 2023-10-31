/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type Author = {
  __typename?: 'Author';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type HelloWorld = {
  __typename?: 'HelloWorld';
  author?: Maybe<Author>;
  id: Scalars['ID']['output'];
  message?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
  deleteUser: Scalars['Boolean']['output'];
  updateUserNickname: User;
};


export type MutationCreateUserArgs = {
  nickname: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateUserNicknameArgs = {
  id: Scalars['ID']['input'];
  nickname: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  author: HelloWorld;
  helloWorld: HelloWorld;
  user: User;
};


export type QueryAuthorArgs = {
  id: Scalars['ID']['input'];
};


export type QueryHelloWorldArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  commentAdded: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  joinedAt: Scalars['DateTime']['output'];
  leavedAt?: Maybe<Scalars['DateTime']['output']>;
  nickname: Scalars['String']['output'];
  profileImageUrl?: Maybe<Scalars['String']['output']>;
};
