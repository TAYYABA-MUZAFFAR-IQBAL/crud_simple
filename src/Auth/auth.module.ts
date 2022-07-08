import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import {TokensService  } from './RegenerateToken.service';
import { UserModule } from '../User/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtGuard } from './Guard/jwt.guard';
import { JwtStrategy } from './Guard/jwt.strategy';
import { JwtRefreshTokenStrategy } from './Guard/refreshtoken.strategy';
import { RolesGuard } from './Guard/roleGuard';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        acessTokenExp: { expiresIn: '1m' },
        resfreshTokenSecret: process.env.JWT_RefreshTokenSECRET,
        refreshTokenExp: { expiresIn: '10m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard, JwtGuard, JwtStrategy,JwtRefreshTokenStrategy,TokensService ],
  exports: [AuthService],
})
export class AuthModule {}
