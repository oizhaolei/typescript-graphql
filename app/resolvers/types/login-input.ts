import { InputType, Field, ObjectType } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(10, 50)
  password: string;
}
@ObjectType({ description: 'The login result model' })
export class LoginResult {
  @Field()
  token: string;
}
