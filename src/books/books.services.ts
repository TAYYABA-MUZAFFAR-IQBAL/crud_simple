import { Injectable } from '@nestjs/common';
import { BooksClass, BookDocument } from './books.models';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(BooksClass.name) private bookModel: Model<BookDocument>,
  ) {}

  //  creating a NEW BOOK
  async createBook(book: BooksClass): Promise<BooksClass> {
    const newbook = new this.bookModel(book);
    return newbook.save();
  }

  //  reading the user collection
  async readBook() {
    return this.bookModel
      .find({})
      .then((book) => {
        return book;
      })
      .catch((err) => console.log(err));
  }

  // upadting the data
  async updateBook(id, data): Promise<BooksClass> {
    return this.bookModel.findByIdAndUpdate(id, data, { new: true });
  }

  // deleting the data
  async deleteBook(id) {
    return this.bookModel.findByIdAndRemove(id);
  }
}
