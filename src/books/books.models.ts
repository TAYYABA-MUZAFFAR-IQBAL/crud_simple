import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = BooksClass & Document;

@Schema()
export class BooksClass {
  @Prop()
  require: true;
  unique: true;
  Title: string;

  @Prop()
  Description: string;

  @Prop()
  Price: string;

  @Prop()
  Author: string;
}

export const BooksSchema = SchemaFactory.createForClass(BooksClass);
