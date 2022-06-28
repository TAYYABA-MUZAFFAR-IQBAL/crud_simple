import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookController } from './books.controllers';
import { BooksClass, BooksSchema } from './books.models';
import { BookService } from './books.services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BooksClass.name, schema: BooksSchema }]),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
