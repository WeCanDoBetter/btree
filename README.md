# B-Tree for TypeScript

A B-Tree implementation for TypeScript, for use in
[Odin](https://wecandobetter.github.io/odin/), an **in-memory**,
**browser-first** knowledge graph database.

> ⚠️ This project is still in the early stages of development. It is not yet
> ready for use. Tinker with it if you like, but don't come to me when it burns
> down your house. You've been warned.

## Installation

```bash
npm i @wecandobetter/btree
```

## Usage

> ⚠️ Not all functionality is implemented yet. This is a work in progress.

```ts
import { BTree, type Comparator, type Selector } from "@wecandobetter/btree";

const tree = new BTree<string, string>({
  t: 2, // The minimum degree of the tree. Must be >= 2.
  comparator: (a, b) => a.localeCompare(b),
  selector: (a) => a,
});

// Insert a value into the tree.
tree.insert("foo");

// Search for a value in the tree.
const results = tree.search("foo"); // returns a Set<string>
```

## Contributing

Contributions are welcome! If you encounter a bug, have a question, or have an
idea for a new feature, please open an issue. If you would like to contribute
code, please open an issue first to discuss your idea.

## License

OQL is licensed under the [MIT License](LICENSE).

## Links

- [Odin Knowledge Graph](https://wecandobetter.github.io/odin/)
- [We Can Do Better](https://wcdb.life/)

Coded with ❤️ by [We Can Do Better](https://wcdb.life/).
