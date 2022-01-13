// TODO useExternalStorage

import React, { useCallback, useContext, useEffect, useState } from "react";
import { PersistentAgent } from "./agent";

export const PersistentContext = React.createContext<PersistentAgent>(
  new PersistentAgent({
    load: () => Promise.resolve(undefined),
    update: () => Promise.resolve(undefined),
  })
);

interface PersistentValue<T> {
  loading: boolean;
  value: T | undefined;
}
export function usePersistent<T>(key: string) {
  const dataCenter = useContext(PersistentContext);

  const [value, setValue] = useState<PersistentValue<T>>({
    loading: dataCenter.isLoading(key),
    value: dataCenter.get<T>(key).value,
  });

  useEffect(() => {
    const { value, loading } = dataCenter.get<T>(key);
    setValue({ value, loading });

    const cb = () => {
      const { value, loading } = dataCenter.get<T>(key);
      setValue({ value, loading });
    };

    dataCenter.on(key, cb);
    return () => {
      dataCenter.off(key, cb);
    };
  }, [key, dataCenter]);

  const update = useCallback(
    (value: T) => dataCenter.update(key, value),
    [dataCenter, key]
  );

  return { ...value, update };
}
