![Strapi Next.js tutorial](/content/images/2018/10/Article-Next---3.png)

_This tutorial is part of the « Cooking a Deliveroo clone with Next.js (React), GraphQL, Strapi and Stripe » tutorial series._

**Table of contents**

- 🏗️ [Setup](https://blog.strapi.io/nextjs-react-hooks-strapi-food-app-1) (part 1)
- 🏠 [Restaurants](https://blog.strapi.io/nextjs-react-hooks-strapi-restaurants-2) (part 2)
- 🍔 [Dishes](https://blog.strapi.io/nextjs-react-hooks-strapi-dishes-3) (part 3) - **current**
- 🔐 [Authentication](https://blog.strapi.io/nextjs-react-hooks-strapi-auth-4) (part 4)
- 🛒 [Shopping Cart](https://blog.strapi.io/nextjs-react-hooks-strapi-shopping-cart-5) (part 5)
- 💵 [Order and Checkout](https://blog.strapi.io/strapi-next-order-checkout) (part 6)
- 🚀 [Bonus: Deploy](https://blog.strapi.io/strapi-next-deploy) (part 7)

_Note: the **source code** is **available on GitHub**: https://github.com/strapi/strapi-examples/tree/master/nextjs-react-strapi-deliveroo-clone-tutorial_.

## 🍔 Dishes list

Congratulations, you successfully displayed the list of restaurants!

### Define Content Type

Every restaurant sells dishes, which also must be stored in the database. Now we need a new Content Type, named `dish`. Create a new Content Type the same way with the following attributes:

- `name` with type `Text`.
- `description` with type `Text (Long Text)`.
- `image` with type `Media (Single media)`.
- `price` with type `Number` (Decimal).
- `restaurant` with type `Relation`: this one is a bit more specific. Our purpose here is to tell Strapi that every dish can be related to a restaurant. To do so, create a one-to-many relation, as below.

![Strapi relation](/content/images/2018/11/Screen-Shot-2018-11-07-at-17.10.39.png)

Here is the final result:

![Dishes fields](/content/images/2020/04/Screen-Shot-2020-04-16-at-6.10.34-PM.png)

### Add some entries

Then, add some dishes from the Content Manager: http://localhost:1337/admin/plugins/content-manager/dish. Make sure they all have an image and are linked to a restaurant.

### Display dishes

![Dishes list](/content/images/2018/10/ezgif.com-optimize--2-.gif)

We will use a new route for `/restaurants` that will take in the ID of restaurant and return the list of dishes for that restaurant:

```
$ cd ..
$ cd ..
$ cd pages
$ touch restaurants.js
```

Path: `/frontend/pages/restaurants.js`

<script src="https://gist.github.com/ryanbelke/88355972c142cf2e496dc4510c1c8308.js"></script>

Now you should see your list of dishes associated with that restaurant if you navigate via the browser.

**We will add the cart in the upcoming sections, hang tight!**

You will notice that if you navigate to the restaurant route and hit refresh, you will get a 404 page. This is because when you click the Link component the client is handling the routing, but on refresh the route is not found by the server.

![404](/content/images/2018/10/Screen-Shot-2018-10-12-at-10.49.05-PM.png)

To handle this we can setup an express server coupled with Next to render the route properly.

```
yarn add express
```

Next create a file `server.js` inside the root of your project directory.

```
cd ..
touch server.js
```

Path: `/frontend/server.js`

<script src="https://gist.github.com/ryanbelke/87f4f9d7fefe323fdbe19864c48aef86.js"></script>

To use the custom express server edit your `packages.json` file and replace the script section with:

```
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  }
```

**Restart the dev server,**
now with a refresh you should see the appropriate dishes as expected on a page refresh.

🔐 In the next section, you will learn how to **authenticate users in your app** (register, logout & login): https://blog.strapi.io/nextjs-react-hooks-strapi-auth-4
