![Strapi Next.js tutorial](/content/images/2018/10/Article-Next---2.png)

What we are building:
![Restaurants list](/content/images/2018/10/ezgif.com-optimize--1-.gif)

_This tutorial is part of the « Cooking a Deliveroo clone with Next.js (React), GraphQL, Strapi and Stripe » tutorial series._

**Table of contents**

- 🏗️ [Setup](https://blog.strapi.io/nextjs-react-hooks-strapi-food-app-1) (part 1)
- 🏠 [Restaurants](https://blog.strapi.io/nextjs-react-hooks-strapi-restaurants-2) (part 2) - **current**
- 🍔 [Dishes](https://blog.strapi.io/nextjs-react-hooks-strapi-dishes-3) (part 3)
- 🔐 [Authentication](https://blog.strapi.io/nextjs-react-hooks-strapi-auth-4) (part 4)
- 🛒 [Shopping Cart](https://blog.strapi.io/nextjs-react-hooks-strapi-shopping-cart-5) (part 5)
- 💵 [Order and Checkout](https://blog.strapi.io/strapi-next-order-checkout) (part 6)
- 🚀 [Bonus: Deploy](https://blog.strapi.io/strapi-next-deploy) (part 7)

_Note: the **source code** is **available on GitHub**: https://github.com/strapi/strapi-examples/tree/master/nextjs-react-strapi-deliveroo-clone-tutorial_.

## 🏠 Restaurants list

First of all, we need to display the list of restaurants in our web app. Of course, this list is going to be managed through our API. So, we are going to start configuring it.

### Define Content Type

A Content Type, also called a `model`, is a type of data. The Strapi API includes by default, the `user` Content Type. Right now we need restaurants, so our new Content Type is going to be, as you already guessed, `restaurant` (Content Types are always singular).

Here are the required steps:

- Navigate to the Content Type Builder in the sidebar (http://localhost:1337/admin/plugins/content-type-builder).
- Click on `+ Create new collection type.
- Set `restaurant` as name.
- Click on `Continue` and create the followings fields:
  - `name` with type Text.
  - `description` with type Rich Text.
  - `image` with type `Media`.
- Click on Finish
- Click on Save, the server should restart automatically.

![Content Type Builder](/content/images/2020/04/ezgif.com-optimize--6-.gif)

At this point, your server should have automatically restarted and a new link `Restaurants` appears in the left menu.

### Add some entries

Well done! You created your first Content Type. The next step is to add some restaurants in your database. To do so, click on "Restaurants" in the left menu (http://localhost:1337/admin/plugins/content-manager/restaurant?source=content-manager).

You are now in the Content Manager plugin: an auto-generated user interface which let you see and edit entries.

Let's create a restaurant:

- Click on `Add New Restaurant`.
- Give it a name, a description and drop an image.
- Save it.

Create as many restaurants as you would like to see in your apps.

_note: newer version of Strapi looks slightly different than the gif, but same fields and concept_

![Content Manager](/content/images/2018/07/content-manager-restaurant.gif)

### Allow access

Having the items in database is great. Being able to request them from an API is even better. As you already know, Strapi's mission is to create API (I have got a super secret anecdote for you: its name is coming from Boot**strap** your **API** 😮).

When you were creating your `restaurant` Content Type, Strapi created on the backend, a few set of files located in `api/restaurant`.

These files include the logic to expose a fully customizable CRUD API. The `find` route is available at http://localhost:1337/restaurants. Try to visit this URL and will be surprised to be blocked by a 403 forbidden error. This is actually totally normal: Strapi APIs are secured by design.

Don't worry, making this route accessible is actually super intuitive:

- Navigate to the `Roles & Permissions` section of the admin plugin (http://localhost:1337/admin/plugins/users-permissions).
- Click on the `Public` role.
- Tick the `find` and `findone` checkboxes of the `Restaurant` section.
- Save.

![authenticated](/content/images/2020/04/Screen-Shot-2020-04-15-at-7.48.30-PM.png)
_Important_: do the same thing for the `authenticated` role.

Now go back to http://localhost:1337/restaurants: at this point, you should be able to see your list of restaurants.

![Users Permissions](/content/images/2018/07/users-permissions-restaurants-1.gif)

### Enabling GraphQL

By default, API's generated with Strapi are REST endpoints. We can easily integrate the endpoints into GraphQL endpoints using the integrated GraphQL plugin.

Let's do that.

Install the GraphQL plugin from the Strapi marketplace.

Click "Marketplace" on your admin dashboard and select GraphQL and click Download.

That's it, you are done installing GraphQL. Simple Enough.

**Make sure to restart your strapi server if it does not auto restart**

Restart your server, go to http://localhost:1337/graphql and try this query:

`{ restaurants { id name } }`

![Strapi GraphQL](/content/images/2019/09/ezgif.com-optimize--1-.gif)

### Display restaurants

It looks you are going to the right direction. What if we would display these restaurants in our Next app?

![Restaurants list](/content/images/2018/10/ezgif.com-optimize--1-.gif)

Install Apollo in the **frontend of our application**, navigate to the `/frontend` folder in a terminal window:

_Again I am going to lock to the current versions at the time of writing for compatibility. You can choose to use the latest if you follow any upgrade documentation for your package_

**warning, next-apollo v4 breaks this implementation careful if using the latest**

next-apollo v3.1.10
graphql v15.0.0
apollo-boost v0.4.7
@apollo/react-hooks v3.1.5
@apollo/react-ssr v3.1.5

`$ cd frontend`

`$ yarn add next-apollo@3.1.10 graphql@15.0.0 apollo-boost@0.4.7 @apollo/react-hooks@3.1.5 @apollo/react-ssr@3.1.5`

To connect our application with GraphQL we will use Apollo and the next-apollo implementation to wrap our components in a withData function to give them access to make GraphQL data queries.

There are a couple different approaches to implementing GraphQL into a Nextjs app. We are going to extract the Apollo logic into a lib folder and wrap our \_app.js component with a function called withData to give access to Apollo client config inside all child components. This is what gives Apollo access to make GraphQL queries directly in our components as you will see!

This structure allows us to extract certain shared logic of our application into distinct locations for easy upgrades/modifications in the future.

Feel free to implement a different method as you seem fit, this is not dependent on Strapi. Any GraphQL implementation will work with Strapi

Example repo detailing the Apollo Next.js implementation:
https://github.com/adamsoffer/next-apollo-example.

Create a lib directory in the root of the project:

`$ mkdir lib`

`$ cd lib`

`$ touch apollo.js`

---

Path: `/frontend/lib/apollo.js`

<script src="https://gist.github.com/ryanbelke/44964458090e943030863260a572eee4.js"></script>

We will generate the list of Restaurants inside a RestaurantList file as:

`$ cd ..`

`$ cd components`

`$ mkdir RestaurantList`

`$ cd RestaurantList`

`$touch index.js`

Let's wrap \_app.js in our withData call to give the components access to Apollo/GraphQL.

Path: `/fontend/pages/_app.js`

<script src="https://gist.github.com/ryanbelke/07308115af9dbe209ff1052d005f9e36.js"></script>

Path: `/frontend/components/RestaurantList/index.js`

<script src="https://gist.github.com/ryanbelke/11a97da6201b1c11ff04f7a81aa797ef.js"></script>

Now update your `/pages/index.js` home route to display the Restaurant list and a search bar to filter the restaurants:

Path: `/frontend/pages/index.js`

<script src="https://gist.github.com/ryanbelke/4ff801d367b4e4353a2b52bd209b1811.js"></script>

**Now you should see the list of restaurants on the page that are filterable!.**

![Restaurants list](/content/images/2018/10/ezgif.com-optimize--1-.gif)

Well done!

🍔 In the next section, you will learn how to display the **list of dishes**: https://blog.strapi.io/nextjs-react-hooks-strapi-dishes-3
