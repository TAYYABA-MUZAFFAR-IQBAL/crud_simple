import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserSchema } from './user.model';
import { UserUpdateDto } from './UserUpdate.dto';
import { UserRole } from './Role.enum';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';

@ApiTags('User CRUD')
@Controller('user')
export class UserController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly UserService: UserService) {}

  //add user
  @Post()
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
          type: 'string',
          enum: [UserRole.Admin, UserRole.Librarian, UserRole.User],
          description: 'role of user must be the given role to select',
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
  async createUser(@Body() User: UserSchema) {
    console.log('Added Sucessfully.....');
    return this.UserService.addUser(User);
  }
  //get all user
  @Get()
  @ApiOperation({ summary: 'This API Get All Users From DB' })
  @ApiResponse({
    status: 200,
    description: 'success',
    type: UserSchema,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  readUser() {
    console.log('All data Extracted....');
    return this.UserService.getAllUser();
  }

  //get user by id
  @Get(':id')
  @ApiOperation({ summary: 'Api to get user by id' })
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(@Param('id') id: string) {
    console.log('User extracted.....');
    return this.UserService.findOneUser(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update the user in DB' })
  @ApiParam({
    description: 'enter unique id',
    required: true,
    name: 'id',
  })
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
          type: 'string',
          enum: [UserRole.Admin, UserRole.Librarian, UserRole.User],
          description: 'role of user must be the given role to select',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'success', type: UserUpdateDto })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateUserId(
    @Param('id') id: string,
    @Body() UserUpdate: UserUpdateDto,
  ): Promise<UserSchema> {
    console.log('updated.....');
    return this.UserService.userUpdate(id, UserUpdate);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Api to Delete user from DB' })
  @ApiResponse({ status: 200, description: 'success', type: UserSchema })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteUser(@Param('id') id: string) {
    console.log('Deleted.....');
    return this.UserService.delUser(id);
  }
}
