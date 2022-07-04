import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ExistingUserDTO } from '../User/dto/exisistingUser.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { NewUserDTO } from '../User/dto/newUser.dto';
import { UserDetails } from '../User/userInterface.details';
import { AuthService } from './auth.service';
import { UserUpdateDto } from '../User/UserUpdate.dto';
import { UserRole } from '../User/Role.enum';
import { UserSchema } from '../User/user.model';
import { Delete, Get, Param, Put } from '@nestjs/common';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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


}