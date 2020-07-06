## Now Featuring React Hooks!

_Updated April 2020_

This is the updated hooks version of the previous tutorial, written with the class based React [here](https://blog.strapi.io/strapi-next-setup/)

This tutorial will walk you through how to use **Next.js** (**React 16.8 w/ hooks**) to power your UI, complete with **GraphQL, Stripe, Strapi and React Context** to develop a full stack application complete with the powerful Strapi (Headless CMS) powering the backend.

Get ready to develop a **online food ordering app, more info on the tech stack here: [Next.js](https://nextjs.org) ([React](https://reactjs.org)), [GraphQL](https://graphql.org), [Stripe](http://stripe.com/) and [Strapi](https://strapi.io/)**! From signup to order, you are going to let users discover restaurants, dishes and order meals.

Your app will be complete with user login, registration, authentication, image upload, restaurant creation, dish creation, cart functionality and stripe order integration.

![Strapi Next.js tutorial](/content/images/2018/10/Article-Next---1.png)

The **demo of the final result** should make you hungry:

![Final Walk Through 3](/content/images/2018/10/ezgif.com-optimize--11-.gif)

_Note: the source code is available on GitHub\*\*: https://github.com/strapi/community-content/tree/master/tutorials/code/next-react-hooks-strapi-food-delivery_.

Screenshots of final product:
![first](/content/images/2018/10/Screen-Shot-2018-10-13-at-5.12.41-PM.png)
![second](/content/images/2018/10/Screen-Shot-2018-10-13-at-5.12.58-PM.png)
![third](/content/images/2018/10/Screen-Shot-2018-10-13-at-5.13.21-PM.png)

### Strapi:

[**Strapi** ](https://github.com/strapi/strapi) is the most advanced open-source **Node.js Headless Content Management System** used to build scalable, secure, production ready API's quickly and efficiently saving developers countless hours of development.

With its extensible plugin system, it provides a large set of built-in features: Admin Panel, Authentication & Permissions management, Content Management, API Generator, etc. Unlike an online CMS, **Strapi is 100% open-source** (take a look at the [GitHub repository](https://github.com/strapi/strapi)), which means:

- Strapi is **completely free**.
- You can **host it on your own servers**, so you own the data.
- It is entirely **customizable and extensible**, thanks to the plugin system.

### Next.js:

[ **Next** ](https://github.com/zeit/next.js/) is a lightweight development framework to create server rendered applications in **React**. Next.js will take care of the heavy lifting of the application build such as _code splitting, HMR (hot module replacement) SSR (server side rendering)_ and allow us to focus on writing the code, not our build config. No more configuration and build tinkering.

### React:

[**React**](https://github.com/facebook/react) is one of the most popular front end Javascript frameworks, developed by facebook and used by countless tech companies including _Netflix, Airbnb and Github_ to build applications. React is a declarative library that makes it easy to create interactive user interfaces, keeping the code base organized through its _component based architecture_.

### GraphQL:

[**GraphQL**](https://github.com/graphql) is a query language also developed by Facebook to allow the front end of an application to easily query an application's API. Each query requests only the data needed to be rendered by the current view. This allows the developer to craft a great user experience across _multiple devices and screen sizes_.

### Stripe:

[**Stripe**](https://github.com/stripe) is one of (if not the largest) payment processor's for application today. Stripe has developed the tools and SDKs to allow developers to craft and integrate _secure, compliant payment processing_ into any app with easy.

## Table of contents

- 🏗️ [Setup](https://blog.strapi.io/nextjs-react-hooks-strapi-food-app-1) (part 1) - **current**
- 🏠 [Restaurants](https://blog.strapi.io/nextjs-react-hooks-strapi-restaurants-2) (part 2)
- 🍔 [Dishes](https://blog.strapi.io/nextjs-react-hooks-strapi-dishes-3) (part 3)
- 🔐 [Authentication](https://blog.strapi.io/nextjs-react-hooks-strapi-auth-4) (part 4)
- 🛒 [Shopping Card](https://blog.strapi.io/nextjs-react-hooks-strapi-shopping-cart-5) (part 5)
- 💵 [Order and Checkout](https://blog.strapi.io/strapi-next-order-checkout) (part 6)
- 🚀 [Bonus: Deploy](https://blog.strapi.io/nextjs-react-hooks-strapi-deploy) (part 7)

## 🏗️ Setup

### Next

To setup Next.js we will need an empty directory to install the library and host our project root.

We will split our project into two parts, one for the front end (Next.js code) and one for the backend (Strapi code).

_note: I am using the current versions of all packages as of the time of writing May 2020 Locking these versions will ensure compatibility in the future. Should you use the current versions of these packages, you may need to update the code according to the documentation of the appropriate package. Upgrade packages at your own will._

Create your project folders and install the current versions of next 9.4.0, react 16.13.1 and react-dom 16.13.1

```
$ mkdir next-react-hooks-strapi-food-delivery
$ cd next-react-hooks-strapi-food-delivery
$ mkdir frontend
$ cd frontend

$ yarn add next@9.4.0 react@16.13.1 react-dom@16.13.1
```

_note: I am using yarn as my package manager, you can also use npm and execute `npm install next@9.4.0 react@16.13.1 react-dom@16.13.1` yarn and npm are interchangeable_.

Add the following to your `package.json` file after your dependencies:

```javascript
"scripts": {
  "dev": "next",
  "build": "next build",
  "start": "next start"
}
```

So that your file looks like this:

```javascript
{
  "dependencies": {
    "next": "9.4.0",
    "react": "16.13.1",
    "react-dom": "16.13.0"
  },
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
}
```

Be sure to create a `.gitignore` in the project root and add `.next` and `node_modules` directories to it:

```
touch .gitignore
```

```
/* .gitignore */
node_modules
.next
```

First things first, let's setup our environment variables to avoid hard coding our API URL and having to update on every deployment.

```
$ touch .env.development
```

`Path: /env.development`

```
NEXT_PUBLIC_API_URL='http://localhost:1337'
```

Next.js is built to handle any routing for us and uses the files in the `/pages` directory as the routes for the application. To setup a route simply create the `/pages` directory and add an `index.js` file with:

```
mkdir pages
cd pages
touch index.js
```

Now that we have our main route (index.js), this will map to the root ('/') (i.e. www.yourapp.com) of your application. To test this you can insert the following into the index.js file:

```
/* /pages/index.js */
export default () => <div>Welcome to next.js!</div>
```

Start the local dev server from the `/frontend` folder in a 2nd terminal window using:

```
$ yarn dev
```

Your application should now be visible at http://localhost:3000.

**Adding Bootstrap**

For this tutorial, we will use [react-strap](https://reactstrap.github.io/) to implement Bootstrap 4 into our application. We will import our styles and CSS directly into the header by importing from the hosted CDN.

First install Reactstrap:

```
$ yarn add reactstrap
```

**reactstrap** is a front end library to easily create Bootstrap components and styling. This will take care of the heavy lifting on the front end.

To import the CSS and share a Layout component across all our pages we will use a custom `_app.js` file inside the **pages directory**.

This file will serve to override the default App.js used by Next and be rendered on each page, allowing us to set and manage global styles and shared components in one place of the application.

You can read more about the `_app.js` handling here: https://nextjs.org/docs/advanced-features/custom-app

This will allow us the ability to import a `<Head>` component and globally set the stylesheet inside the header.

```
$ touch _app.js
```

Path: `/frontend/pages/_app.js`

<script src="https://gist.github.com/ryanbelke/76fd9f9a9a339022d827ea31796e4326.js"></script>

Now if we add in reactstrap components inside of `index.js` we should see the bootstrap styling applied once the page refreshes automatically.

Path: `/frontend/pages/index.js`

<script src="https://gist.github.com/ryanbelke/0c14ca8b247d962e485d82b042c38828.js"></script>

**Restart your server to apply the new changes if you do not see the components listed below.**

## ![picture](/content/images/2018/10/Screen-Shot-2018-09-18-at-5.58.06-PM.png)

#### Designing the page

Now that we have Bootstrap running inside of our Next project, we can begin to style the shared frontend components like the navbar.

First create a folder to store our components and create our layout component:

```
$ cd ..
$ mkdir components
$ cd components
$ touch Layout.js
```

Next uses the `<Link>` component to perform the client side routing between pages. The Link component is a next component and can accept any html element that has an onClick handler as a child component (`<a>`,`<button>`,`<div>` etc.).

To style our navbar we can use the built in CSS in JS syntax `<style jsx>` shipped by default with next.

Inserting CSS in JS as in next is as easy as:

```
<style jsx> {`
  a { color: yellow }
`}
</style>
```

This allows us to scope CSS to the components the style tag is located in. You can also pass in the global option to set a global style across the project: `<style jsx global>` this would set styling across pages and components for all elements that match the css selector.

You can read more on CSS in JS in the Next documents [here](https://nextjs.org/docs/#css-in-js).

Open the `Layout.js` file and create the shared layout components and insert the Stripe script (for later) as follows:

Path: `/frontend/components/Layout.js`

<script src="https://gist.github.com/ryanbelke/b670ece028df9f3d7fe23c64e2e66991.js"></script>

Edit the `_app.js` file to use the new Layout component across the application:

Path: `/frontend/pages/_app.js`

<script src="https://gist.github.com/ryanbelke/62e28befa9043b0678a1565af7417da3.js"></script>

You should now have a shared header bar across all your pages:

![Bootstrap](/content/images/2020/05/Screen-Shot-2020-05-03-at-7.06.50-PM.png)

We will create two additional pages to allow users to sign in and sign up at `/login` and `/register` respectively.

You will need to create the corresponding files inside the `/pages` directory for next to recognize the routes.

```
$ cd ..
$ cd pages

$ touch login.js register.js
```

Populate the files with the following code that we will come back to once our Strapi server is setup.

Path: `/frontend/pages/register.js`

<script src="https://gist.github.com/ryanbelke/4396aae3e2793b58ea26e17364abb7ed.js"></script>

Path: `/frontend/pages/login.js`

<script src="https://gist.github.com/ryanbelke/587c6fb661ddfc374b977dc246de9eb5.js"></script>

---

You should now see the routes at http://localhost:3000/login and http://localhost:3000/register

#### Install MongoDB

We will be using Community Server from MongoDB for our database for this tutorial. If you choose to use a SQL based database like PostgreSQL, your implementation will be different and need to be adapted to suit a relational DB.

Mac installation:

```
$ brew tap mongodb/brew
$ brew install mongodb-community@4.2
```

If your on a mac and want to install manually (brew is recommended though) [Mongo Mac](https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-4.2.5.tgz)

You will need to start the mongo server on your local machine.

On Mac, start the mongo server by running:

```
$ brew services start mongodb-community@4.2
```

#### Install Strapi

Having a frontend is good, but your app obviously needs a backend to manage users, restaurants, dishes and orders. To make the magic happen, let's create a Strapi API.

_Requirements: please make sure to use version >=[Node 9](https://nodejs.org/en/download) and have either [MongoDB](https://docs.mongodb.com/manual/installation/), Postgres or MySQL installed and running on your machine._

##### Create Strapi server

Install [yarn here if you do not have it](https://yarnpkg.com/lang/en/docs/install/#mac-stable):

Go back to the root of your project and create a folder called `backend` & install `strapi` with:

```
$ cd ..
$ cd ..
$ yarn create strapi-app backend
```

You will need to do a manual install of Strapi (not quickstart) in order to use MongoDB.

Use your down arrow key and select Custom (manual settings) and press enter:

![manual install](/content/images/2020/05/Screen-Shot-2020-05-03-at-7.50.49-PM.png)

Select mongo from the list with the arrow keys and enter.

![mongo](/content/images/2020/05/Screen-Shot-2020-05-03-at-7.44.59-PM.png)

Press enter through all the settings to select the default, should look like:

![manaul](/content/images/2020/05/Screen-Shot-2020-05-03-at-7.46.23-PM.png)

Once all the Strapi dependencies are installed navigate to the backend folder and run `yarn develop`:

```
$ cd backend
$ yarn develop
```

![Strapi start](/content/images/2020/05/Screen-Shot-2020-05-03-at-7.52.59-PM.png)

Starting now, you should be able to visit the admin panel of your project: http://localhost:1337/admin.

Full Strapi Mongo instructions here:
https://strapi.io/documentation/3.0.0-beta.x/guides/databases.html#sqlite-installation

To start your strapi server in the future, navigate to the backend folder and run `yarn develop`

#### Create your first User

Add your first user from the [registration page](http://localhost:1337/admin/plugins/users-permissions/auth/register).

![Strapi register](/content/images/2018/07/register.gif)

Good job, you successfully setup both Next.js and Strapi projects! 🎉

🏠 In the next section, you will learn how to display the **list of restaurants**: https://blog.strapi.io/nextjs-react-hooks-strapi-restaurants-2.
