import { Resolver, Mutation, Arg, Query, FieldResolver, Root, Ctx } from 'type-graphql';

import { Order, OrderModel } from '../entities/Order';
import { OrderInput } from './types/order-input';

import { User, UserModel } from '../entities/User';
import { Product, ProductModel } from '../entities/Product';
import { Context } from '../interfaces/context.interface';

@Resolver(() => Order)
export class OrderResolver {
  @Query(() => Order, { nullable: false })
  async returnSingleOrder(@Arg('id') id: string): Promise<Order | null> {
    return await OrderModel.findById(id);
  }

  @Query(() => [Order])
  async returnAllOrders(@Ctx() ctx: Context): Promise<Order[]> {
    console.log('ctx.user', ctx.user);
    return await OrderModel.find();
  }

  @Mutation(() => Order)
  async createOrder(@Arg('data') { user, date, payed, products }: OrderInput): Promise<Order> {
    const order = new OrderModel({
      user,
      date,
      payed,
      products,
    });
    await order.save();
    return order;
  }

  @Mutation(() => Boolean)
  async deleteOrder(@Arg('id') id: string): Promise<boolean> {
    await OrderModel.deleteOne({ _id: id });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllOrders(): Promise<boolean> {
    await OrderModel.deleteMany({});
    return true;
  }

  @FieldResolver(() => User)
  async user(@Root() order: Order): Promise<User> {
    // console.log(order, "order!")
    return (await UserModel.findById(order.user))!;
  }

  @FieldResolver(() => [Product])
  async products(@Root() order: Order): Promise<Product[]> {
    // console.log(order, "order!")
    return (await ProductModel.find({
      _id: {
        $in: order.products,
      },
    }))!;
  }
}
