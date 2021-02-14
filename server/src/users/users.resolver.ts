import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'common/decorators/currentUser.decorator';

@Resolver('Users')
export class UsersResolver {
  @Query('currentUser')
  currentUser(@CurrentUser() user: CurrentUser) {
    return user;
  }
}
