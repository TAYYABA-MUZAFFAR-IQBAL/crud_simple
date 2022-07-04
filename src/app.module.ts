import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModule } from './Books/Books.modules';
import { UserModule } from './User/user.module';
import { AuthModule } from './Auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      'mongodb+srv://tayyaba:tayyaba@cluster0.kql16.mongodb.net/NestJsSimpleCRUD',
      { useNewUrlParser: true },
    ),
    UserModule,
    AuthModule,
    BookModule,
    
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
