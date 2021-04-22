import { Resolver, Mutation, Arg, Authorized, Query, FieldResolver, Root, Ctx } from 'type-graphql';
import bcrypt from 'bcrypt';

import { User, UserModel, Pagination } from '../entities/User';
import { UserInput } from './types/user-input';
import { LoginInput, LoginResult } from './types/login-input';

import { Cart, CartModel } from '../entities/Cart';
import { PaginationInput } from './types/pagination-input';
import { Context } from '../interfaces/context.interface';
import { sign } from '../utils/auth-checker';
import log4js from '../utils/logger';

const logger = log4js('resolvers/user');

@Resolver(() => User)
export class UserResolver {
  @Authorized('ADMIN')
  @Query(() => User, { nullable: false })
  async returnSingleUser(@Arg('id') id: string): Promise<User | null> {
    return await UserModel.findById(id);
  }

  @Authorized('ADMIN')
  @Query(() => Pagination)
  async returnAllUsers(@Arg('data') { skip, limit }: PaginationInput): Promise<Pagination> {
    const totalCount = await UserModel.countDocuments();
    const data = await UserModel.find().skip(skip).limit(limit);
    return {
      totalCount,
      data,
    };
  }

  @Authorized('ADMIN')
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

  @Authorized('ADMIN')
  @Mutation(() => User)
  async updateUser(@Arg('id') id: string, @Arg('data') { username, email, password, cart }: UserInput): Promise<User | null> {
    logger.info('updateUser', id);
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

  @Authorized('ADMIN')
  @Mutation(() => Boolean)
  async deleteUser(@Arg('id') id: string): Promise<boolean> {
    await UserModel.deleteOne({ _id: id });
    return true;
  }

  @Authorized('ADMIN')
  @Mutation(() => Boolean)
  async deleteAllUsers(): Promise<boolean> {
    await UserModel.deleteMany({});
    return true;
  }

  @FieldResolver(() => Cart)
  async cart(@Root() user: User): Promise<Cart> {
    // logger.info(user, "user!")
    return (await CartModel.findById(user.cart))!;
  }

  // register
  @Mutation(() => User)
  async register(@Arg('data') { username, email, password }: UserInput): Promise<User> {
    const hash = bcrypt.hashSync(password, 10);
    const user = new UserModel({
      username,
      email,
      password: hash,
    });
    await user.save();
    return user;
  }
  // login
  @Mutation(() => LoginResult)
  async login(@Arg('data') { email, password }: LoginInput): Promise<LoginResult> {
    const user = await UserModel.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      throw new Error(`email ${email} not found.`);
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }
    const token: string = sign(user.toObject());

    return {
      token,
      user,
    };
  }
  // profile
  @Query(() => User)
  async profile(@Ctx() ctx: Context): Promise<User> {
    logger.info('ctx.user', ctx.user);
    if (!ctx.user) {
      throw new Error('invalid profile.');
    }
    return ctx.user;
  }
}
