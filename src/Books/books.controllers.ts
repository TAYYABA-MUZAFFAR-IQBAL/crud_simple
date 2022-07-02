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
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';

@ApiTags('Books Management CRUD')
@Controller('books')
export class BookController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly BookService: BookService) {}


  @Post()
  @ApiOperation({ summary: 'Add a new book from this API' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        Title: {
          type: 'string',
          example: 'test',
          description: 'this is title',
        },
        Description: {
          type: 'string',
          example: 'test',
          description: 'this is Description',
        },
        Price: {
          type: 'string',
          example: 'test',
          description: 'this is price of book',
        },
        Aurthor: {
          type: 'string',
          example: 'test',
          description: 'this is aurthor name who wrote the book',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: BooksClass,
   
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createUser(@Body() BookDto: BooksClass) {
    console.log('Added Sucessfully.....');
    return this.BookService.createBook(BookDto);
  }

  @Get()
  @ApiOperation({ summary: 'This API Get All Books From DB' })
  @ApiResponse({
    status: 200,
    description: 'success',
    type: BooksClass,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  readUser() {
    console.log('All data Extracted....');
    return this.BookService.readBook();
  }

  //get book by id
  @Get(':id')
  @ApiOperation({ summary: 'Api to get Book by id' })
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
   getUser(@Param('id') id: string): Promise<BooksClass | null> {
    return this.BookService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update the book in DB' })
  @ApiParam({
    description: 'enter unique id',
    required: true,
    name: 'id',
      })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        Title: {
          type: 'string',
          example: 'test',
          description: 'this is title',
        },
        Description: {
          type: 'string',
          example: 'test',
          description: 'this is Description',
        },
        Price: {
          type: 'string',
          example: 'test',
          description: 'this is price of book',
        },
        Aurthor: {
          type: 'string',
          example: 'test',
          description: 'this is aurthor name who wrote the book',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'success' , type: BooksClass})
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: BookUpdateDto,
  ): Promise<BooksClass> {
    console.log('updated.....');
    return this.BookService.updateBook(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Api to Delete book from DB' })
  @ApiResponse({ status: 200, description: 'success' ,type: BooksClass})
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteUser(@Param('id') id: string) {
    console.log('Deleted.....');
    return this.BookService.deleteBook(id);
  }
}
