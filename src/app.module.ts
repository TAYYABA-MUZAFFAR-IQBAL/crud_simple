import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserSchema } from './user.model';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://tayyaba:tayyaba@cluster0.kql16.mongodb.net/NestJsSimpleCRUD'),
    MongooseModule.forFeature([{name:'user',schema:UserSchema}])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
