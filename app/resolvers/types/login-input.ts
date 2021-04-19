import { InputType, Field } from 'type-graphql';
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
