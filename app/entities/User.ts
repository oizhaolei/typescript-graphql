import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';

import { Ref } from '../interfaces/types';

import { Role } from './Role';
import { Cart } from './Cart';

@ObjectType({ description: 'The User model' })
export class User {
  static anonymous: User = new User();

  @Field(() => ID)
  id: string;

  @Field()
  @Property({ required: true })
  username: string;

  @Property({ required: true })
  password: string;

  @Field()
  @Property({ required: true })
  email: string;

  @Field(() => [Role])
  @Property({ type: () => Role, default: [] })
  roles: Role[];

  @Field(() => Cart)
  @Property({ ref: Cart, required: true })
  cart: Ref<Cart>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _doc: any;
}

export const UserModel = getModelForClass(User);
