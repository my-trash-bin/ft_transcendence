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

export interface UserDto {
  /**
   * 사용자 ID
   * @format uuid
   */
  id: string;
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
  /** 닉네임 */
  nickname: string;
  /** 프로필 이미지 URL */
  profileImageUrl?: string;
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

export interface PongLogStatDto {
  /** 총 승리수 */
  wins: number;
  /** 총 패배수 */
  losses: number;
  /** 총 게임수 */
  totalGames: number;
  /** 승률 */
  winRate: number;
}

export interface UserProfileDto {
  /** 아이디 */
  id: string;
  /** 닉네임 */
  nickname: string;
  /** 프로필 이미지 URL */
  imageUrl?: string;
  /** 전적 */
  stats: PongLogStatDto;
  /** 상태메시지 */
  statusMessage: string;
  /** 관계 */
  relation: 'friend' | 'block' | 'none' | 'me';
}

export interface TwoFactorPasswordDto {
  /** 2차 비밀번호 */
  password: string;
}

export interface UpdateUserDto {
  /** 6~12 영문, 숫자 ㅡ하이픈, 언더스코어만 사용가능한 닉네임 */
  nickname?: string;
  /** 프로필 아바타 이미지 주소 */
  profileImageUrl?: string;
  /** 프로필 상태 메세지 */
  statusMessage?: string;
}

export interface NicknameCheckUserDto {
  /** 6~12 영문, 숫자 ㅡ하이픈, 언더스코어만 사용가능한 닉네임 */
  nickname: string;
}

export interface UniqueCheckResponse {
  /** 유니크 여부 */
  isUnique: boolean;
}

export interface TargetUserDto {
  /** 타게 유저 UUID */
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

export interface CreateNotificationDto {
  /** 알림 내용 */
  contentJson: string;
}

export interface NotificationDto {
  /** 알림 고유 UUID */
  id: string;
  /** 알림 생성 대상 UUID */
  userId: string;
  /** 읽기 여부 */
  isRead: boolean;
  /**
   * 생성된 날짜
   * @format date-time
   */
  createdAt: string;
  /** 알림 내용. JSON 형식 데이터를 stringfy해서 전달 */
  contentJson: string;
}

export interface AchievementWithReceived {
  /** Achievement UUID */
  id: string;
  /** Achievement 타이틀 */
  title: string;
  /** Achievement 이미지 주소 */
  imageUrl: string;
  /** Achievement 설명 */
  description: string;
  /** Achievement 설명 */
  isMine: boolean;
}

export interface GrantAchievementDto {
  /** 업적 타이틀 */
  title: string;
  /** 업적 부여할 유저 */
  userId: string;
}

export interface PongLogRankingRecordDto {
  /** 총 승리수 */
  wins: number;
  /** 총 패배수 */
  losses: number;
  /** 총 게임수 */
  totalGames: number;
  /** 승률 */
  winRate: number;
  /** 유저 객체 */
  user: UserDto;
  /** 유저 랭크 */
  rank: number;
}

export interface PongLogDto {
  /** 레코드 UUID */
  id: string;
  /** 유저1 ID */
  player1Id: string;
  /** 유저2 ID */
  player2Id: string;
  /** 유저1 스코어 */
  player1Score: number;
  /** 유저2 스코어 */
  player2Score: number;
  /** 유저1의 승리 여부 */
  isPlayer1win: boolean;
  /**
   * 레코드 생성 일자
   * @format date-time
   */
  createdAt: string;
}

export interface PongLogDtoWithPlayerDto {
  /** 레코드 UUID */
  id: string;
  /** 유저1 ID */
  player1Id: string;
  /** 유저2 ID */
  player2Id: string;
  /** 유저1 스코어 */
  player1Score: number;
  /** 유저2 스코어 */
  player2Score: number;
  /** 유저1의 승리 여부 */
  isPlayer1win: boolean;
  /**
   * 레코드 생성 일자
   * @format date-time
   */
  createdAt: string;
  /** 유저1 유저 객체 */
  player1: UserDto;
  /** 유저2 유저 객체 */
  player2: UserDto;
}

export interface PongLogHistoryResponse {
  /** 스텟 */
  stats: PongLogStatDto;
  /** 레코드 */
  records: PongLogDtoWithPlayerDto[];
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
   * 채널 공개 여부
   * @example "true"
   */
  isPublic: boolean;
  /**
   * 채널 비밀번호 설정여부
   * @example "false"
   */
  needPassword: boolean;
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
  password?: string | null;
  /** 채널 최대 인원수 */
  capacity: number;
}

export interface UpdateChannelDto {
  /** 채널 Id */
  channelId?: string;
  /** 채널 타입: public | protected | private */
  type?: 'public' | 'protected' | 'private';
  /** 채널 제목 */
  title?: string;
  /** 채널 암호 */
  password?: string | null;
  /** 채널 최대 인원수 */
  capacity?: number;
}

export interface ChannelMemberDto {
  channelId: string;
  memberId: string;
  memberType: 'ADMINISTRATOR' | 'MEMBER' | 'BANNED';
  /** @format date-time */
  mutedUntil: string;
}

export interface ChannelWithAllInfoDto {
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
   * 채널 공개 여부
   * @example "true"
   */
  isPublic: boolean;
  /**
   * 채널 비밀번호 설정여부
   * @example "false"
   */
  needPassword: boolean;
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
  members: string[];
  messages: string[];
}

export type MessageWithMemberDto = object;

export interface ParticipateChannelDto {
  /** 채널 타입 */
  type: 'public' | 'protected' | 'private';
  /** 채널 ID */
  channelId: string;
  /** 채널 암호 */
  password?: string | null;
}

export interface JoinedChannelInfoDto {
  /** 들어온 유저 채널 */
  channel: ChannelDto;
  /** 들어온 유저 */
  member: UserDto;
  /** 들어온 유저의 채널멤버로서 정보 */
  channelMember: ChannelMemberDto;
}

export interface LeaveChannelDto {
  /** 채널 ID */
  channelId: string;
}

export interface LeavingChannelResponseDto {
  /** 유저나 나간 채널 */
  channel: ChannelDto;
  /** 나간 유저 */
  member: UserDto;
}

export interface KickBanPromoteMuteRequestDto {
  /** 대상 채널 UUID */
  channelId: string;
  /** 대상 유저 UUID */
  targetUserId: string;
  /** KICK|BAN|PROMOTE|MUTE 중 enum 하나 */
  actionType: 'KICK' | 'BANNED' | 'PROMOTE' | 'MUTE';
}

export interface ChannelMemberDetailDto {
  channelId: string;
  memberId: string;
  memberType: 'ADMINISTRATOR' | 'MEMBER' | 'BANNED';
  /** @format date-time */
  mutedUntil: string;
  member: UserDto;
}

export type Boolean = object;

export type DmChannelMessageDto = object;

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
      this.request<any, any>({
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
        /** 검색용 닉네임의 일부 */
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
        /** 타겟 유저의 UUID */
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
     * @name UsersControllerSetTwoFactorPassword
     * @summary 2차 인증 비밀번호 설정
     * @request POST:/api/v1/users/set-2fa
     */
    usersControllerSetTwoFactorPassword: (
      data: TwoFactorPasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v1/users/set-2fa`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerUnsetTwoFactorPassword
     * @summary 2차 인증 비밀번호 해제
     * @request POST:/api/v1/users/unset-2fa
     */
    usersControllerUnsetTwoFactorPassword: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/v1/users/unset-2fa`,
        method: 'POST',
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
     * @tags notification
     * @name NotificationControllerCreate
     * @summary 유저에게 알림 하나 생성
     * @request POST:/api/v1/notification
     */
    notificationControllerCreate: (
      data: CreateNotificationDto,
      params: RequestParams = {},
    ) =>
      this.request<NotificationDto, any>({
        path: `/api/v1/notification`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags notification
     * @name NotificationControllerFindManyAndUpdateRead
     * @summary 유저에게 온 알림 전체 확인 및 읽기 on
     * @request GET:/api/v1/notification
     */
    notificationControllerFindManyAndUpdateRead: (params: RequestParams = {}) =>
      this.request<NotificationDto[], any>({
        path: `/api/v1/notification`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags achievement
     * @name AchievementControllerFindAll
     * @summary 사용자의 achievement 획득 정보 리턴
     * @request GET:/api/v1/achievement
     */
    achievementControllerFindAll: (params: RequestParams = {}) =>
      this.request<AchievementWithReceived[], any>({
        path: `/api/v1/achievement`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags achievement
     * @name AchievementControllerGrantAchievement
     * @summary user에게 업적 부여
     * @request POST:/api/v1/achievement
     */
    achievementControllerGrantAchievement: (
      data: GrantAchievementDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/achievement`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags pong-log
     * @name PongLogControllerGetRanking
     * @summary 랭킹 정보 반환
     * @request GET:/api/v1/pong-log/rank
     */
    pongLogControllerGetRanking: (params: RequestParams = {}) =>
      this.request<PongLogRankingRecordDto[], void>({
        path: `/api/v1/pong-log/rank`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags pong-log
     * @name PongLogControllerFindOne
     * @summary 게임 1개의 로그 조회
     * @request GET:/api/v1/pong-log/{id}
     */
    pongLogControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<PongLogDto, void>({
        path: `/api/v1/pong-log/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags pong-log
     * @name PongLogControllerGetUserGameHistories
     * @summary 유저 1명 기록 모두 조회
     * @request GET:/api/v1/pong-log/users/{id}
     */
    pongLogControllerGetUserGameHistories: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<PongLogHistoryResponse, void>({
        path: `/api/v1/pong-log/users/${id}`,
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
     * @name ChannelControllerChannelUpdate
     * @summary 채널 정보 변경
     * @request PUT:/api/v1/channel
     */
    channelControllerChannelUpdate: (
      data: UpdateChannelDto,
      params: RequestParams = {},
    ) =>
      this.request<ChannelDto, any>({
        path: `/api/v1/channel`,
        method: 'PUT',
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

    /**
     * No description
     *
     * @tags channel
     * @name ChannelControllerFindChannelInfo
     * @summary 채널 정보 반환
     * @request GET:/api/v1/channel/{channelId}
     */
    channelControllerFindChannelInfo: (
      channelId: string,
      params: RequestParams = {},
    ) =>
      this.request<ChannelWithAllInfoDto, any>({
        path: `/api/v1/channel/${channelId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags channel
     * @name ChannelControllerGetChannelMessages
     * @summary 특정 채널 채팅 목록 반환
     * @request GET:/api/v1/channel/messages/{channelId}
     */
    channelControllerGetChannelMessages: (
      channelId: string,
      params: RequestParams = {},
    ) =>
      this.request<MessageWithMemberDto[], any>({
        path: `/api/v1/channel/messages/${channelId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags channel
     * @name ChannelControllerParticipateChannel
     * @summary 채널 참여하기 with 비번
     * @request POST:/api/v1/channel/participate
     */
    channelControllerParticipateChannel: (
      data: ParticipateChannelDto,
      params: RequestParams = {},
    ) =>
      this.request<JoinedChannelInfoDto, any>({
        path: `/api/v1/channel/participate`,
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
     * @name ChannelControllerLeaveChannel
     * @summary 채널 나가기
     * @request POST:/api/v1/channel/leave
     */
    channelControllerLeaveChannel: (
      data: LeaveChannelDto,
      params: RequestParams = {},
    ) =>
      this.request<LeavingChannelResponseDto, any>({
        path: `/api/v1/channel/leave`,
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
     * @name ChannelControllerKickBanPromoteMute
     * @summary 채널 참여자 상태 변경
     * @request POST:/api/v1/channel/kickBanPromoteMute
     */
    channelControllerKickBanPromoteMute: (
      data: KickBanPromoteMuteRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<ChannelMemberDetailDto, any>({
        path: `/api/v1/channel/kickBanPromoteMute`,
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
     * @name ChannelControllerIsParticipated
     * @summary 내가 이 채널에 참여해있나
     * @request GET:/api/v1/channel/participated/{channelId}
     */
    channelControllerIsParticipated: (
      channelId: string,
      params: RequestParams = {},
    ) =>
      this.request<Boolean, any>({
        path: `/api/v1/channel/participated/${channelId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags dm
     * @name DmControllerGetDmChannelMessages
     * @summary 특정 유저와의 DM 채널 정보
     * @request GET:/api/v1/dm/{nickname}
     */
    dmControllerGetDmChannelMessages: (
      nickname: string,
      params: RequestParams = {},
    ) =>
      this.request<MessageWithMemberDto[], any>({
        path: `/api/v1/dm/${nickname}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags dm
     * @name DmControllerGetMyDmList
     * @summary 유저에게 보여줄 DM 채널 리스트
     * @request GET:/api/v1/dm
     */
    dmControllerGetMyDmList: (params: RequestParams = {}) =>
      this.request<DmChannelMessageDto[], any>({
        path: `/api/v1/dm`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags dm
     * @name DmControllerCanSendDm
     * @request GET:/api/v1/dm/valid/{nickname}
     */
    dmControllerCanSendDm: (nickname: string, params: RequestParams = {}) =>
      this.request<Boolean, any>({
        path: `/api/v1/dm/valid/${nickname}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags avatar
     * @name AvatarControllerUploadFile
     * @summary 바이너리 아바타 업로드
     * @request POST:/api/v1/avatar/upload
     */
    avatarControllerUploadFile: (data: any, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/v1/avatar/upload`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
}
