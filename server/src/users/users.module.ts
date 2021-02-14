import { Module } from '@nestjs/common';
import { UsersResolver } from 'users/users.resolver';

@Module({
  providers: [UsersResolver],
})
export class UsersModule {}
