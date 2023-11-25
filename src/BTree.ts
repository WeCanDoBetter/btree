import { BTreeNode } from "./BTreeNode";
import type { Collector, Comparator, Selector } from "./types";
import { Operators } from "./enums";

export class BTree<T, K> {
  /**
   * Compare function.
   * @param a - First value to compare.
   * @param b - Second value to compare.
   * @returns A negative number if a < b, zero if a = b, a positive number if a > b.
   */
  readonly compare: Comparator<K>;

  /**
   * Selector function.
   * @param a - Value to select from.
   * @returns The selected value.
   */
  readonly select: Selector<T, K>;

  #t: number; // Minimum degree
  #root: BTreeNode<T, K> | null = null; // Pointer to root node

  constructor(t: number, compare: Comparator<K>, select: Selector<T, K>) {
    this.#t = t;
    this.compare = compare;
    this.select = select;
  }

  get root(): BTreeNode<T, K> | null {
    return this.#root;
  }

  get t(): number {
    return this.#t;
  }

  /**
   * Traverse the tree.
   */
  traverse(): void {
    if (this.#root != null) {
      this.#root.traverse();
    }
  }

  /**
   * Search the tree for a key.
   * @param key - Key to search for.
   * @param operator - Operator to use for comparison.
   * @param collector - Collector to use for collecting results.
   * @returns A set of values that match the search criteria.
   */
  search(
    key: K,
    operator = Operators.Equal,
    collector: Collector<T> = new Set<T>(),
  ): Set<T> {
    return this.#root?.search(key, operator, collector) ?? collector;
  }

  /**
   * Insert a value into the tree.
   * @param value - Value to insert.
   */
  insert(value: T): void {
    const key = this.select(value);

    if (this.#root == null) {
      // Tree is empty
      this.#root = new BTreeNode<T, K>(
        this.#t,
        true,
        this.compare,
        this.select,
      );
      this.#root.keys[0] = value;
      this.#root.n = 1;
    } else {
      // If the root is full, then tree grows in height
      if (this.#root.n === 2 * this.#t - 1) {
        let s = new BTreeNode<T, K>(this.#t, false, this.compare, this.select);
        s.children[0] = this.#root;
        s.splitChild(0, this.#root);

        // New root, which has two children now, has to decide which child is going to have new key
        let i = 0;
        if (this.compare(this.select(s.keys[0]), key) < 0) {
          i++;
        }
        s.children[i].insertNonFull(value);

        // Change root
        this.#root = s;
      } else {
        // If root is not full, call insertNonFull for root
        this.#root.insertNonFull(value);
      }
    }
  }

  [Symbol.iterator](): Iterator<T> {
    return this.#root?.[Symbol.iterator]() ?? [].values();
  }
}
