import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import { BookService } from './books.services';
  import { BooksClass } from './books.models';
  import { BookUpdateDto } from './Book.Update.dto';
  
  @Controller()
  export class BookController {
    getHello(): any {
      throw new Error('Method not implemented.');
    }
    constructor(private readonly appService: BookService) {}
  
    @Post()
    async createUser(@Body() BookDto: BooksClass) {
      return this.appService.createBook(BookDto);
    }
  
    @Get()
    readUser() {
      return this.appService.readBook();
    }
  
    @Put(':id')
    async updateUser(
      @Param('id') id: string,
      @Body() updateData: BookUpdateDto,
    ): Promise<BooksClass> {
      return this.appService.updateBook(id, updateData);
    }
  
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
      return this.appService.deleteBook(id);
    }
  }
  