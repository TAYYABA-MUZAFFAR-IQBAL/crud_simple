import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards ,Request, Req} from '@nestjs/common';
import { ExistingUserDTO } from '../User/dto/exisistingUser.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { NewUserDTO } from '../User/dto/newUser.dto';
import { UserDetails } from '../User/userInterface.details';
import { AuthService } from './auth.service';
import { IsNotEmpty } from 'class-validator'
import { UserRole } from '../User/Role.enum';
import { UserSchema } from '../User/user.model';
import {TokensService  } from './RegenerateToken.service';
import { JwtGuard } from './Guard/jwt.guard';


export interface AuthenticationPayload {
  user: UserSchema
  payload: {
    type: string
    token: string
    refresh_token?: string
  }
}
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly tokens: TokensService

  constructor(private authService: AuthService,tokens: TokensService) { this.tokens = tokens}

  @Post('register')
  @ApiOperation({ summary: 'Api to add new user' })

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        User_name: {
          type: 'string',
          example: 'test',
          description: 'this is the name of user',
        },
        email: {
          type: 'string',
          example: 'test',
          description: 'this is the email of user must be unique',
        },
        password: {
          type: 'string',
          example: '******',
          description: 'pasword of user',
        },
        role: {
          type: 'enum',
          enum: [UserRole.Admin, UserRole.Librarian, UserRole.User],
          description: 'role of user must be the given role to select',
          default:UserRole.User,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: UserSchema,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  register(@Body() user: NewUserDTO): Promise<UserDetails | null> {
    return this.authService.register(user);
  }

  @Post('login')
  @ApiOperation({
    summary: 'This API is to login the user to handle operations',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'test',
          description: 'this is the email of user must be unique',
        },
        password: {
          type: 'string',
          example: '******',
          description: 'pasword of user',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'success',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @HttpCode(HttpStatus.OK)
  login(@Body() user: ExistingUserDTO): Promise<{ token: string } | null> {
    return this.authService.login(user);
  }

  @Post('verify-jwt')
  @ApiOperation({
    summary: 'This API is to check the token validity',
  })

    @ApiBody({
    schema: {
      type: 'object',
      properties: {
        jwt: {
          type: 'string',
          example: '',
          description: 'Token of login user',
        },
        
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'success..token is valid',
  })
  @ApiResponse({ status: 403, description: 'Invalid Token' })
  @HttpCode(HttpStatus.OK)
  verifyJwt(@Body() payload: { jwt: string }) {
    console.log("Token is valid...");
    
    return this.authService.verifyJwt(payload.jwt);
  }

 

  // //post request for regenrate the acess token from refresh token 
 
  // @UseGuards(JwtGuard)
  // @Post('refresh')
  // @ApiOperation({
  //   summary: 'This API Regenerate the access tokrn from refresh token',
  // })
  // @ApiBody({
  //   description: 'Refresh Token',
  //   required: true,
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       RefreshToken: {
  //         type: 'string',
  //         example: '',
  //         description: 'Refresh Token for the creation of new access token',
  //       },
        
  //     },
  //   },
  //     })

  // public async refresh (@Body() body:{refresh_Token: string}) {
  //             const { user, token } = await this.tokens.createAccessTokenFromRefreshToken(body.refresh_Token)
  //         const payload = this.buildResponsePayload(user, token)
      
  //         return {
  //             status: 'success',
  //           data: payload,
  //         }
         
  //     }
  // //create the new access token from refresh token
  // private buildResponsePayload (user: UserSchema, accessToken: string, refreshToken?: string): AuthenticationPayload {
  //   return {
  //     user: user,
  //     payload: {
  //       type: 'bearer',
  //       token: accessToken,
  //       ...(refreshToken ? { refresh_token: refreshToken } : {}),
  //     }
  //   }
  // }

  //refresh
  // @UseGuards(JwtRefreshGuard)
  @Get('refresh')
 async refresh(@Req() request: UserSchema) {
    const RegenratedToken = this.authService.RegenrateTokens(request.User_name);
 
    request.res.setHeader('Refresh-token', RegenratedToken );
    return request.User_name;
  }

  //logout route to secure malicioud activity
  @Get('log-out')
  @ApiOperation({ description: 'Logout' })
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async logOut(@Request() req: any, user: UserDetails) {
    await this.tokens.removeRefreshToken(user.email);
    req.res.setHeader('Authorization', null);
  }



}