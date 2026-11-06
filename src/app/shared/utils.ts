import { computed, Signal } from '@angular/core';

function neighbours<T extends { uuid: string }>(
  items: readonly T[],
  uuid: string,
): { prev?: T; next?: T } {
  const index = items.findIndex((item) => item.uuid === uuid);
  return {
    prev: index > 0 ? items[index - 1] : undefined,
    next: index >= 0 && index < items.length - 1 ? items[index + 1] : undefined,
  };
}

export function pagerOf<T extends { uuid: string }>(
  items: Signal<readonly T[]>,
  uuid: Signal<string>,
) {
  return computed(() => neighbours(items(), uuid()));
}