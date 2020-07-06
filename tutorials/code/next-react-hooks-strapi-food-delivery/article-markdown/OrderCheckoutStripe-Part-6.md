![Strapi Next.js tutorial](/content/images/2018/10/Article-Next---6.png)

_This tutorial is part of the « Cooking a Deliveroo clone with Next.js (React), GraphQL, Strapi and Stripe » tutorial series._

**Table of contents**

- 🏗️ [Setup](https://blog.strapi.io/nextjs-react-hooks-strapi-food-app-1) (part 1)
- 🏠 [Restaurants](https://blog.strapi.io/nextjs-react-hooks-strapi-restaurants-2) (part 2)
- 🍔 [Dishes](https://blog.strapi.io/nextjs-react-hooks-strapi-dishes-3) (part 3)
- 🔐 [Authentication](https://blog.strapi.io/nextjs-react-hooks-strapi-auth-4) (part 4)
- 🛒 [Shopping Cart](https://blog.strapi.io/nextjs-react-hooks-strapi-shopping-cart-5) (part 5)
- 💵 [Order and Checkout](https://blog.strapi.io/nextjs-react-hooks-strapi-checkout-6) (part 6) - **current**
- 🚀 [Bonus: Deploy](https://blog.strapi.io/nextjs-react-hooks-strapi-deploy) (part 7)

_Note: the **source code** is **available on GitHub**: https://github.com/strapi/strapi-examples/tree/master/nextjs-react-strapi-deliveroo-clone-tutorial_.

## 💵 Order and Checkout

You must start being starving... I am sure you want to be able to order!

![Order](/content/images/2018/10/ezgif.com-optimize--5-.gif)

### Define Content Type

We need to store the orders in our database, so we are going to create a new Content Type in our API.

Same process as usual:

- Navigate to the Content Type Builder (http://localhost:1337/admin/plugins/content-type-builder).
- Click on `+ Create new collection type`.
- Set `order` as name.
- Click on `Add New Field` and create the followings fields:
  - `address` with type `Text`.
  - `city` with type `Text`.
  - `dishes` with type `JSON`.
  - `amount` with type `Number` (big integer).
- Click on Finish then Save.

![Order Content Type Builder](/content/images/2018/11/Screen-Shot-2018-11-07-at-17.31.49.png)

### Allow access

To create new orders from the client, we are going to hit the `create` endpoint of the `order` API. To allow access, navigate to the Roles & Permissions section (http://localhost:1337/admin/plugins/users-permissions), select the `authenticated` role, tick the `order/create` checkbox and save.

![order-create](/content/images/2020/05/Screen-Shot-2020-05-11-at-8.34.48-PM.png)

### Stripe setup

In this section you will need Stripe API keys. To get them, create a Stripe account and navigate to https://dashboard.stripe.com/account/apikeys.

### Add logic

If you have already used Stripe, you probably know the credit card information does not go through your backend server. Instead, the credit card information is sent to the Stripe API (ideally using their SDK). Then, your frontend receives a token that can be used to charge credit cards. The `id` must be sent to your backend which will create the Stripe charge.

Not passing the credit card information through your server relieves you the responsibility to meet complicated data handling compliance, and is just far easier than worrying about securely storing sensitive data.

Install the `stripe` package inside the backend directory:

```
$ cd ..
$ cd ..
$ cd ..
$ cd backend
$ npm i stripe --save
```

In order to integrate the Stripe logic, we need to update the `create` charge endpoint in our Strapi API. To do so, edit `backend/api/order/controllers/order.js` and replace its content with:

_Path: `/backend/api/order/controllers/order.js`_

\*Make sure to insert your stripe secret key (sk\_) at the top where it instructs.

<script src="https://gist.github.com/ryanbelke/16a0d97891f0cb8bb1e1bba5d2f89a4b.js"></script>

_Note: in a real-world example, the amount should be checked on the backend side and the list of dishes related to the command should be stored in a more specific Content Type called `orderDetail`._

Do not forget to restart the Strapi server.

To interact with the Stripe API, we will use the [react-stripe-js](https://github.com/stripe/react-stripe-js) which will give us Elements components to style our credit card form and submit the information properly to Stripe.

### Checkout page

Now let's install the stripe UI elements for the frontend:

```
$ cd ..
$ cd frontend
$ yarn add @stripe/react-stripe-js@1.1.2 @stripe/stripe-js@1.5.0

```

Now we are going to create the checkout form and card section component to capture the credit card info and pass it to Stripe using the react-stripe-elements package:

Create the checkout form files:

```
$ cd components
$ mkdir checkout
$ cd checkout
$ touch CheckoutForm.js
```

_Path: `/frontend/components/checkout/CheckoutForm.js`_

<script src="https://gist.github.com/ryanbelke/9e21e8f4ebd3fa7589f82b60eba01812.js"></script>

Now create a `CardSection.js` file to use the React Elements in, this will house the input boxes that will capture the CC information.

```
$ touch CardSection.js
```

_Path: `/frontend/components/checkout/CardSection.js`_

<script src="https://gist.github.com/ryanbelke/7ff5a28c52ec2e4f29c0a275fb615cab.js"></script>

Let's create the checkout page to bring it all together.

Create a new page: `pages/checkout.js/`,

```
$ cd ..
$ cd ..
$ cd pages
$ touch checkout.js
```

_Path: `/frontend/pages/checkout.js`_

<script src="https://gist.github.com/ryanbelke/8eaa7c68bdb9b545a67efeacc7802570.js"></script>

---

Now if you select a dish and click order you should see:

![CheckoutPicture](/content/images/2018/10/Screen-Shot-2018-10-13-at-1.43.12-PM.png)

Now if you submit your order, you should see the order under the Strapi dashboard as follows:

![Strapi](/content/images/2018/10/Screen-Shot-2018-10-13-at-1.46.27-PM.png)

**Explanations 🕵️**

---

**Note: explanations of code samples only, do not change your code to match this as you should already have this code this is simply a snippet**

The stripe library will be initialized by the `loadStripe('your key')` function/argument.

This will allow the stripe library to load the elements components.

This is what is rendering the card, zip and CVV on a single line.

Stripe will automatically detect which components are generating the CC information and what information to send to receive the token.

This submitOrder function will first make the call to Stripe with the CC information and receive back the Token if the CC check passed. If the token is received we next call the Strapi SDK to create the order passing in the appropriate extra order information and token id.

This is what creates the order in Stripe and creates the DB entry in Strapi. If successful you should see your Stripe test balances increase by the amount of the test order.

<script src="https://gist.github.com/ryanbelke/e30dd9e6a01935301d79df1a61a26fb1.js"></script>

You are now able to let users submit their order.

Bon appétit!

🚀 In the next (and last) section, you will learn how to **deploy your Strapi app on Heroku** and **your frontend app on [NOW](https://zeit.co/now#get-started)**: https://blog.strapi.io/nextjs-react-hooks-strapi-deploy.
