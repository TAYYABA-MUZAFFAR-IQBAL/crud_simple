import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
export type BookDocument = BooksClass & Document;

@Schema()
export class BooksClass {
  @ApiProperty({
    description: 'The title is the name of book which musb be unique.',
  })
  @Prop({ required: true, unique: true })
  Title: string;

  @ApiProperty({
    description: 'The description of book wich told about the book details.',
    required: false,
    nullable: true,
  })
  @Prop()
  Description: string;

  @ApiProperty({
    description: 'The price of book puchase.',
    required: false,
    nullable: true,
  })
  @Prop()
  Price: string;

  @ApiProperty({
    description: 'The Aurthor name who wrote the book.',
    required: false,
    nullable: true,
  })
  @Prop()
  Aurthor: string;
}

export const BooksSchema = SchemaFactory.createForClass(BooksClass);
