![Strapi Next.js tutorial](/content/images/2018/10/Article-Next---7.png)

_This tutorial is part of the « Cooking a Deliveroo clone with Next.js (React), GraphQL, Strapi and Stripe » tutorial series._

**Table of contents**

- 🏗️ [Setup](https://blog.strapi.io/nextjs-react-hooks-strapi-food-app-1) (part 1)
- 🏠 [Restaurants](https://blog.strapi.io/nextjs-react-hooks-strapi-restaurants-2) (part 2)
- 🍔 [Dishes](https://blog.strapi.io/nextjs-react-hooks-strapi-dishes-3) (part 3)
- 🔐 [Authentication](https://blog.strapi.io/nextjs-react-hooks-strapi-auth-4) (part 4)
- 🛒 [Shopping Cart](https://blog.strapi.io/nextjs-react-hooks-strapi-shopping-cart-5) (part 5)
- 💵 [Order and Checkout](https://blog.strapi.io/nextjs-react-hooks-strapi-checkout-6) (part 6)
- 🚀 [Bonus: Deploy](https://blog.strapi.io/nextjs-react-hooks-strapi-deploy) (part 7) - **current**

_Note: the **source code** is **available on GitHub**: https://github.com/strapi/strapi-examples/tree/master/nextjs-react-strapi-deliveroo-clone-tutorial_.

## 🚀 Bonus: deploy

At this point, we only need to deploy our API and our web app.
Strpi can be hosted on any major provider offering node deployments (AWS, Heroku, DO). Read further about deployment of Strapi here:
https://strapi.io/documentation/3.0.0-beta.x/getting-started/deployment.html

### Backend

If deploying your backend to a provider that does not persist storage on the server like Heroku, the default Strapi local server upload will not work as your files on the server are automatically wiped periodically.

Strapi does supports easy file upload to S3, to enable it follow the instructions below.

**Strapi Docs:** https://strapi.io/documentation/3.0.0-beta.x/plugins/upload.html#upload-files

To install the strapi-aws-upload package go to the root of your folder you created Strapi in:

```
$ cd backend
$ yarn add strapi-provider-upload-aws-s3@3.0.0-beta.20.3
```

Create a file at the following location called settings.json `backend/extensions/upload/config/settings.json`

Enter your information for your provider:

```
{
  "provider": "aws-s3",
  "providerOptions": {
    "accessKeyId": "${process.env.AWS_ACCESS_KEY}",
    "secretAccessKey": "${process.env.AWS_SECRET_KEY}",
    "region": "${process.env.AWS_REGION}",
    "params": {
      "Bucket": "${process.env.AWS_BUCKET}"
    }
  }
}
```

We will enter your respective AWS Access Key ID, Secret, Region and Bucket name as environment variables on the server.

**Thats all it takes to enable S3 file uploads with Strapi!**

---

First setup a mongo cluster following these instructions for Atlas DB:

https://strapi.io/documentation/3.0.0-beta.x/guides/databases.html#mongodb-installation

Once that is finished, set your production database config to read:

Edit the file for the appropriate environment, either development or production.

`Path: ./config/environments/(development|production)/database.json`

```
{
  "defaultConnection": "default",
  "connections": {
    "default": {
      "connector": "mongoose",
      "settings": {
        "uri": "${process.env.DATABASE_URI}"
      },
      "options": {
        "ssl": true
      }
    }
  }
}
```

Copy/Paste your DATABASE URI so we can set it on the server, you can locate it from your MongoDB Atlas dashboard under Clusters -> Connect -> Connect Your Application.

It should look like:

`mongodb://paulbocuse:<password>@strapi-heroku-shard-00-00-oxxxo.mongodb.net:27017,strapi-heroku-shard-00-01-oxxxo.mongodb.net:27017,strapi-heroku-shard-00-02-oxxxo.mongodb.net:27017/test?ssl=true&replicaSet=Strapi-Heroku-shard-0&authSource=admin&retryWrites=true&w=majority`

**Make sure to replace "password" with your actual database password**

Note: for stripe you will need to use your production keys, not your test keys.

Init a git project and commit your files:

```
$ cd backend
$ rm yarn.lock # May involved errors if not removed
$ git init
$ git add .
$ git commit -m "Initial commit"
```

Make sure the [Heroku CLI is installed](https://devcenter.heroku.com/articles/heroku-cli#download-and-install) on your computer and deploy:

Create the heroku app, and set the environment variable DATABASE_URI equal to your connection string from your Atlas dashboard.

```
$ heroku create
$ heroku config:set DATABASE_URI="mongodb://ryan:<password>@lit-cluster-shard-00-00-1jqws.mongodb.net:27017,lit-cluster-shard-00-01-1jqws.mongodb.net:27017,lit-cluster-shard-00-02-1jqws.mongodb.net:27017/test?ssl=true&replicaSet=lit-cluster-shard-0&authSource=admin&retryWrites=true&w=majority"
$ heroku config:set AWS_ACCESS_KEY=YOUR ACCESS KEY
$ heroku config:set AWS_SECRET_KET=YOUR SECRET KEY
$ heroku conifg:set AWS_REGION=YOUR BUCKET REGION
$ heroku config:set AWS_BUCKET=YOUR BUCKET NAME
$ git push heroku master
```

![Heroku deploy](/content/images/2018/07/Screen-Shot-2018-07-02-at-19.05.02.png)

You can also set your environment variable manually through Heroku UI by following:

Login to Heroku, navigate you the newly app created.
YourApp -> Settings -> Reveal Config Var

![Heroku](/content/images/2018/10/Screen-Shot-2018-10-20-at-10.51.59-PM.png)

You can view your Strapi backend by visiting the URL/route provided by heroku `/admin` (https://yourapp.com/admin).

_Note: you will have to redefine your permissions rules from the interface again to gain access to your api endpoints._

### Next Deployment

You can easily host your front end on Heroku as well. You will need to modify your packages.json file to add in a heroku-postbuild option that will be run once the code is deployed to start your app. You can also add in the `-p $PORT` flag to your start command

Modify the scripts section if your `packages.json` file to match:

`packages.json`

```
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js -p $PORT",
    "heroku-postbuild": "next build"
  }
```

Heroku assigns a port dynamically, this is accessible from `process.env.PORT`. We will need to tell our express server to listen on this port or the default assigned 3000 port.

This will allow us to run locally on port 3000 and in production to the dynamically assigned Heroku port.

```
process.env.PORT || 3000
```

Full `server.js` file:

<script src="https://gist.github.com/ryanbelke/2b0cb30d4a17cfc67675a6bed47eb71b.js"></script>

Let's create a `.env.production` file for our backend URL so we can connect the two.

```
$ cd ..
$ cd frontend
$ touch .env.production
```

Make the `NEXT_PUBLIC_API_URL` equal to the route for the deployed backend code, for example:

```
NEXT_PUBLIC_API_URL='https://warm-woodland-81109.herokuapp.com'
```

We need to make some small adjustments to account for images getting upload to the S3 bucket. Our API_URL variable won't be valid as the images will get assigned a url name based off the bucket name. To account for this we can put a conditional in our image src attribute, if its running in production use the actual URL returned otherwise use the API_URL/image-name route for localhost.

This is the code being modified:

<script src="https://gist.github.com/ryanbelke/de8c5885f06dccc08154b7aa55aa9df2.js"></script>

`Path: frontend/components/RestaurantList/index.js`

<script src="https://gist.github.com/ryanbelke/b5852d1d4cd6cd02a871263d36ebc97e.js"></script>

`Path: /frontend/pages/restaurants.js`

<script src="https://gist.github.com/ryanbelke/2cf750a323da7f3afb062023f03729e6.js"></script>

Now create the git repo for the frontend:

Init a git project and commit your files:

```
$ git init
$ git add .
$ git commit -m "Initial commit"
```

```
$ heroku create
$ git push heroku master
```

Your command line should show the URL for the application where you can view your app!

Make sure you setup your Strapi API permissions again to view the data!

---

Extra:
##NOW serverless deployment:
_only follow if you want to deploy your next project as a static build site without custom routing/logic_

**Note: The following deployment method will only deploy your project as a static hosted site on the NOW serverless platform. Your custom express server will not be created following this method. _leaving in for reference if needed however not recommended_**

You can host next projects anywhere a node project can be deployed as it is just a node pacakage. For this tutorial we will deploy to NOW, a serverless deployment provider:
https://zeit.co/now

Init a git project and commit your files:

```
cd ..
cd frontend
git init
git add .
git commit -am "Initial commit"
```

First install the NOW command line:

```
npm i -g now
```

Follow the instructions to confirm your email.

Add the following Dockerfile which will:

- Install all the dependencies
- Build the application for production
- Remove non-production dependencies
- Create a new lighter Docker image to reduce boot time
- Pull built files and production dependencies from previous steps
- Expose the port 300 and run the application

Create the Dockerfile at the root of the project:

```
touch Dockerfile
```

Add:

```
FROM mhart/alpine-node:10 as base
WORKDIR /usr/src
COPY package.json yarn.lock /usr/src/
RUN yarn install
COPY . .
RUN yarn build && yarn --production

FROM mhart/alpine-node:base-10
WORKDIR /usr/src
ENV NODE_ENV="production"
COPY --from=base /usr/src .
EXPOSE 3000
CMD ["node", "./node_modules/.bin/next", "start"]
```

Then, create a `now.json` file at the root:

```
touch now.json
```

Contents:

```
{
  "type": "docker",
  "public": true,
  "features": {
    "cloud": "v2"
  }
}
```

Run command `now` for deployment

## Conclusion

Huge congrats, you successfully achieved this tutorial. I hope you enjoyed it!

<iframe src="https://giphy.com/embed/tyxovVLbfZdok" width="480" height="301" frameBorder="0" class="giphy-embed" allowFullScreen style="margin:1.75em auto;"></iframe>

The source code is available on GitHub: https://github.com/ryanbelke/strapi-next.

_Still hungry?_

Feel free to add additional features, adapt this projects to your own needs and give your feedback in the comments section.

_Share your meal!_

You enjoyed this tutorial? Share it around you!
