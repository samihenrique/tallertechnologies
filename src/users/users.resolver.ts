import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { User } from './user';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, { nullable: true })
  getUser(@Args('id', { type: () => String }) id: string): User | null {
    return this.usersService.getUser(id);
  }

  @Query(() => [User])
  listUsers(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): User[] {
    return this.usersService.listUsers(limit);
  }
}
