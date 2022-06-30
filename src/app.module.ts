import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModule  } from './Books/Books.modules';
import { UserModule  } from './User/user.module';


@Module({
  imports: [ MongooseModule.forRoot('mongodb+srv://tayyaba:tayyaba@cluster0.kql16.mongodb.net/NestJsSimpleCRUD', { useNewUrlParser: true }),UserModule,BookModule ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
