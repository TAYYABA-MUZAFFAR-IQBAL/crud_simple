import { Injectable } from '@nestjs/common';
import { UserSchema, UserDocument } from './user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel( UserSchema.name) private UserModel: Model<UserDocument>,
  ) {}

  //  creating a NEW BOOK
  async addUser(user:UserSchema): Promise<UserSchema> {
    const newuser = new this.UserModel(user);
    return newuser.save();
  }

  //  reading the user collection
  async getAllUser() {
    return this.UserModel.find({})
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }
//read user by id

async findOneUser(id) {
    return this.UserModel.findOne({id})
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }

  // upadting the data
  async userUpdate(id, data): Promise<UserSchema> {
    return this.UserModel.findByIdAndUpdate(id, data, { new: true });
  }

  // deleting the data
  async delUser(id) {
    return this.UserModel.findByIdAndRemove(id);
  }
}
