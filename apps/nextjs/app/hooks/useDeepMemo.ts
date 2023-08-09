import React from 'react';

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  else if (
    typeof a === 'object' &&
    a != null &&
    b != null &&
    typeof b === 'object'
  ) {
    if (Object.keys(a).length !== Object.keys(b).length) return false;
    for (const key in a) {
      if (key in b) {
        if (!deepEqual((a as any)[key], (b as any)[key])) return false;
      } else return false;
    }
    return true;
  }
  return false;
}

export default function useDeepMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
) {
  const oldDeps = React.useRef(deps);
  const oldProp = React.useRef(0);
  if (oldDeps.current.length !== deps.length) {
    oldProp.current++;
  } else
    for (let i = 0; i < deps.length; i++) {
      if (!deepEqual(deps[i], oldDeps.current[i])) {
        oldProp.current++;
        break;
      }
    }
  const state = React.useMemo(factory, [oldProp.current]);
  oldDeps.current = deps;
  return state;
}
