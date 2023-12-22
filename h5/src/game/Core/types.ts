/** 可以为null 的值别名类型*/
export type Nullable<T> = T | null;

/**
 * 元型类型别名
 * @ignorenaming
 */
type Primitive = undefined | null | boolean | string | number | Function;

/**
 * 类型修饰使对象的所有属性都为只读
 */
export type Immutable<T> = T extends Primitive
  ? T
  // tslint:disable-next-line: array-type
  : T extends Array<infer U>
  ? ReadonlyArray<U>
  : /* T extends Map<infer K, infer V> ? ReadonlyMap<K, V> : // es2015+ only */
  DeepImmutable<T>;

/**
 * 类型修饰使对象的所有属性都为只读(递归)
 */
export type DeepImmutable<T> = T extends Primitive
  ? T
  // tslint:disable-next-line: array-type
  : T extends Array<infer U>
  ? IDeepImmutableArray<U>
  : /* T extends Map<infer K, infer V> ? DeepImmutableMap<K, V> : // es2015+ only */
  DeepImmutableObject<T>;

/**
 * 类型修饰使对象的属性为只读
 */
export type DeepImmutableObject<T> = { readonly [K in keyof T]: DeepImmutable<T[K]> };

/** @hidden */
interface IDeepImmutableArray<T> extends ReadonlyArray<DeepImmutable<T>> { }
/** @hidden */
/* interface DeepImmutableMap<K, V> extends ReadonlyMap<DeepImmutable<K>, DeepImmutable<V>> {} // es2015+ only */