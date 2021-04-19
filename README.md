# Integrating Typescript with Graphql using Type-Graphql, a modern framework for building Graphql Node JS APIs

### To compile the application, run `npm run build-ts`

### To start the server, run `npm start`

## Dependencies

 - Typegoose, `@typegoose/typegoose`  A library for defining Mongoose models using TypeScript classes.
 - Type-Graphql, A library for creating GraphQL schema and resolvers with TypeScript, using `classes` and `decorators magic` :)!
 - Apollo-server-express, `apollo-server-express`, A library for quickly bootstrapping graphql servers with Apollo and Express


  ### For a note on other dependencies, please have a look at the `package.json` file.


  Note: Run `npm install` to install all the projects dependencies...

## Example script

```
mutation createCategory {
  createCategory(data: {
    name: "woman",
    description: "for woman"
  }) {
    id
    name
    description
  }
}
```

```
query returnAllCategories {
  returnAllCategories {
    id
    name
    description
  }
}
```

```
mutation createProduct {
  createProduct(
    data: {
      name: "shirt"
      description: "red shirt"
      color: "red"
      stock: 22
      price: 3599
      category: "5fe4cfdf3b148950401b4ba8"
    }
  ) {
    id
    name
    description
    color
    stock
    price
    category {
      id
      name
      description
    }
  }
}

```

```
query  returnAllProducts {
  returnAllProducts {
    id
    name
    description
    color
    stock
    price
    category {
      id
      name
      description
    }
  }
}
```

```
mutation createCart {
  createCart(data: { products: ["5fe4cfff3b148950401b4ba9"] }) {
    id
    products {
      id
      name
      description
    }
  }
}

```

```
query returnAllCarts {
  returnAllCarts {
    id
    products {
      id
      name
      description
    }
  }
}

```

```
mutation createUser {
  createUser(data: {
    username: "zhaolei",
    email: "oizhaolei@gmail.com"
    cart: "5fe4d0193b148950401b4baa"
  }) {
    id
    username
    email
    cart {
      id
    }
  }
}
```

```
mutation deleteUser {
  deleteUser(id: "5fe4d0353b148950401b4bab")
}
```

```
query returnAllUsers {
  returnAllUsers {
    id
    username
    email
    cart {
      id
    }
  }
}
```

```
mutation createOrder {
  createOrder(
    data: {
      user: "5fe4d0353b148950401b4bab"
      date: "2020/12/12"
      payed: false
      product: "5fe4cfff3b148950401b4ba9"
    }
  ) {
    id
    user {
      id
      username
      email
    }
    date
    payed
    products {
      id
      name
    }
  }
}

```

```
mutation deleteOrder {
  deleteOrder(id: "5fe4a0aa8f201b014c6d7b42")
}
```

```
query returnAllOrders {
  returnAllOrders {
    id
    user
    payed
    date
    products {
      id
      name
    }
  }
}
```


## TODO
- coverage         -- OK
- more tests...
- pagination
- passport
- pub/sub
- react client
