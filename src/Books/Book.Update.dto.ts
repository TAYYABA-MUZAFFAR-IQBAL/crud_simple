import { PartialType } from '@nestjs/swagger';
import { BooksClass } from './books.models';

export class BookUpdateDto extends PartialType (BooksClass) {}
