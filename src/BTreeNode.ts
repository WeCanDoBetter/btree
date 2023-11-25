import type { Collector, Comparator, Selector } from "./types";
import { Operators } from "./enums";

export class BTreeNode<T, K> {
  readonly compare: Comparator<K>;
  readonly select: Selector<T, K>;
  readonly keys: T[];
  readonly children: BTreeNode<T, K>[];

  leaf: boolean;
  n: number;
  t: number; // Minimum degree

  constructor(
    t: number,
    leaf: boolean,
    compare: Comparator<K>,
    select: Selector<T, K>,
  ) {
    this.t = t;
    this.leaf = leaf;
    this.compare = compare;
    this.select = select;
    this.keys = new Array<T>(2 * t - 1);
    this.children = new Array<BTreeNode<T, K>>(2 * t);
    this.n = 0;
  }

  traverse(): void {
    let i: number;
    for (i = 0; i < this.n; i++) {
      if (!this.leaf) {
        this.children[i].traverse();
      }
    }

    if (!this.leaf) {
      this.children[i].traverse();
    }
  }

  search(
    key: K,
    operator = Operators.Equal,
    collector: Collector<T> = new Set<T>(),
  ): Set<T> {
    let index = this.findIndexOfKey(key);

    switch (operator) {
      case Operators.Equal:
        if (
          index < this.n &&
          this.compare(this.select(this.keys[index]), key) === 0
        ) {
          if (!this.leaf) {
            this.children[index].search(key, operator, collector);
          }
          collector.add(this.keys[index]);
        }
        break;

      case Operators.LessThan:
      case Operators.LessThanOrEqual:
        for (let i = 0; i < index; i++) {
          if (!this.leaf) {
            this.children[i].search(key, operator, collector);
          }
          collector.add(this.keys[i]);
        }
        if (!this.leaf) {
          this.children[index].search(key, operator, collector);
        }
        break;

      case Operators.GreaterThan:
      case Operators.GreaterThanOrEqual:
        for (let i = index; i < this.n; i++) {
          if (!this.leaf) {
            this.children[i + 1].search(key, operator, collector);
          }
          collector.add(this.keys[i]);
        }
        break;

      case Operators.NotEqual:
        for (let i = 0; i < this.n; i++) {
          if (!this.leaf) {
            this.children[i].search(key, operator, collector);
          }
          if (this.compare(this.select(this.keys[i]), key) !== 0) {
            collector.add(this.keys[i]);
          }
        }
        if (!this.leaf) {
          this.children[this.n].search(key, operator, collector);
        }
        break;

      default:
        throw new Error(`Unknown operator: ${operator}`);
    }

    return collector;
  }

  findIndexOfKey(key: K): number {
    let low = 0;
    let high = this.n - 1;
    let mid;

    while (low <= high) {
      mid = Math.floor((low + high) / 2);
      const comparison = this.compare(this.select(this.keys[mid]), key);

      if (comparison < 0) {
        low = mid + 1;
      } else if (comparison > 0) {
        high = mid - 1;
      } else {
        return mid; // Key found
      }
    }

    return low; // Key not found, low is the insertion point
  }

  insertNonFull(value: T): void {
    const key = this.select(value);
    let i = this.n - 1;

    if (this.leaf) {
      while (i >= 0 && this.compare(this.select(this.keys[i]), key) > 0) {
        this.keys[i + 1] = this.keys[i];
        i--;
      }
      this.keys[i + 1] = value;
      this.n++;
    } else {
      while (i >= 0 && this.compare(this.select(this.keys[i]), key) > 0) {
        i--;
      }

      if (this.children[i + 1].n === 2 * this.t - 1) {
        this.splitChild(i + 1, this.children[i + 1]);
        if (this.compare(this.select(this.keys[i + 1]), key) < 0) {
          i++;
        }
      }
      this.children[i + 1].insertNonFull(value);
    }
  }

  splitChild(i: number, y: BTreeNode<T, K>): void {
    let z = new BTreeNode<T, K>(y.t, y.leaf, this.compare, this.select);
    z.n = this.t - 1;

    for (let j = 0; j < this.t - 1; j++) {
      z.keys[j] = y.keys[j + this.t];
    }

    if (!y.leaf) {
      for (let j = 0; j < this.t; j++) {
        z.children[j] = y.children[j + this.t];
      }
    }

    y.n = this.t - 1;

    for (let j = this.n; j >= i + 1; j--) {
      this.children[j + 1] = this.children[j];
    }

    this.children[i + 1] = z;

    for (let j = this.n - 1; j >= i; j--) {
      this.keys[j + 1] = this.keys[j];
    }

    this.keys[i] = y.keys[this.t - 1];
    this.n++;
  }

  *[Symbol.iterator](): Iterator<T> {
    return this._traverse();
  }

  private *_traverse(): Generator<T> {
    for (let i = 0; i < this.n; i++) {
      if (!this.leaf) {
        yield* this.children[i]._traverse();
      }
      yield this.keys[i];
    }

    if (!this.leaf) {
      yield* this.children[this.n]._traverse();
    }
  }
}
