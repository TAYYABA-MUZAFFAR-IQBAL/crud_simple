import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserSchema, UserDocument } from './user.model';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserUpdateDto } from './UserUpdate.dto';
import { UserDetails } from './userInterface.details';
import { UserRole } from './Role.enum';

@Injectable()
export class UserService {
  static create(context: ExecutionContext) {
    throw new Error('Method not implemented.');
  }
  [x: string]: any;
  constructor(
    @InjectModel(UserSchema.name) private UserMod: Model<UserDocument>,
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
    role: UserRole,
  ): Promise<UserDocument> {
    const newUser = new this.UserMod({
      User_name,
      email,
      password: hashedPassword,
      role,
    });
    return newUser.save();
  }

  //to find the user who is login
  async findOne(userName: string): Promise<UserDocument | undefined> {
    return this.UserMod.findOne({ userName });
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
  async userUpdate(
    id: string,
    data: UpdateQuery<UserDocument> | UserUpdateDto,
  ): Promise<UserSchema> {
    return this.UserMod.findByIdAndUpdate(id, data, { new: true });
  }

  // deleting the data
  async delUser(id: string) {
    return this.UserMod.findByIdAndRemove(id);
  }
  async saveorupdateRefreshToken(refreshToken: string, id: string) {
    await this.UserMod.updateOne(id as any, { refreshtoken: refreshToken });
  }

  //find token through id

  public async findForId(id: number): Promise<UserDocument | null> {
    return this.UserMod.findOne({
      where: {
        id,
      },
    });
  }
  //get user by email
  async getByEmail(email: string) {
    const user = await this.findOneemail(email);
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
  async findOneemail(email: string): Promise<UserDocument | undefined> {
    return this.UserMod.findOne({ email });
  }

  //update remove refresh token

  async updateandsave(
    email: string,
    updateUserDto: UserUpdateDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(email, updateUserDto, { new: true })
      .exec();
  }
}
