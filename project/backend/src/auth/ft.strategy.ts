import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import passport42 from 'passport-42';

// from node_modules/@types/passport-42/index.d.ts
export interface Profile {
  id: string;
  provider: string;
  username: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  profileUrl: string;
  phoneNumbers: string;

  _raw: string;
  _json: any;
}

@Injectable()
export class FtStrategy extends PassportStrategy(passport42.Strategy) {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('API_42_UID'),
      clientSecret: configService.getOrThrow<string>('API_42_SECRET'),
      callbackURL: configService.getOrThrow<string>('API_42_CALLBACK'),
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<Profile> {
    console.log('프로필 리턴');
    // console.log('validate');
    // console.log('------------------');
    // console.log(_accessToken);
    // console.log('------------------');
    // console.log(_refreshToken);
    // console.log('------------------');
    // console.log(profile);
    // console.log('----     ************* -------');
    return profile;
  }
}
