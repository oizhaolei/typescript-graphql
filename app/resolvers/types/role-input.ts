import { InputType, Field } from 'type-graphql';

@InputType()
export class RoleInput {
  @Field()
  value: string;

  @Field()
  title: string;
}
