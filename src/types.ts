/**
 * Comparator function type.
 *
 * @param a - First value to compare.
 * @param b - Second value to compare.
 * @template K - Type of value to compare.
 */
export type Comparator<K> = (a: K, b: K) => number;

/**
 * Selector function type.
 *
 * @param a - Value to select from.
 * @returns The selected value.
 * @template T - Type of value to select from.
 * @template K - Type of value to select.
 */
export type Selector<T, K> = (a: T) => K;

/**
 * Collector type.
 * @template T - Type of value to collect.
 */
export type Collector<T> = Set<T>;
