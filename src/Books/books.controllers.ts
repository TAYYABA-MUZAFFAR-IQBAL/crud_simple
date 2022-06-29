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
    constructor(private readonly  BookService: BookService) {}
  
    @Post()
    async createUser(@Body() BookDto: BooksClass) {
      return this.BookService.createBook(BookDto);
    }
  
    @Get()
    readUser() {
      return this.BookService.readBook();
    }
  
    @Put(':id')
    async updateUser(
      @Param('id') id: string,
      @Body() updateData: BookUpdateDto,
    ): Promise<BooksClass> {
      return this.BookService.updateBook(id, updateData);
    }
  
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
      return this.BookService.deleteBook(id);
    }
  }
  