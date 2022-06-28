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
import { BookUpdateDto } from './dto/book-update.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async createUser(@Body() BookDto: BooksClass) {
    return this.bookService.createBook(BookDto);
  }

  @Get()
  readUser() {
    console.log('readUser');
    return this.bookService.readBook();
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: BookUpdateDto,
  ): Promise<BooksClass> {
    return this.bookService.updateBook(id, updateData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    // return this.bookService.deleteBook(id);
  }
}
