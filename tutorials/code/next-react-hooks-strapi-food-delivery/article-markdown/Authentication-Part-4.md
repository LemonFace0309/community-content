![Strapi Next.js tutorial](/content/images/2018/10/Article-Next---4.png)

_This tutorial is part of the « Cooking a Deliveroo clone with Next.js (React), GraphQL, Strapi and Stripe » tutorial series._

**Table of contents**

- 🏗️ [Setup](https://blog.strapi.io/react-hooks-nextjs-strapi-food-app-1) (part 1)
- 🏠 [Restaurants](https://blog.strapi.io/next-react-hooks-strapi-restaurants-2) (part 2)
- 🍔 [Dishes](https://blog.strapi.io/next-react-hooks-strapi-dishes-3) (part 3)
- 🔐 [Authentication](https://blog.strapi.io/next-react-hooks-strapi-auth-4) (part 4) - **current**
- 🛒 [Shopping Cart](https://blog.strapi.io/strapi-next-cart) (part 5)
- 💵 [Order and Checkout](https://blog.strapi.io/strapi-next-order-checkout) (part 6)
- 🚀 [Bonus: Deploy](https://blog.strapi.io/strapi-next-deploy) (part 7)

_Note: the **source code** is **available on GitHub**: https://github.com/strapi/strapi-examples/tree/master/nextjs-react-strapi-deliveroo-clone-tutorial_.

## 🔐 Authentication

For authentication calls, we will make a POST request to the respective register/login endpoints to register new users and login existing users. Strapi will return a JWT token and a user object, the former can be used to verify transactions on the server while the user object will display out username in the headerbar.

The strapi documentation on authentication can be found here: https://strapi.io/documentation/3.0.0-beta.x/guides/auth-request.html#authenticated-request

Authentication with Next requires some additional consideration outside of a normal client side authentication system because we have to be mindful of whether the code is being rendered on the client or the server. Because of the different constructs between a server and client, client only code should be prevented from running on the server.

One thing to keep in mind is that cookies are sent to the server in the request headers, so using something like next-cookies to universally retrieve the cookie value would work well. I'm not taking this approach in the tutorial, I will use the componentDidMount lifecycle inside the \_app.js file to grab my cookie. componentDidMount only fires client side ensuring that we will have access to the cookie.

A simple check for the window object will prevent client only code from being executed on the server.

This code would only run on the client:

```javascript
if (typeof window === "undefined") {
  return;
}
```

Let's install the following packages:

axios 0.19.2
js-cookie v2.2.1
isomorphic-fetch v2.2.1

```
$ yarn add axios@0.19.2 js-cookie@2.2.1 isomorphic-fetch@2.2.1
```

For authentication, we are going to use Strapi's built-in JWT authentication. This will allow us to easily register, manage, login and check users status in our application.

Your backend admin panel will provide a GUI for user management out of the box to view, edit, activate and delete users if needed.

**User Management in Strapi:**
![](/content/images/2020/04/Screen-Shot-2020-04-26-at-8.56.00-PM.png)

![](/content/images/2020/04/Screen-Shot-2020-04-26-at-8.57.07-PM.png)

The premise of the JWT system is, we will make a POST request to `http://localhost:1337/auth/local/register` with our username, email and password to register a new user. This will return a user object and a JWT token we will store in a cookie on users browser.

Same thing for logging in a user, a POST to `http://localhost:1337/auth/local` with an email/password will return the same user object and JWT token if successful.

Strapi will also expose a `http://localhost:1337/users/me` route that we will make a GET request to, passing our token as an authorization header. This will return just the user object for user verification. We will place this user object in a global context to share throughout the application.

Here is a sample response for the user object that we will retrieve the username/userid from for our orders:

As you can see Strapi will tell us certain user properties such as if the user is confirmed, how they signed up (local/other login service like Discord etc.), their email, username and id among others.

```javascript
{
   "id":1,
   "username":"ryan",
   "email":"ryan@gmail.com",
   "provider":"local",
   "confirmed":true,
   "blocked":null,
   "role":
     {
       "id":1,
       "name":"Authenticated",
       "description":"Default role given to authenticated
        user.",
       "type":"authenticated"
     },
    "created_at":"2020-04-17T01:23:49.285Z",
    "updated_at":"2020-04-17T01:23:49.292Z"
}
```

Let's create a file for our common authentication methods `/lib/auth.js`

```
$ cd lib
$ touch auth.js

```

Inside our `auth.js` file we will create helper functions to login, register and logout our users. An example of a Higher Order Component called withAuthSync is provided as well. This is used to sync logouts accros multiple logged in tabs. However it's not used in the tutorial, only provided for example if need. An HOC is a component that returns a component, this allows us to increase the reusability of our components across our application, a common code pattern in React.

Read more here about HOCs:
https://reactjs.org/docs/higher-order-components.html

`/lib/auth.js`

<script src="https://gist.github.com/ryanbelke/52e1651590fe2218d931ff0b66c3308f.js"></script>

### Authentication

For authentication we are going to be utilizing a JWT token returned from Strapi that is stored as a cookie on the clients browser.

Nothing related to this food tutorial...

Most of the time, progressive web apps store a JSON Web Token (JWT) in the local storage. That works pretty well if you don't have server side rendering (tokens are also stored as a cookie).

Since Next.js renders code on the server, we will need to store our token returned from Strapi as a cookie in the browser, since localStorage is not accessable on the server. This allows the client to set the cookie with a package like **js-cookie** using **Cookie.set(cookie)**.

Our token management will happen client side only, however your application could be developed differently in the real world.

### React Context

In order to store our user object, we will need to create a global context state inside of our application. Context in React allows us to prevent prop-drilling multiple levels down and lets us grab and use the context state locally from a component.

This is a powerful construct in React, and definitely worth reading more on here:
https://reactjs.org/docs/context.html

Let's start by creating a folder where we will store our default context state.

```
$ cd ..
$ mkdir context
$ cd context
$ touch AppContext.js
```

`path: /context/AppContext.js`

<script src="https://gist.github.com/ryanbelke/70db6d12f9a33a7fb9347f71742697a4.js"></script>

Now, let's add state to our \_app.js file to share across the application.

You could also locate this in any container component in your application.

`path: /pages/_app.js`

<script src="https://gist.github.com/ryanbelke/eb27a6952b5c448a3f1811037a488a3a.js"></script>

Let's update our header bar as well to display our username and a logout button if a user is signed in:

`/path/components/Layout.js`

<script src="https://gist.github.com/ryanbelke/238e247267a4e8016fb7b60cb843c264.js"></script>

### Register

To register a user we will pass a username, email and password through a POST request to the route `/auth/local/register`. This will register a user in Strapi and log the user in. Inside of our signup page we will call the registerUser function we created inside of our auth.js file to register the user, then set the JWT cookie inside the browser.

Request body options for auth:

```
NewUsers-PermissionsUser{
username*	         string
                      minLength: 3
email*	            string
                      minLength: 6
provider	          string
password	          string
                      minLength: 6
resetPasswordToken	string
confirmed	         boolean
                      default:  false
blocked	           boolean
                      default: false
role	string
}
```

Swagger docs for the register endpoint:
![swagger](/content/images/2019/10/Screen-Shot-2019-10-06-at-3.50.32-PM.png)

Path: `/frontend/pages/register.js`

<script src="https://gist.github.com/ryanbelke/0d7de518ca5a7fa335d650795801c890.js"></script>

![auth](/content/images/2020/05/Screen-Shot-2020-05-06-at-7.14.39-PM.png)

### Login

Similar to our login page, the sign-in page will use token to log the user in and set the cookie.

Path: `/frontend/pages/login.js`

<script src="https://gist.github.com/ryanbelke/e490b15dcf3beda2dac08ec3f50afda9.js"></script>

![signin](/content/images/2018/10/Screen-Shot-2018-10-12-at-11.36.09-PM.png)

Your user registration, login and logout should be set correctly!

Next we will create the cart functionality.

🛒 In the next section, you will learn how to **create a full featured shopping cart**: https://blog.strapi.io/strapi-next-cart.
