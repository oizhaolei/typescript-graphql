import { sign, verifyToken } from '../utils/auth-checker';
import { User } from '../entities/User';

describe('jwt', () => {
  test('normal', async () => {
    const user = {
      _id: '60812f62d46dcf31d97850ef',
      username: 'xx@gmail.com',
      email: 'email',
    };

    const token: string = sign(user);
    const newUser: User = await verifyToken(`Bearer ${token}`);

    expect(newUser.email).toEqual(user.email);
    expect(newUser.username).toEqual(user.username);
  });
});
