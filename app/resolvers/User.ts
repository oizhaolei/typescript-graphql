import { Resolver, Mutation, Arg, Query, FieldResolver, Root } from 'type-graphql';
import bcrypt from 'bcrypt';

import { User, UserModel } from '../entities/User';
import { UserInput } from './types/user-input';
// import { LoginInput } from './types/login-input';

import { Cart, CartModel } from '../entities/Cart';
import { PaginationInput } from './types/pagination-input';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: false })
  async returnSingleUser(@Arg('id') id: string): Promise<User | null> {
    return await UserModel.findById(id);
  }

  @Query(() => [User])
  async returnAllUsers(@Arg('data') { skip, limit }: PaginationInput): Promise<User[]> {
    return await UserModel.find().skip(skip).limit(limit);
  }

  @Mutation(() => User)
  async createUser(@Arg('data') { username, email, password, roles, cart }: UserInput): Promise<User> {
    const hash = bcrypt.hashSync(password, 10);
    const user = new UserModel({
      username,
      email,
      password: hash,
      roles,
      cart,
    });
    await user.save();
    return user;
  }

  @Mutation(() => User)
  async updateUser(@Arg('id') id: string, @Arg('data') { username, email, password, cart }: UserInput): Promise<User | null> {
    console.log('updateUser', id);
    const hash = bcrypt.hashSync(password, 10);
    return await UserModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        username,
        email,
        password: hash,
        cart,
      },
      {
        new: true,
      },
    );
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id') id: string): Promise<boolean> {
    await UserModel.deleteOne({ _id: id });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllUsers(): Promise<boolean> {
    await UserModel.deleteMany({});
    return true;
  }

  @FieldResolver(() => Cart)
  async cart(@Root() user: User): Promise<Cart> {
    // console.log(user, "user!")
    return (await CartModel.findById(user.cart))!;
  }
}
