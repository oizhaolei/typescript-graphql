import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { Category, CategoryModel } from '../entities/Category';
import { CategoryInput } from './types/category-input';
import HttpException from '../HttpException';
import { logger } from '../utils/logger';

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => Category, { nullable: false })
  async returnSingleCategory(@Arg('id') id: string): Promise<Category | null> {
    return await CategoryModel.findById(id);
  }

  @Query(() => [Category])
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async returnAllCategories() {
    return await CategoryModel.find();
  }

  @Mutation(() => Category)
  async createCategory(@Arg('data') { name, description }: CategoryInput): Promise<Category> {
    const category = new CategoryModel({
      name,
      description,
    });
    await category.save();
    logger.info('category:', category.toObject());
    return category;
  }

  @Mutation(() => Category)
  async updateCategory(@Arg('id') id: string, @Arg('data') { name, description }: CategoryInput): Promise<Category | null> {
    return await CategoryModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        name,
        description,
      },
      {
        new: true,
      },
    );
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg('id') id: string): Promise<boolean> {
    const res = await CategoryModel.deleteOne({ _id: id });
    if (res.deletedCount !== 1) throw new HttpException(400, `category  ${id} is not exist.`);
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllCategories(): Promise<boolean> {
    await CategoryModel.deleteMany({});
    return true;
  }
}
