
import { Injectable } from '@nestjs/common';
import { BooksClass, BookDocument } from './books.models';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class BookService {
  constructor(
    @InjectModel(BooksClass.name) private BookModel: Model<BookDocument>,
  ) {}
    // constructor(
    //     @InjectModel('book') private readonly BookModel: Model<BookDocument>,
    //   ) {}
    
      //  creating a NEW BOOK
      async createBook(book:BooksClass): Promise<BooksClass> {
        const newbook= new this.BookModel(book);
        return newbook.save();
      }
    
      //  reading the user collection
      async readBook() {
        return this.BookModel
          .find({})
          .then((book) => {
            return book;
          })
          .catch((err) => console.log(err));
      }
    
      // upadting the data
      async updateBook(id, data): Promise<BooksClass> {
        return this.BookModel.findByIdAndUpdate(id, data, { new: true });
      }
    
      // deleting the data
      async deleteBook(id) {
        return this.BookModel.findByIdAndRemove(id);
      }
}