import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = BooksClass & Document;

@Schema()
export class BooksClass {
  @Prop()
  require: true;
  unique: true;
  title: string;

  @Prop()
  description: string;

  @Prop()
  price: string;

  @Prop()
  author: string;
}

export const BooksSchema = SchemaFactory.createForClass(BooksClass);
