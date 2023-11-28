/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface JWTResult {
  value: string;
}

export interface RegisterBody {
  /** 유니크 닉네임 */
  nickname: string;
  /** 프로필 이미지 주소 */
  imageUrl: string;
}

export interface TwoFactorAuthenticationBody {
  password: string;
}

export interface RecordDto {
  /** 승리 수 */
  win: number;
  /** 패배 수 */
  lose: number;
  /** 승률 */
  ratio: number;
}

export interface UserProfileDto {
  /** 아이디 */
  id: string;
  /** 닉네임 */
  nickname: string;
  /** 프로필 이미지 URL */
  imageUrl?: string;
  /** 전적 */
  record: RecordDto;
  /** 상태메시지 */
  statusMessage: string;
  /** 관계 */
  relation: 'friend' | 'block' | 'none' | 'me';
}

export interface UserDto {
  /**
   * 사용자 ID
   * @format uuid
   */
  id: string;
  /** 닉네임 */
  nickname: string;
  /** 프로필 이미지 URL */
  profileImageUrl?: string;
  /**
   * 가입 시기
   * @format date-time
   */
  joinedAt: string;
  /** 탈퇴 여부 */
  isLeaved: boolean;
  /**
   * 탈퇴 시기
   * @format date-time
   */
  leavedAt?: string;
  /** 상태 메시지 */
  statusMessage: string;
}

export interface UserRelationshipDto {
  /**
   * 사용자 ID
   * @format uuid
   */
  id: string;
  /** 닉네임 */
  nickname: string;
  /** 프로필 이미지 URL */
  profileImageUrl?: string;
  /**
   * 가입 시기
   * @format date-time
   */
  joinedAt: string;
  /** 탈퇴 여부 */
  isLeaved: boolean;
  /**
   * 탈퇴 시기
   * @format date-time
   */
  leavedAt?: string;
  /** 상태 메시지 */
  statusMessage: string;
  /** 관계 */
  relation: 'friend' | 'block' | 'none' | 'me';
}

export interface CreateUserDto {
  nickname: string;
  profileImageUrl?: string;
}

export interface UpdateUserDto {
  nickname?: string;
  profileImageUrl?: string;
}

export interface NicknameCheckUserDto {
  nickname: string;
}

export interface UniqueCheckResponse {
  /** 유니크 여부 */
  isUnique: boolean;
}

export interface TargetUserDto {
  targetUser: string;
}

export interface UserFollowDto {
  /** 차단 여부 */
  isBlock: boolean;
  /**
   * 팔로우 또는 차단된 날짜
   * @format date-time
   */
  followOrBlockedAt: string;
  /** 팔로우/블록 대상 */
  followee: UserDto;
}

export interface PongSeasonLogDto {
  /**
   * 시즌 번호
   * @example 1
   */
  season: number;
  /**
   * 사용자 ID
   * @format uuid
   * @example "uuid"
   */
  userId: string;
  /**
   * 연속 승리 횟수
   * @example 3
   */
  consecutiveWin: number;
  /**
   * 최대 연속 승리 횟수
   * @example 5
   */
  maxConsecutiveWin: number;
  /**
   * 최대 연속 패배 횟수
   * @example 2
   */
  maxConsecutiveLose: number;
  /**
   * 총 승리 횟수
   * @example 10
   */
  win: number;
  /**
   * 총 패배 횟수
   * @example 8
   */
  lose: number;
  /**
   * 총 게임 횟수
   * @example 18
   */
  total: number;
  /**
   * 승률(백분율)
   * @example 55.56
   */
  winRate: float;
}

export interface ChannelDto {
  /**
   * 채널 ID
   * @format uuid
   * @example "uuid"
   */
  id: string;
  /**
   * 채널 제목
   * @example "채널 이름"
   */
  title: string;
  /**
   * 채널 타입
   * @example "public"
   */
  type: string;
  /**
   * 채널 생성 시각
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * 채널 마지막 활동 시각
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  lastActiveAt: string;
  /**
   * 채널 소유자 ID
   * @format uuid
   * @example "uuid"
   */
  ownerId?: object;
  /**
   * 현재 채널 멤버 수
   * @example 10
   */
  memberCount: number;
  /**
   * 최대 채널 멤버 수
   * @example 50
   */
  maximumMemberCount: number;
}

export interface ChannelRelationDto {
  /**
   * 채널 ID
   * @format uuid
   * @example "uuid"
   */
  id: string;
  /**
   * 채널 제목
   * @example "채널 이름"
   */
  title: string;
  /**
   * 채널 타입
   * @example "public"
   */
  type: string;
  /**
   * 채널 생성 시각
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * 채널 마지막 활동 시각
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  lastActiveAt: string;
  /**
   * 채널 소유자 ID
   * @format uuid
   * @example "uuid"
   */
  ownerId?: object;
  /**
   * 현재 채널 멤버 수
   * @example 10
   */
  memberCount: number;
  /**
   * 최대 채널 멤버 수
   * @example 50
   */
  maximumMemberCount: number;
  /**
   * 채팅 금지 시간
   * @format date-time
   */
  mutedUntil: string;
  /**
   * 채널 멤버 타입
   * @example "MEMBER"
   */
  memberType: 'ADMINISTRATOR' | 'MEMBER' | 'BANNED';
}

export interface CreateChannelDto {
  /** 채널 타입 */
  type: 'public' | 'protected' | 'private';
  /** 채널 제목 */
  title: string;
  /** 채널 암호 */
  password?: string;
  /** 채널 최대 인원수 */
  capacity: number;
}

export interface ChannelMemberDto {
  channelId: string;
  memberId: string;
  memberType: 'ADMINISTRATOR' | 'MEMBER' | 'BANNED';
  /** @format date-time */
  mutedUntil: string;
  member: UserDto;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(
      typeof value === 'number' ? value : `${value}`,
    )}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => 'undefined' !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string'
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${
        queryString ? `?${queryString}` : ''
      }`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { 'Content-Type': type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === 'undefined' || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title ft_transcendence
 * @version 1
 * @contact
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @name AppControllerGetJwt
     * @request GET:/api/v1/jwt
     */
    appControllerGetJwt: (params: RequestParams = {}) =>
      this.request<JWTResult, any>({
        path: `/api/v1/jwt`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthControllerLogout
     * @request GET:/api/auth/logout
     */
    authControllerLogout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/logout`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthControllerLogin
     * @summary 42 Oauth 로그인
     * @request GET:/api/auth/42
     */
    authControllerLogin: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/42`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthControllerTest
     * @summary 42 Oauth용 콜백 주소
     * @request GET:/api/auth/42/callback
     */
    authControllerTest: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/42/callback`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthControllerRegister
     * @summary 회원 가입 요청
     * @request POST:/api/auth/register
     */
    authControllerRegister: (data: RegisterBody, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/register`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthControllerTwoFactorAuthentication
     * @summary 2FA 로그인 용
     * @request POST:/api/auth/2fa
     */
    authControllerTwoFactorAuthentication: (
      data: TwoFactorAuthenticationBody,
      params: RequestParams = {},
    ) =>
      this.request<any, void>({
        path: `/api/auth/2fa`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerMyProfile
     * @summary 내 정보
     * @request GET:/api/v1/users/me
     */
    usersControllerMyProfile: (params: RequestParams = {}) =>
      this.request<UserProfileDto, any>({
        path: `/api/v1/users/me`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerFindAll
     * @summary 모든 유저 조회
     * @request GET:/api/v1/users
     */
    usersControllerFindAll: (params: RequestParams = {}) =>
      this.request<UserDto[], any>({
        path: `/api/v1/users`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerCreate
     * @summary 유저 생성. 사실 아직 이 테이블의 정확한 기능을 잘...
     * @request POST:/api/v1/users
     */
    usersControllerCreate: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<UserDto, void>({
        path: `/api/v1/users`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerUpdate
     * @summary 유저의 닉네임/프로필이미지링크 변경
     * @request PATCH:/api/v1/users
     */
    usersControllerUpdate: (data: UpdateUserDto, params: RequestParams = {}) =>
      this.request<UserDto, void>({
        path: `/api/v1/users`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerSearchByNickname
     * @summary 닉네임 기반 유저 검색
     * @request GET:/api/v1/users/search
     */
    usersControllerSearchByNickname: (
      query: {
        q: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserRelationshipDto[], any>({
        path: `/api/v1/users/search`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerGetUserInfo
     * @summary 프로필 데이터를 위한 유저 조회
     * @request GET:/api/v1/users/profile
     */
    usersControllerGetUserInfo: (
      query: {
        targetUser: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserProfileDto, void>({
        path: `/api/v1/users/profile`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerGetUsetByNickname
     * @summary 유저 1명 기본 조회 by 닉네임
     * @request GET:/api/v1/users/nickname/{nickname}
     */
    usersControllerGetUsetByNickname: (
      nickname: string,
      params: RequestParams = {},
    ) =>
      this.request<UserDto, void>({
        path: `/api/v1/users/nickname/${nickname}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerFindOne
     * @summary 유저 1명 기본 조회
     * @request GET:/api/v1/users/{id}
     */
    usersControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<UserDto, void>({
        path: `/api/v1/users/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerCheckNickname
     * @summary 닉네임 유니크 여부 체크
     * @request POST:/api/v1/users/unique-check
     */
    usersControllerCheckNickname: (
      data: NicknameCheckUserDto,
      params: RequestParams = {},
    ) =>
      this.request<UniqueCheckResponse, void>({
        path: `/api/v1/users/unique-check`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags friends
     * @name UserFollowControllerFollowUser
     * @summary 유저의 친구 요청
     * @request POST:/api/v1/friends/request
     */
    userFollowControllerFollowUser: (
      data: TargetUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/friends/request`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags friends
     * @name UserFollowControllerBlockUser
     * @summary 유저의 블락 요청
     * @request POST:/api/v1/friends/block
     */
    userFollowControllerBlockUser: (
      data: TargetUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/friends/block`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags friends
     * @name UserFollowControllerUnfollowUser
     * @summary 유저의 친구 해제 요청
     * @request POST:/api/v1/friends/unfriend
     */
    userFollowControllerUnfollowUser: (
      data: TargetUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/friends/unfriend`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags friends
     * @name UserFollowControllerUnBlockUser
     * @summary 유저의 블락 해제 요청
     * @request POST:/api/v1/friends/unblock
     */
    userFollowControllerUnBlockUser: (
      data: TargetUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/friends/unblock`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags friends
     * @name UserFollowControllerFindRelationships
     * @summary 유저의 친구/블락 리스트 조회
     * @request GET:/api/v1/friends
     */
    userFollowControllerFindRelationships: (params: RequestParams = {}) =>
      this.request<UserFollowDto[], void>({
        path: `/api/v1/friends`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags friends
     * @name UserFollowControllerFindFriends
     * @summary 유저의 친구 목록 조회
     * @request GET:/api/v1/friends/friends
     */
    userFollowControllerFindFriends: (params: RequestParams = {}) =>
      this.request<UserFollowDto[], any>({
        path: `/api/v1/friends/friends`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags friends
     * @name UserFollowControllerFindBlocks
     * @summary 유저의 블락 목록 요청
     * @request GET:/api/v1/friends/blocks
     */
    userFollowControllerFindBlocks: (params: RequestParams = {}) =>
      this.request<UserFollowDto[], any>({
        path: `/api/v1/friends/blocks`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags pong-season-log
     * @name PongSeasonLogControllerFindOne
     * @summary 유저 1명의 시즌 로그 조회
     * @request GET:/api/v1/pong-season-log/{id}
     */
    pongSeasonLogControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<PongSeasonLogDto, void>({
        path: `/api/v1/pong-season-log/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags channel
     * @name ChannelControllerFindAll
     * @summary 모든 채널 검색
     * @request GET:/api/v1/channel/all
     */
    channelControllerFindAll: (params: RequestParams = {}) =>
      this.request<ChannelDto[], any>({
        path: `/api/v1/channel/all`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags channel
     * @name ChannelControllerFindMyChannels
     * @summary 내가 속한 채널 검색
     * @request GET:/api/v1/channel/my
     */
    channelControllerFindMyChannels: (params: RequestParams = {}) =>
      this.request<ChannelRelationDto[], any>({
        path: `/api/v1/channel/my`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags channel
     * @name ChannelControllerCreate
     * @summary 채널 생성
     * @request POST:/api/v1/channel
     */
    channelControllerCreate: (
      data: CreateChannelDto,
      params: RequestParams = {},
    ) =>
      this.request<ChannelDto, any>({
        path: `/api/v1/channel`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags channel
     * @name ChannelControllerFindChannelMembersByChannelId
     * @summary 채널 참여자 목록 반환
     * @request GET:/api/v1/channel/participant/{channelId}
     */
    channelControllerFindChannelMembersByChannelId: (
      channelId: string,
      params: RequestParams = {},
    ) =>
      this.request<ChannelMemberDto[], any>({
        path: `/api/v1/channel/participant/${channelId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
}
