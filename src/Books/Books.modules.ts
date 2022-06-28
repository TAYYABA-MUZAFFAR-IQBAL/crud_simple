import { Module } from '@nestjs/common';

import { BookController } from './books.controllers';
import { BookService } from './books.services';


@Module({
    imports: [BookService],
    controllers: [BookController],
    providers: [BookService],
    
})
export class BookModule {}