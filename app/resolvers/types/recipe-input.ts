import { InputType, Field } from "type-graphql";

import { Recipe } from "../../entities/Recipe";

@InputType()
export class RecipeInput implements Partial<Recipe> {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}
