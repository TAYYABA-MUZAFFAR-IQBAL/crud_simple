import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException, Body } from '@nestjs/common';
import { UserService } from 'src/User/user.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refreshtoken',
) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('jwt'),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_RefreshTokenSECRET,
      signOptions: { expiresIn: '10m' },
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    var user = await this.userService.findOne(payload.User);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (req.body.refreshToken != user.refreshtoken) {
      throw new UnauthorizedException();
    }
    if (new Date() > new Date(user.refreshtokenexpires)) {
      throw new UnauthorizedException();
    }
    return { ...payload.user };
  }
}
