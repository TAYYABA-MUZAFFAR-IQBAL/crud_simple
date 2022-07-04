import { Injectable } from '@nestjs/common';
import { UserSchema, UserDocument } from './user.model';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserUpdateDto } from './UserUpdate.dto';
import { UserDetails } from "./userInterface.details";
import { UserRole } from './Role.enum';

@Injectable()
export class UserService {
  [x: string]: any;
  constructor(
    @InjectModel( UserSchema.name) private UserMod: Model<UserDocument>,
  ) {}



  _getUserDetails(user: UserDocument): UserDetails {
    return {
      id: user._id,
      User_name: user.User_name,
      email: user.email,
      role: user.role,
      
    };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.UserMod.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDetails | null> {
    const user = await this.UserMod.findById(id).exec();
    if (!user) return null;
    return this._getUserDetails(user);
  }

  async create(
    User_name: string,
    email: string,
    hashedPassword: string,
    role:UserRole
  ): Promise<UserDocument> {
    const newUser = new this.UserMod({
      User_name,
      email,
      password: hashedPassword,
      role
    });
    return newUser.save();
  }
  

  //  reading the user collection
  async getAllUser() {
    return this.UserMod.find({})
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }



  // upadting the data
  async userUpdate(id: string, data: UpdateQuery<UserDocument> | UserUpdateDto): Promise<UserSchema> {
    return this.UserMod.findByIdAndUpdate(id, data, { new: true });
  }

  // deleting the data
  async delUser(id: string) {
    return this.UserMod.findByIdAndRemove(id);
  }
  
}