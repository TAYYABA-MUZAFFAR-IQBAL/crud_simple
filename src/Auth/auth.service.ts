import { ExistingUserDTO } from '../User/dto/exisistingUser.dto';
import { UserDetails } from '../User/userInterface.details';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { NewUserDTO } from '../User/dto/newUser.dto';
import { UserService } from '../User/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserSchema } from 'src/User/user.model';
var randtoken = require('rand-token');

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(user: Readonly<NewUserDTO>): Promise<UserDetails | any> {
    const { User_name, email, password, role } = user;

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser)
      throw new HttpException(
        'An account with that email already exists!',
        HttpStatus.CONFLICT,
      );

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.create(
      User_name,
      email,
      hashedPassword,
      role,
    );
    return this.userService._getUserDetails(newUser);
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDetails | null> {
    const user = await this.userService.findByEmail(email);
    const doesUserExist = !!user;

    if (!doesUserExist) {
      throw new HttpException('User not exist..!', HttpStatus.BAD_REQUEST);
    }

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) {
      throw new HttpException(
        'Password not matched..!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.userService._getUserDetails(user);
  }

  async login(
    existingUser: ExistingUserDTO,
  ): Promise<{ token: string; refreshtoken: string } | null> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user)
      throw new HttpException('Credentials invalid!', HttpStatus.UNAUTHORIZED);

    const jwt = await this.jwtService.signAsync(user);
    const refresh = await this.jwtService.signAsync(user);
    console.log('user LoggedIn sucessfully', user);
    return { token: jwt, refreshtoken: refresh };
  }
  //resresh token generation
//  async generateRefreshToken(userId): Promise<string> {
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
async RegenrateTokens( payload: string ): Promise<{ token: string; refreshtoken: string } | null>{
  const jwt = await this.jwtService.signAsync(payload);
  const refresh = await this.jwtService.signAsync(payload);
   return { token: jwt, refreshtoken: refresh };
}
  

  //jwt expiry generator
  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    try {
      const { exp } = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (error) {
      throw new HttpException('Invalid JWT', HttpStatus.UNAUTHORIZED);
    }
  }

 
}
