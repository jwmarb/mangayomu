# Adding a Source Tutorial

## Getting Started

### Prerequisites

The only prerequisite is a basic knowledge of TypeScript and static types.

### Creating the API

All APIs to manga source providers are held in the `packages/mangascrapers` package. You can put anything in your manga source API folder as long as it is used to satisfy the type definition from the class `MangaSource`.

Create a folder in `packages/mangascrapers/src` with the name of your source (let's call this **MyMangaSource**). The file structure should look something like this:

```
.
└── packages/
    └── mangascraper/
        └── src/
            ├── exceptions
            ├── MangaSee
            ├── MangaPark_v5
            └── MyMangaSource
```

Every manga source API must have an `index.ts` to export your API. Do not put anything in this file besides exporting an instance of **MyMangaSource** that will extend the `MangaSource` class.

In **MyMangaSource** folder, create two files:

- `index.ts`
  - This will export an instance of your `MangaSource` class
- `MyMangaSource.tsx` (replace **MyMangaSource** with the name of your source)
  - Your API will be held here
- `MyMangaSource.info.ts`
  - Information about **MyMangaSource** is held here. This includes:
    - The name of your source (so that it can be programmatically referred to in code)
    - The default spoken language of your source
    - The URL to your source's ico

#### Defining the manga source

In order for any application to a manga source API, the API needs information about the manga source. To define the information about the manga source, open `MyMangaSource.info.ts` and create a variable that will hold the information about your manga source:

```ts
import type { MangaSourceInfo } from '../scrapers/scrapers.interfaces';

const MYMANGASOURCE_INFO: MangaSourceInfo<undefined> = {
  name: 'MyMangaSource',
  host: 'https://mymangasource.com/',
  containsNSFW: false,
  genres: [],
  version: '1.0.0',
  language: 'en',
  icon: 'https://mymangasource.com/favicon.png',
};
```

#### Creating a schema

This is variable stores the information about **MyMangaSource**. In most situations, this is fine. But, what if you want your users to be able to filter search results? There is no information regarding the shape of the search filter; the API has no idea how to implement one or knows the shape of it. To do this, you must define the shape of your filter--what fields are filtered, what kind of filter do the fields implement, etc. Fortunately, `@mangayomu/schema-creator` provides a helper function to make this possible.
import MangaSource from '../scraper/scraper';

In the same file `MyMangaSource.info.ts`, use `createSchema` to define your schema:

```ts
import createSchema from '@mangayomu/schema-creator';

const filterSchema = createSchema(
  ({
    createInclusiveExclusiveFilter,
    createOptionFilter,
    createSortFilter,
    createDescription,
  }) => ({
    // DEFINE SCHEMA HERE
  }),
);
```

`createSchema` accepts a callback that returns an object whose keys are the name of the filter field and the values is the data about that filter field. `createSchema` passes helper functions into your callback that you should use to create a filter field. Here's some details about what these helpers do:

- `createInclusiveExclusiveFilter({
  fields: string[]
})`

  - `fields` - A `string[]` that contains all fields to include or exclude in a filter. This is often represented by a checkbox with three states: `include`, `exclude`, `none`.

- `createOptionFilter({
  options: string[],
  default: string
})`

  - `options` - A `string[]` that contains all the possible fields for this option.
  - `default` - A default value for this option. It should be an element from `options`

- `createSortFilter({
  options: string[],
  default: string
})`

  - `options` - A `string[]` that contains all the names of all the possible sorting options
  - `default` - A default value for this sorting option. It should be an element from `options`

- `createDescription({
  str: TextProperty | (TextProperty | TextProperty[])[]
})`
  - `str` - A `TextProperty` that creates a text in this filter. This is a union of multiple types to represent an html paragraph tag in an object.
    - Example #1: `["Hello", { text: "Wo", bold: true }, "rld"]` would be converted into `<p>Hello <b>wo</b>rld</p>`
    - Example #2: `"Hello World"` would be converted into `<p>Hello World</p>`
    - Example #3: `{ text: "Colored warning", color: "warning" }` would be converted into `<p class="warning">Colored warning</p>`

Once you have defined a filter schema, you can now put it in the object defining the information about your manga source.

```ts
import type { MangaSourceInfo } from '../scrapers/scrapers.interfaces';
import createSchema from '@mangayomu/schema-creator';

const filterSchema = createSchema(
  ({
    createInclusiveExclusiveFilter,
    createOptionFilter,
    createSortFilter,
    createDescription,
  }) => ({
    // DEFINE SCHEMA HERE
  }),
);

const MYMANGASOURCE_INFO: MangaSourceInfo<undefined> = {
  // ...
  filterSchema: filterSchema,
};
```

#### Implementing the class

We have defined information about the manga source, but it is only information about the source--not the implementation of the source itself. We can create a class that extends `MangaSource` to create the API of the manga source. Information about the manga source is passed into the constructor, which `MangaSource` will parse for you. Instantiating manga source class is all you have to do.

```ts
import { MYMANGASOURCE_INFO } from './MyMangaSource.info';
import MangaSource from '../scraper/scraper';

class MyMangaSource extends MangaSource {
  // TODO: Implementation
}

export default new MyMangaSource(MYMANGASOURCE_INFO);
```

There will be errors because your class needs to implement required methods. Before implementing them, it would be better for your code editor to auto-generate them with the inferred types that your source uses. **The generic parameters of `MangaSource` allow you to infer types that the source uses as well as for those who wish to interact with your API specifically**.

Implement your methods with the intent of being performant and optimized; do not perform expensive or unnecessary computations. For example:

```ts
// Do NOT do this
largeListOfThings.reduce(
  (previous, curr) => [...previous, doSomething(curr)],
  [],
);

// Do this instead!
largeListOfThings.reduce((previous, curr) => {
  previous.push(curr);
  return previous;
}, []);

// Alternatively, this works fine
const accumulator = [];
for (let i = 0, n = largeListOfThings.length; i < n; i++) {
  accumulator.push(largeListOfThings[i]);
}
```

Slow methods will cause lag spikes that ruin user experience. If necessary, use optimization techniques such as memoization and dynamic programming to make highly performant methods. It is also important to remember that "**premature optimization is the root of all evil**".
