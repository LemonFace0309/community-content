![Strapi Next.js tutorial](/content/images/2018/10/Article-Next---5.png)

_This tutorial is part of the « Cooking a Deliveroo clone with Next.js (React), GraphQL, Strapi and Stripe » tutorial series._

**Table of contents**

- 🏗️ [Setup](https://blog.strapi.io/nextjs-react-hooks-strapi-food-app-1) (part 1)
- 🏠 [Restaurants](https://blog.strapi.io/nextjs-react-hooks-strapi-restaurants-2) (part 2)
- 🍔 [Dishes](https://blog.strapi.io/nextjs-react-hooks-strapi-dishes-3) (part 3)
- 🔐 [Authentication](https://blog.strapi.io/nextjs-react-hooks-strapi-auth-4) (part 4)
- 🛒 [Shopping Cart](https://blog.strapi.io/nextjs-react-hooks-strapi-shopping-cart-5) (part 5) - **current**
- 💵 [Order and Checkout](https://blog.strapi.io/strapi-next-order-checkout) (part 6)
- 🚀 [Bonus: Deploy](https://blog.strapi.io/strapi-next-deploy) (part 7)
- 👏 [Conclusion](https://blog.strapi.io/strapi-next-conclusion)

_Note: the **source code** is **available on GitHub**: https://github.com/strapi/strapi-examples/tree/master/nextjs-react-strapi-deliveroo-clone-tutorial_

## 🛒 Shopping Cart

All of these dishes look so tasty! What if we could add some of them in a shopping card?

![Shopping card](/content/images/2018/10/ezgif.com-optimize--3-.gif)

Next, we create a new component named `Cart`:

```
cd ..
cd components
mkdir cart
cd cart
touch index.js
```

_Path: `/frontend/components/cart/index.js`_

<script src="https://gist.github.com/ryanbelke/aee693694f6a4b9c1c2515f0295e2e49.js"></script>

## React Context

To keep track of our items added to our cart across pages we will use the React Context API. This will prevent us from having to prop drill the items multiple levels deep. Context will allow us to manage the state of items that will be re-used on the checkout page. The only thing React Context will not take care of for us is preserving items through a page refresh, for that you would want to save the items to a cookie or DB and restore that way in a real world application.

The items are currently saved to a cookie called items and restored if user closes the browser/tab.

We are going to re-use our AppContext from step 4. I am going to add our items to the \_app.js file to make it easy to manipulate/change. This could live in any container of your choosing, it would be a good idea to move it out if your functions/state become large.

Now we will need to make some changes to use our Context throughout the application and on the dishes page.

Update the `_app.js` and `/pages/restaurants.js` files to use the AppProvider/Consumer components:

Path: `/frontend/pages/_app.js`

<script src="https://gist.github.com/ryanbelke/61afd821f0dd5af24d4060bc8a51b965.js"></script>

Path: `/frontend/pages/restaurants.js`

<script src="https://gist.github.com/ryanbelke/c3e863cb2ce3587eed304a75995697ed.js"></script>

Now if you refresh the page you should see the Cart component to the right of the dishes and be able to add items to the cart.

Your Layout header should also update with the username of the logged in user and show a logout button if you are logged in.

Note: In a real world application you should always verify a user/token on the server before processing any user specific actions. While this may not be demonstrated for the sake of the tutorial, you should most certainly do this in a real world application.

Good job, let's finish the last step for ordering our food!

💵 In the next section, you will learn how to **setup Stripe for checkout and create orders**: https://blog.strapi.io/strapi-next-order-checkout.
