import { Resolver, Mutation, Arg, Query, FieldResolver, Root, PubSub, PubSubEngine, Subscription } from 'type-graphql';

import { Product, ProductModel } from '../entities/Product';
import { ProductInput } from './types/product-input';
import { PaginationInput } from './types/pagination-input';
import { Notification, NotificationPayload } from './types/notification.type';

import { Category, CategoryModel } from '../entities/Category';
import log4js from '../utils/logger';

const logger = log4js('resolvers/Product');

@Resolver(() => Product)
export class ProductResolver {
  @Query(() => Product, { nullable: false })
  async returnSingleProduct(@Arg('id') id: string): Promise<Category | null> {
    return await ProductModel.findById(id);
  }

  @Query(() => [Product])
  async returnAllProducts(@Arg('data') { skip, limit }: PaginationInput): Promise<Product[]> {
    return await ProductModel.find().skip(skip).limit(limit);
  }

  @Mutation(() => Product)
  async createProduct(
    @Arg('data') { name, description, color, stock, price, category }: ProductInput,
    @PubSub() pubSub: PubSubEngine,
  ): Promise<Product> {
    const product = new ProductModel({
      name,
      description,
      color,
      stock,
      price,
      category,
    });
    await product.save();
    logger.info('product:', product.toObject());
    await pubSub.publish('NOTIFICATIONS', {
      product,
    });
    return product;
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg('id') id: string): Promise<boolean> {
    const res = await ProductModel.deleteOne({ _id: id });
    if (res.deletedCount !== 1) throw `category  ${id} is not exist.`;
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllProducts(): Promise<boolean> {
    await ProductModel.deleteMany({});
    return true;
  }

  @FieldResolver(() => Category)
  async category(@Root() product: Product): Promise<Category> {
    return (await CategoryModel.findById(product._doc.category))!;
  }

  @Subscription({ topics: 'NOTIFICATIONS' })
  normalSubscription(@Root() { id, message }: NotificationPayload): Notification {
    return { id, message, date: new Date() };
  }
}
