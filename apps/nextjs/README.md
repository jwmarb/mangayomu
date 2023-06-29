# MangaYomu Web

This is the directory holding the website. It uses [Next.js](https://nextjs.org/) as the framework while also using a [Rust](https://www.rust-lang.org/) backend.

## Environment variables

**Do not setup a `.env` file in this directory. Instead, set it up in the root of the repository as `.env.local`**

The environment variables used here are in the table below.

| `.env.local`         | _Description_                                                  |     |
| -------------------- | -------------------------------------------------------------- | --- |
| REACT_APP_REALM_ID   | The app id of your MongoDB realm                               | ❗  |
| REDIS_URL            | The URL to your [redis](https://redis.io/) instance            | ❗  |
| MONGODB_URL          | The URL to your [MongoDB](https://cloud.mongodb.com/) instance | ❗  |
| GOOGLE_OAUTH2_ID     |                                                                | ❗  |
| GOOGLE_OAUTH2_SECRET |                                                                | ❗  |

| Legend | Meaning                                              |
| ------ | ---------------------------------------------------- |
| ❗     | Required for both **production** and **development** |
| ⚠️     | Required only for **development**                    |
| ✅     | Optional (**development** only)                      |

If the environment variable is undefined despite being set in `.env.local`, you may have to add the variables manually via through [vercel-cli](https://vercel.com/) or through this command:

```bash
vercel env add <NAME> [value]
```

## Setting up a development server

Make sure you have the following in your system:

- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/en/download)
- [yarn](https://yarnpkg.com/cli/install) (package manager for Node.js)

Before creating a development server, make sure you are in the root directory of this repository, where `package.json` contains `@mangayomu/root` in the name field.

Install the dependencies with this command.

```bash
yarn
```

Once it finished, build the packages:

```bash
yarn build
```

Everything is done, so the development server can be created. Make sure you have `vercel` because it will be used to run the server. It can be installed via `npm`:

```bash
npm i -g vercel
```

**Before proceeding, you must set up the [environment variables](#environment-variables). After you're done, proceed to the next step**

While you're still in the root directory of this repository, run the following command to start the development server:

```bash
vercel dev
```

**Why use `vercel dev`? Can't we just use `yarn web:dev`?** Although this command works, the Rust backend will remain inactive because this command only starts the Next.js server. In order to have both the Next.js server and Rust backend active at the same time, we must use `vercel dev`

## Building the website

_Note: You must use a distribution of linux to build the server or else vercel will throw errors, such as `Error: Unable to find lambda for route: /favicon.ico`_

To build the website, navigate to the root of this repository and simply type the following command:

```bash
vercel build
```

It will compile the typescript files for the API and build the Next.js application. If building this in a linux distribution throws an error, it'll still build in vercel servers; you probably want to build this in a linux docker container instead. As long as running the development server works, the production build will have no issue running at all.

## ❗ Issues with `@vercel/node` and [Next.js](https://nextjs.org/) ❗

Typescript does not work with `@vercel/node` in a [Next.js](https://nextjs.org/) project. The following error will occur:

`Cannot use import statement outside a module`

Although you can move all your `.ts` files to `app/api`, they will not work there by default because it conflicts with vercel runtimes watching `api/`, and this application uses the app router for Next.js 13 instead of the pages router (See [Next.js documentation](https://nextjs.org/docs/getting-started/project-structure)).

A workaround is to switch to `.js` extension instead of `.ts` and use ES5 syntax. However, there won't be any typesafety to guarantee the functionality of your code before runtime.

Instead, this application has a script that watches the `app/api` directory and compiles typescript into the `api` folder. You can edit the script, which is notably `api-build.js` and `api-watch.js`. The script relies on babel for compilation, so configuration is located in `util.js`.

`vercel dev` will automatically run this script, but if you ever want to run it manually, you can run the following command:

```bash
yarn run api:watch
```

**When importing modules outside of `app/api`, please import from `@server/` instead of `@app/`. Also, any typescript file outside of `app/api` cannot be used for the API**

```js
import redis from '@app/api/redis'; // BAD. Compiled JS will not import modules correctly
import redis from '@server/redis'; // GOOD. Compiled JS with have working relative imports
```
