# MangaYomu Web

This is the directory holding the website. It uses [Next.js](https://nextjs.org/) as the framework while also using a [Rust](https://www.rust-lang.org/) backend.

## Environment variables

**Do not setup a `.env` file in this directory. Instead, set it up in the root of the repository as `.env.local`**

The environment variables used here are in the table below.

| `.env.local`          | _Description_                                                                                    |     |
| --------------------- | ------------------------------------------------------------------------------------------------ | --- |
| REACT_APP_REALM_ID    | The app id of your MongoDB realm                                                                 | ❗  |
| REDIS_URL             | The URL to your [redis](https://redis.io/) instance                                              | ❗  |
| MONGODB_URI           | The URI of your [MongoDB](https://cloud.mongodb.com/) instance                                   | ❗  |
| MONGODB_DATABASE_NAME | The name of your database, which is where all the collections (User, Manga, etc.) are located in | ❗  |
| GOOGLE_OAUTH2_ID      |                                                                                                  | ❗  |
| GOOGLE_OAUTH2_SECRET  |                                                                                                  | ❗  |
| JWT_SECRET            |                                                                                                  | ❗  |
| JWT_EXP_DAYS          |                                                                                                  | ❗  |

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

It will **ONLY** compile the Next.js application. To compile for `api` route, navigate to `<project-root>/apps/backend` and run `yarn run build` from there. If building this in a linux distribution throws an error, it'll still build in vercel servers; you probably want to build this in a linux docker container instead. As long as running the development server works, the production build will have no issue running at all.

## Deploying the website

Do note that this app project is meant for Vercel only. Before deploying, make sure `<project-root>/apps/backend` is built with its `dist` assembled along with compiled js files for Vercel Serverless Functions. To deploy it, make sure you're in the project root directory and run:

```bash
vercel
```

This will upload the files into vercel for deployment.

### Editing the `api` route

To edit the `api` route, the coding should be done in `<project-root>/apps/backend/`. To get started, simply open the directory in your terminal and type the following command:

```bash
yarn run watch
```

This executes a small JS script, which is `watch.js`, along with `tsc` to create declaration files. All API changes (in `<project-root>apps/backend/src/api`) will automatically be compiled into `<project-root>apps/nextjs/api/v1`. The rest will be compiled into `<project-root>apps/backend/dist`, where you can access backend exports such as redis and mongodb for server-side usage in Next.js.

### Building the `api` route

To build `<project-root>/apps/backend`, you can simply type the following command:

```bash
yarn run build
```

Though, this command is not necessary if you already ran `yarn run watch` and created `dist` and `api/v1` files and that the files are up-to-date with your `.ts` code.
