import { Args, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'common/currentUser.decorator';
import { Public } from 'utils/public.decorator';
import { UsersService } from './users.service';

@Resolver('Users')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('currentUser')
  currentUser(@CurrentUser() user: CurrentUser) {
    return user;
  }

  @Public()
  @Query('isUsernameFree')
  isUsernameFree(@Args('username') username: string) {
    return this.usersService.isUsernameFree(username);
  }

  @Public()
  @Query('isEmailFree')
  isEmailFree(@Args('email') username: string) {
    return this.usersService.isEmailFree(username);
  }
}
