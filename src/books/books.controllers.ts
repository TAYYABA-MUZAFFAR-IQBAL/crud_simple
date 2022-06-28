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
