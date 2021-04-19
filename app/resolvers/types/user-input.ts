import { InputType, Field, ID } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';
import { User } from '../../entities/User';
import { Role } from '../../entities/Role';
import { ObjectId } from 'mongodb';

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  @Length(1, 255)
  username: string;

  @Field()
  @Length(10, 50)
  password: string;

  @Field()
  @IsEmail()
  email: string;

  @Field(() => Role)
  roles: Role[];

  @Field(() => ID, { nullable: true })
  cart?: ObjectId;
}
