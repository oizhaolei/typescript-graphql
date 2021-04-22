# Integrating Typescript with Graphql using Type-Graphql, a modern framework for building Graphql Node JS APIs

### To compile the application, run `npm run build-ts`

### To start the server, run `npm start`

## Dependencies

 - Typegoose, `@typegoose/typegoose`  A library for defining Mongoose models using TypeScript classes.
 - Type-Graphql, A library for creating GraphQL schema and resolvers with TypeScript, using `classes` and `decorators magic` :)!
 - Apollo-server-express, `apollo-server-express`, A library for quickly bootstrapping graphql servers with Apollo and Express


  ### For a note on other dependencies, please have a look at the `package.json` file.


  Note: Run `npm install` to install all the projects dependencies...

## Seed
```
db.users.insert({"username" : "lei", "email" : "oizhaolei@gmail.com", "password" : "$2b$10$BOl5XcBlAXTkrwnRWoxM5uggwqPdKZroJrml/sIVthEmNphZ2x6Iu", "roles" : [ { value:"ADMIN", title: "ADMIN" }]});

db.users.remove({roles: {$nin: [ { value:"ADMIN", title: "ADMIN" }]}});
```
## TODO
- coverage         -- OK
- more tests...
- pagination       -- OK
- pub/sub
- react client
