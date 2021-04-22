import { InputType, Field } from 'type-graphql';

@InputType()
export class PaginationInput {
  @Field()
  skip: number;

  @Field()
  limit: number;
}
