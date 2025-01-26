import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { CurrentUserInterceptor } from "./interceptors/current-user.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    {
      provide: APP_INTERCEPTOR, // any request that comes to any controller in our application, will have this interceptor
      // but sometimes we don't care if we see find the user in public route I mean a route that can be accessed without any session id then we are maing a request in db for finding user 
      // this leads to overfetching
      useClass: CurrentUserInterceptor, 
    },
  ],
})
export class UsersModule {}
