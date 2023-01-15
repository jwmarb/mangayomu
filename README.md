# Manga Yomu

## What is it?

MangaYomu will be a mobile application for manga reading. I plan to create a single-page application version of it for desktop devices.

## Setup

Make sure to have the following installed:

```sh
npm i -g yarn
```

Then run

```sh
npm run setup
```

## Notice

At the time of writing this (1/15/23), `react-native` does not like to work with `yarn`. `apps/mobile` will have to run with regular npm.

## Installing Dependencies on Mobile

In order to install a dependency, use the following command while in the root directory:

```sh
npm i <package-name> -w <workspace>
```

## Installing Dependencies on sibling packages

In order to install a dependency on a package that will use a sibling package, use the following command while in the root directory:

```sh
yarn workspace <workspace-name> add <package-name>@^<version>
```

Do note that `version` is required because yarn will think you are trying to install from the npm registry>

## Todo

- Add database
- Add web version
- Add manga page sharing (share page that redirects to web app version)
