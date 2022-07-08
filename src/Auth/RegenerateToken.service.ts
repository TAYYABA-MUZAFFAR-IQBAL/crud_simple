import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../User/user.service';
import { AuthService } from './auth.service';


@Injectable()
export class TokensService {
  config: any;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  public async createAccessTokenFromRefreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.decode(refreshToken) as any;
      if (!decoded) {
        throw new Error();
      }
      const user = await this.userService.getByEmail(decoded.email);
      if (!user) {
        console.log('unable to decode refresh token');
        throw new HttpException(
          'User with this email does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.refreshtoken,
      );
      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid token');
      }
      await this.jwtService.verifyAsync<any>(refreshToken);
      return this.authService.login(user);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
  // getRefreshTokenOptions(user: UserSchema): JwtSignOptions {
  //   return this.getTokenOptions('refresh', user);
  // }
  // private getTokenOptions(type: string, user: UserSchema) {
  //   const options: JwtSignOptions = {
  //     secret: this.config.get().resfreshTokenSecret,

  //   };
  //   const expiration: string = this.config.get().refreshTokenExp;
  //   if (expiration) {
  //     options.expiresIn = expiration;
  //   }
  //   return options;
  // }
  //save current refresh token in db
  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    return await this.userService.saveorupdateRefreshToken(
      userId as any,
      (refreshToken = currentHashedRefreshToken),
    );
  }

  // token sent matches the one saved in the database

  async removeRefreshToken(email: string) {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.userService.update({ email } as any, {
      refreshtoken: null,
    });
  }

  // async removeRefreshToken(userId: number) {
  //   return this.userService.update(userId as any,
  //     {currentHashedRefreshToken:null,}
  //   );
  // }
}

// export interface RefreshTokenPayload {
//   jti: number;
//   sub: number
// }

// @Injectable()
// export class TokensService {
//   private  Refreshtokens: JwtRefreshTokenStrategy;
//   private userService: UserService;
//   private jwtService: JwtService;
//   jwt: any;

//   public constructor(
//     Refreshtokens: JwtRefreshTokenStrategy,
//     userService: UserService,
//     jwtService: JwtService,
//   ) {
//     this.Refreshtokens = Refreshtokens;
//     this.userService = userService;
//     this.jwtService = jwtService;
//   }
// //regenerate the access token
//   public async generateAccessToken(user:UserSchema): Promise<string> {
//     const jwt = await this.jwtService.signAsync({ user });

//     return jwt
//   }
//   //regenrate the refresh token

//   async generateRefreshToken(userId): Promise<string> {
//     var refreshToken = randtoken.generate(200); //generating refresh token containing 200 digits
//     var expirydate = new Date();

//     expirydate.setDate(expirydate.getDate() + 6); //expires in 6 days
//     await this.userService.saveorupdateRefreshToke(
//       refreshToken,
//       userId,
//       expirydate,
//     );
//     return refreshToken;
//   }

// //securing refresh token

//   public async resolveRefreshToken(
//     encoded: string,

//   ): Promise<{ user: UserSchema}> {
//     //decode the refresh token to get the data
//     const payload = await this.decodeRefreshToken(encoded);
//     const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

//     if (!token) {
//       throw new UnprocessableEntityException('Refresh token not found');
//     }
// //token already used..
//     if (token.is_revoked) {
//       throw new UnprocessableEntityException('Refresh token revoked');
//     }

//     const user = await this.getUserFromRefreshTokenPayload(payload);

//     if (!user) {
//       throw new UnprocessableEntityException('Refresh token malformed');
//     }

//     return { user };
//   }

//   public async createAccessTokenFromRefreshToken(
//     refresh: string,
//   ): Promise<{ token: string; user: UserSchema }> {
//     const { user } = await this.resolveRefreshToken(refresh);//decode refresh token
//     const jwt = await this.jwtService.signAsync(user);

//     return { user, token: jwt };
//   }

//   private async decodeRefreshToken(
//     token: string,
//   ): Promise<RefreshTokenPayload> {
//     try {
//       return this.jwt.verifyAsync(token);
//     } catch (e) {
//       if (e instanceof TokenExpiredError) {
//         throw new UnprocessableEntityException('Refresh token expired');
//       } else {
//         throw new UnprocessableEntityException('Refresh token malformed');
//       }
//     }
//   }

//   private async getUserFromRefreshTokenPayload(
//     payload: RefreshTokenPayload,
//   ): Promise<UserSchema> {
//     const subId = payload.sub;

//     if (!subId) {
//       throw new UnprocessableEntityException('Refresh token malformed');
//     }

//     return this.userService.findForId(subId);
//   }

//   private async getStoredTokenFromRefreshTokenPayload(
//     payload: RefreshTokenPayload,
//   ): Promise<UserSchema | null> {
//     const tokenId = payload.jti;

//     if (!tokenId) {
//       throw new UnprocessableEntityException('Refresh token malformed');
//     }

//     return this. userService.findForId(tokenId);

//   }

// }
