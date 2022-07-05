import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../User/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtGuard } from './Guard/jwt.guard';
import { JwtStrategy } from './Guard/jwt.strategy';
import { RolesGuard } from './Guard/roleGuard';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'secret',
        signOptions: { expiresIn: '3600s' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard, JwtGuard, JwtStrategy],
  exports: [AuthService]
  
})
export class AuthModule {
}
