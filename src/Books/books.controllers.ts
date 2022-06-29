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
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';

@ApiTags('BooksTag')
@Controller('books')
export class BookController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly BookService: BookService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createUser(@Body() BookDto: BooksClass) {
    return this.BookService.createBook(BookDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'A DATA has been successfully fetched',
  })
  @ApiResponse({ status: 403, description: 'Not extracted' })
  readUser() {
    return this.BookService.readBook();
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiResponse({ status: 403, description: 'Unable to update' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: BookUpdateDto,
  ): Promise<BooksClass> {
    return this.BookService.updateBook(id, updateData);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'deleted successfully' })
  @ApiResponse({ status: 403, description: 'Unable to delete' })
  async deleteUser(@Param('id') id: string) {
    return this.BookService.deleteBook(id);
    
  }
}
