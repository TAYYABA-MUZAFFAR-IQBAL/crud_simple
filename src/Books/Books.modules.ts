import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BookController } from './books.controllers';
import { BooksClass, BooksSchema } from './books.models';
import { BookService } from './books.services';

@Module({
  providers: [BookService],
  controllers: [BookController],
  imports: [
    MongooseModule.forFeature([{ name: BooksClass.name, schema: BooksSchema }]),
  ],
})
export class BookModule {}
