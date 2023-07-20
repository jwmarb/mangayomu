# Manga Yomu

## What is it?

MangaYomu will be a mobile application for manga reading. I plan to create a NextJS version of it for desktop devices.

## Setup

Install all the necessary global dependencies

```sh
npm i -g yarn concurrently nx
```

- **nx** Monorepo management tool
- **concurrently** Parallelization tool
- **yarn** Package manager / Monorepo management tool

Then while you're still in the project root directory, install all the necessary dependencies by running:

```sh
yarn install
```

Then build all the necessary dependencies:

```sh
yarn build
```

_Note: building packages is required for all apps to run as they are local dependencies_

## Using yarn workspaces

### Installing dependencies

In order to install a dependency on a package that will use a sibling package, use the following command while in the root directory:

```sh
yarn workspace <workspace-name> add <package-name>@^<version>
```

Do note that `version` is required because yarn will think you are trying to install from the npm registry.

### Running mobile

The mobile app uses [React Native](https://reactnative.dev/). There is no iOS support, however, I plan to add support for it once I can get my hands on a MacBook.

Before starting the server, it is required to setup variables in a `.env` in the root directory of `apps/mobile`.

```
# Replace the following encapsulated by curly brackets
REACT_APP_REALM_ID={realmId}
BACK_END_DOMAIN={api.mydomain.com} # Auth requests are sent here
GOOGLE_OAUTH2_ID={id} # Should be a web application id
```

#### Generating a SHA1 keystore

Using a terminal, navigate to the `android` folder and run `./gradlew signingReport`. This will generate SHA1 keystores for both `release` and `debug`. Add the SHA1 certificates in the [Google Developer Console](https://console.developers.google.com/apis/credentials) under OAuth 2.0 Client IDs, in which the credentials are type `Android`.

Additionally, you must create a web client id. Follow the instructions [here](https://developers.google.com/identity/sign-in/android/start#configure-a-google-api-project)

Make sure to make changes to `apps\mobile\android\app\src\main\res\values\strings.xml` if you wish to use different values.

To start the development server from the root directory:

```sh
yarn android:metro
```

followed by

```sh
yarn android:start
```

If you are in `apps/mobile` directory, you can simply run:

```sh
npx react-native start
```

or

```sh
yarn start
```

Both will work; it depends which one you want to use :)

### Running web

To run the development server, you must have `vercel-cli` installed in your system. If not, you can simply install it via:

```sh
npm i -g vercel
```

After you have `vercel-cli` installed, refer to this [documentation](/apps/nextjs/README.md)

## Todo

- Add database
- Add manga page sharing (share page that redirects to web app version)
