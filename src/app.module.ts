import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './books/books.modules';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest'), BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
