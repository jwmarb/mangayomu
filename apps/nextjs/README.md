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
| JWT_SECRET           | A secret for the JsonWebToken                                  | ❗  |
| JWT_EXPIRES_IN       | How long tokens should expire                                  | ❗  |
| JWT_MAX_AGE          | Max age of a token                                             | ❗  |

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

### ❗ Issues with `@vercel/node` and [Next.js](https://nextjs.org/) ❗

Typescript does not work with `@vercel/node` in a [Next.js](https://nextjs.org/) project. The following error will occur:

`Cannot use import statement outside a module`

Although you can move all your `.ts` files to `app/api`, they will not work there by default because it conflicts with vercel runtimes watching `api/`, and this application uses the app router for Next.js 13 instead of the pages router (See [Next.js documentation](https://nextjs.org/docs/getting-started/project-structure)).

A workaround is to switch to `.js` extension instead of `.ts` and use ES5 syntax. However, there won't be any typesafety to guarantee the functionality of your code before runtime.

Instead, this application has a script and typescript compiler watching for changes in the `app/api` directory. Typescipt compiles the .ts files into `.tmp`, then a script listens for any changes to the `.tmp` folder and copies its contents to `/api`. Additionally, the same script also listens for any deletions/changes in `app/api` and replicates these changes in `/api`, though it does not actually copy the `.ts` files (it only checks the integrity of the files).

`vercel dev` will automatically run this script, but if you ever want to run it manually, you can run the following command:

```bash
yarn run api:watch
```

However, this script does not enable the typescript compiler, so you'll need to enable that manually:

```bash
tsc -w -p tsconfig.api.json
```
