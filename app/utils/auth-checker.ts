import { AuthChecker } from 'type-graphql';
import jwt from 'jsonwebtoken';

import { jwtOptions } from '../utils/jwt';
import { Context } from '../interfaces/context.interface';
import { User } from '../entities/User';

export const sign = (payload: Record<string, unknown>, opts?: Partial<jwt.SignOptions>): string => {
  const defaultSignOptions: Partial<jwt.SignOptions> = {
    algorithm: 'RS512',
    issuer: jwtOptions.issuer,
    audience: jwtOptions.audience,
    expiresIn: jwtOptions.expiresIn,
  };

  return jwt.sign(payload, jwtOptions.privateKey, {
    ...defaultSignOptions,
    ...opts,
  });
};

export const verifyToken = async (authorization: string, opts?: Partial<jwt.VerifyOptions>): Promise<User> => {
  if (authorization) {
    const token = authorization.replace('Bearer ', '');
    try {
      const defaultVerifyOptions: Partial<jwt.VerifyOptions> = {
        algorithms: ['RS512'],
        issuer: jwtOptions.issuer,
        audience: jwtOptions.audience,
      };

      const userDoc: any = await jwt.verify(token, jwtOptions.publicKey, {
        ...defaultVerifyOptions,
        ...opts,
      });

      return Object.assign(new User(), {
        ...userDoc,
        id: userDoc._id,
      });
    } catch (e) {
      return User.anonymous;
    }
  }
  return User.anonymous;
};

// create auth checker function
export const authChecker: AuthChecker<Context> = ({ context: { user } }, roles) => {
  if (roles.length === 0) {
    // if `@Authorized()`, check only if user exists
    return user !== undefined;
  }
  // there are some roles defined now

  if (!user) {
    // and if no user, restrict access
    return false;
  }
  if (user.roles.some(role => roles.includes(role.value))) {
    // grant access if the roles overlap
    return true;
  }

  // no roles matched, restrict access
  return false;
};
