import 'dotenv/config';
import App from './app';

import { UserResolver } from './resolvers/User';
import { ProductResolver } from './resolvers/Product';
import { CategoryResolver } from './resolvers/Category';
import { CartResolver } from './resolvers/Cart';
import { OrderResolver } from './resolvers/Order';
import validateEnv from './utils/validateEnv';

validateEnv();
const resolvers = [CategoryResolver, ProductResolver, UserResolver, CartResolver, OrderResolver];

const main = async () => {
  const app = await App(resolvers);
  const { PORT } = process.env;
  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready and listening at ==> http://localhost:${PORT} in ${app.get('env')} mode`);
    console.log('  Press CTRL-C to stop\n');
  });
};

main().catch(error => {
  console.log(error, 'error');
});
