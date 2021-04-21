import { InputType, Field, ID } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';
import { ObjectId } from 'mongodb';

import { User } from '../../entities/User';
import { RoleInput } from './role-input';

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

  @Field(() => [RoleInput])
  roles: RoleInput[];

  @Field(() => ID, { nullable: true })
  cart?: ObjectId;
}
