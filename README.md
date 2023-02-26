# Manga Yomu

## What is it?

MangaYomu will be a mobile application for manga reading. I plan to create a NextJS version of it for desktop devices.

## Setup

Do make sure you have `yarn` installed. If not, it is simple to install it globally:

```sh
npm i -g yarn
```

Then in the project root directory, install all the necessary dependencies by running:

```sh
yarn
```

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
```

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

## Todo

- Add database
- Add web version
- Add manga page sharing (share page that redirects to web app version)
- Convert Expo to React Native
