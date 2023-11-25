import { BTree } from "../src/BTree";
import { BTreeNode } from "../src/BTreeNode";
import { Operators } from "../src/enums";
import type { Comparator, Selector } from "../src/types";

describe("BTreeNode", () => {
  const compare: Comparator<number> = (a, b) => a - b;
  const select: Selector<number, number> = (a) => a;

  describe("Constructor", () => {
    const node = new BTreeNode<number, number>(2, true, compare, select);

    it("initializes keys and children arrays with correct sizes", () => {
      expect(node.keys.length).toBe(3); // 2*t - 1
      expect(node.children.length).toBe(4); // 2*t
    });

    it("sets initial values correctly", () => {
      expect(node.leaf).toBe(true);
      expect(node.n).toBe(0);
      expect(node.t).toBe(2);
    });
  });
});

describe("BTree", () => {
  const compare: Comparator<number> = (a, b) => a - b;
  const select: Selector<number, number> = (a) => a;
  let bTree: BTree<number, number>;

  beforeEach(() => {
    bTree = new BTree<number, number>(2, compare, select);
  });

  describe("Constructor", () => {
    it("initializes the tree correctly", () => {
      expect(bTree.root).toBeNull();
      expect(bTree.t).toBe(2);
    });
  });

  describe("insert", () => {
    it("inserts a value into an empty tree", () => {
      bTree.insert(10);
      expect(bTree.search(10)).toContain(10);
    });

    it("inserts multiple values and splits nodes as needed", () => {
      bTree.insert(10);
      bTree.insert(20);
      bTree.insert(5);
      bTree.insert(15);
      bTree.insert(25);

      expect(bTree.search(10)).toContain(10);
      // TODO: Add more assertions...
    });
  });

  describe("search", () => {
    beforeEach(() => {
      bTree.insert(10);
      bTree.insert(20);
      bTree.insert(5);
    });

    it("finds values with the Equal operator", () => {
      const result = bTree.search(10, Operators.Equal);
      expect(result.has(10)).toBeTruthy();
    });

    it("finds values with the LessThan operator", () => {
      const result = bTree.search(15, Operators.LessThan);
      expect(result.has(10)).toBeTruthy();
      expect(result.has(5)).toBeTruthy();
      expect(result.has(20)).toBeFalsy();
    });

    // More search test cases...
  });

  // More tests for BTree methods...
});
