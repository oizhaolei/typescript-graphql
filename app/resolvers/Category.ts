import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { Category, CategoryModel } from '../entities/Category';
import { CategoryInput } from './types/category-input';
import { PaginationInput } from './types/pagination-input';
import log4js from '../utils/logger';

const logger = log4js('resolvers/Category');

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => Category, { nullable: false })
  async returnSingleCategory(@Arg('id') id: string): Promise<Category | null> {
    return await CategoryModel.findById(id);
  }

  @Query(() => [Category])
  async returnAllCategories(@Arg('data') { skip, limit }: PaginationInput): Promise<Category[]> {
    return await CategoryModel.find().skip(skip).limit(limit);
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
    if (res.deletedCount !== 1) throw `category ${id} is not exist.`;
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllCategories(): Promise<boolean> {
    await CategoryModel.deleteMany({});
    return true;
  }
}
