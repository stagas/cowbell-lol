import { Reactive } from 'minimal-view';
import { oneOf } from './one-of';

export function filterState<T extends Reactive<any, any, { state: U }>, U>(items: Set<T> | Map<any, T>, ...states: U[]) {
  return new Set([...items.values()].filter((item) =>
    oneOf(item.$.state, ...states)
  ))
}
