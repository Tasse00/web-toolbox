import storage from '../storage';
import React from 'react';

export function useCachedState<T>(
  key: string,
  defaultValue: T,
): [T, (v: T) => void] {
  const [value, setValue] = React.useState(() =>
    storage.get(key, defaultValue),
  );

  React.useEffect(() => {
    setValue(storage.get(key, defaultValue));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = React.useCallback(
    (v: T) => {
      setValue(v);
      storage.set(key, v);
    },
    [key],
  );
  return [value, update];
}

