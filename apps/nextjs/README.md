# MangaYomu Web

This is the directory holding the website. It uses [Next.js](https://nextjs.org/) as the framework while also using a [Rust](https://www.rust-lang.org/) backend.

## Environment variables

**Do not setup a `.env` file in this directory. Instead, set it up in the root of the repository as `.env.local`**

The environment variables used here are in the table below.

| `.env.local`       | _Description_                                                  |
| ------------------ | -------------------------------------------------------------- |
| REACT_APP_REALM_ID | The app id of your MongoDB realm                               |
| REDIS_URL          | The URL to your [redis](https://redis.io/) instance            |
| MONGODB_URL        | The URL to your [MongoDB](https://cloud.mongodb.com/) instance |

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
