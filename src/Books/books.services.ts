import { Injectable } from '@nestjs/common';
import { BooksClass, BookDocument } from './books.models';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(BooksClass.name) private BookModel: Model<BookDocument>,
  ) {}

  //  creating a NEW BOOK
  async createBook(book: BooksClass): Promise<BooksClass> {
    const newbook = new this.BookModel(book);
    return newbook.save();
  }

  //  reading the user collection
  async readBook() {
    return this.BookModel.find({})
      .then((book) => {
        return book;
      })
      .catch((err) => console.log(err));
  }
  //get book by id
  async findById(id: string): Promise<BooksClass | null> {
    const user = await this.BookModel.findById(id).exec();
    if (user) {
      console.log('Book for the requested id is extracted...');

      return user;
    } else {
      console.log('Book for the requested id is not available...');
      return null;
    }
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
