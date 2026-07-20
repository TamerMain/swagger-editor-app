export function safeStringify(obj: unknown, space = 2): string {
  const seen = new WeakSet();
  const pathMap = new WeakMap();

  // Resolve $ref loops in Spec
  return JSON.stringify(
    obj,
    (key, value) => {
      if (value && typeof value === 'object') {
        if (!pathMap.has(value)) {
          pathMap.set(value, key);
        }
        if (seen.has(value)) {
          const path = pathMap.get(value);
          return `[Circular: ${path || 'root'}]`; // Hint which path is being looped
        }
        seen.add(value);
      }
      return value;
    },
    space,
  );
}
