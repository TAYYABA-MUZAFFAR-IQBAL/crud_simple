import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = BooksClass & Document;

@Schema()
export class BooksClass {
  @Prop()
  Title: string;
  require:true
  unique:true

  @Prop()
  Description: string;

  @Prop()
  Price: string;

  @Prop()
  Aurthor:string;
}

export const BooksSchema = SchemaFactory.createForClass(BooksClass);
