import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/User/user.service';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { UserSchema } from '../../User/user.model';

@Injectable()
export class SecureRoute implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean>  {
    const request = context.switchToHttp().getRequest<Request>();
  
     const user = request.user as any ;
     
    
      console.log('login user id: ', user.id );
      console.log('id from parameters: ', request.params.id);
      if (user.id === request.params.id) {
        console.log("User is valid to perform this action" );
        
        return true;
      } else {
        console.log('you have only access to your own data');
        return false;
      }
    
  }
}
