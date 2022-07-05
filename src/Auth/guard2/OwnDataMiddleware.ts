import { HttpException } from '@nestjs/common/exceptions/http.exception';
import {  HttpStatus, Injectable ,NestMiddleware} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/User/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
     constructor(private readonly userService: UserService) {
       
     }
       async use(req: Request, res: Response, next: NextFunction) {
    
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      const decoded: any = jwt.verify(token, "SECRET");
      const user = await this.userService.findById(decoded.id);


      if (!user) {
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
      }

      req.user = user.id;
      console.log("login user id: ",req.user);
      console.log("id from parameters: ",req.params.id);
      if(req.user===req.params.id){
        next();
      }
      else{
        console.log("you have only access to your own data");
        
      }
     

    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}