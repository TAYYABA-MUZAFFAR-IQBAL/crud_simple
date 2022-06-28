import { Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './user.model';
import { UserUpdateDto } from './User.Update.dto';


@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly appService: AppService) {}

  @Post()
  async createUser(@Body() userDto: User){
    return this.appService.createUser(userDto)
  }

  @Get()
  readUser(){
    return this.appService.readUser()
  }

  @Put(':id')
  async updateUser(
    @Param('id') id:string ,@Body() updateData:UserUpdateDto
    ):Promise<User>{
    return this.appService.updateUser(id,updateData)
  }

  @Delete(':id')
  async deleteUser(@Param('id') id:string){
    return this.appService.deleteUser(id)
  }
}
