# Contributing

If you want to contribute to the development of MangaYomu, you are awesome! Your pull request is welcome here:

1. Fork the repo and create your branch from `master`

2. If you've added code that should be tested, add tests.

3. If you've changed APIs, update the documentation.

4. Ensure the test suite passes.

- Wherever your changes are located, run `yarn test` on its root directory (e.g. in `apps/mobile`,
  `packages/mangascraper`, etc.)

5. Make sure your code lints

- Wherever your changes are located, run `yarn lint` on its root directory (e.g. in `apps/mobile`,
  `packages/mangascraper`, etc.)

6. Issue that pull request!

## Reporting bugs

All bug reports are helpful! If you have a bug to report, make sure it follows this structure:

- A summary of the issue/bug

  - If possible, a screenshot/video AND an error if provided

- Steps to reproduce

An example bug report (for example: app crashing) would be:

> The MangaYomu Mobile application crashes whenever I add a manga to my library. I don't know why but here's a video here:
>
> **INSERT VIDEO HERE**
>
> Steps to reproduce:
>
> 1. Go to any manga from X source
> 2. Add X manga to library

# Setting up development environment

Follow the official [React Native documentation](https://reactnative.dev/docs/set-up-your-environment) to set up an environment for development. After that, come back here and follow the guide below:

For best compatibility, make sure to set `JAVA_HOME` globally to the root path of OpenJDK 17 (e.g. `/usr/lib/jvm/java-17-openjdk` or `C:\Program Files\Java\jdk-17`). Your install location may vary among different distros of Linux or operating systems. Other variables such as `ANDROID_HOME` should have been set up according to the [React Native documentation](https://reactnative.dev/docs/set-up-your-environment).

```sh
# .bashrc / .zshrc
export ANDROID_HOME=path/to/Android/Sdk
export JAVA_HOME=path/to/jdk17

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Once you have fully set up your react native environment, install [yarn](https://yarnpkg.com/getting-started/install) since this monorepo uses yarn for managing dependencies. If you are still using the old version of yarn (before `corepack enable`), it will work fine.

There's pretty much not much to do besides installing and building packages, so run the follow commands (assuming you are in the root directory of the repository):

```bash
yarn install && yarn build
```
