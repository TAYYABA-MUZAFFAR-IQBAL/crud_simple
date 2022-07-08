import { HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ExistingUserDTO } from '../User/dto/exisistingUser.dto';
import { NewUserDTO } from '../User/dto/newUser.dto';
import { UserService } from '../User/user.service';
import { UserDetails } from '../User/userInterface.details';
import * as randomToken from 'rand-token';
import { RefreshStrategy } from "./Guard/refreshtoken.strategy";
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private ResreshTokenStrategy:  RefreshStrategy
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

  async login(existingUser: ExistingUserDTO): Promise<{ token: string }> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user)
      throw new HttpException('Credentials invalid!', HttpStatus.UNAUTHORIZED);
         const jwt = await this.createJWTToken(user);
    
    console.log('user LoggedIn successfully', user);
    return { token: jwt };
  }

  async createJWTToken(payload: UserDetails): Promise<any> {
    const refreshToken = randomToken.generate(16);
    const jwt = await this.jwtService.signAsync({ ...payload,refreshToken});
    return jwt;
  }

  //jwt expiry generator
  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    try {
      const [exp] = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (error) {
      throw new HttpException('Invalid JWT', HttpStatus.UNAUTHORIZED);
    }
  }

//   public async resolveRefreshToken(
//     encodedToken: any,
//     req:any,
//   ): Promise<any> {
//     //decode the refresh token to get the data
//     encodedToken = this.ResreshTokenStrategy.validate(req,encodedToken)
    

//     if (!encodedToken) {
//       throw new UnprocessableEntityException('Refresh token not found');
//     }
// //token already used..
//     if (encodedToken.is_revoked) {
//       throw new UnprocessableEntityException('Refresh token revoked');
//     }

//     const user = await this.getUserFromRefreshTokenPayload(encodedToken);

//     if (!user) {
//       throw new UnprocessableEntityException('Refresh token malformed');
//     }

//     return { user };
//   }

//   private async decodeRefreshToken(
//       token: string,
//       ): Promise<RefreshTokenPayload> {
//         try {
//           return this.jwt.verifyAsync(token);
//         } catch (e) {
//           if (e instanceof TokenExpiredError) {
//             throw new UnprocessableEntityException('Refresh token expired');
//           } else {
//             throw new UnprocessableEntityException('Refresh token malformed');
//           }
//         }
//       }
    
//       private async getUserFromRefreshTokenPayload(
//         payload: RefreshTokenPayload,
//       ): Promise<UserSchema> {
//         const subId = payload.sub;
    
//         if (!subId) {
//           throw new UnprocessableEntityException('Refresh token malformed');
//         }
    
//         return this.userService.findForId(subId);
//       }
    
//       private async getStoredTokenFromRefreshTokenPayload(
//         payload: RefreshTokenPayload,
//       ): Promise<UserSchema | null> {
//         const tokenId = payload.jti;
    
//         if (!tokenId) {
//           throw new UnprocessableEntityException('Refresh token malformed');
//         }
    
//         return this. userService.findForId(tokenId);
    
//       }
    
}
