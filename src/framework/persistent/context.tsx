// TODO useExternalStorage

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PersistentAgent, RemoteService } from "./agent";

const PersistentContext = React.createContext<PersistentAgent>(
  new PersistentAgent({
    load: () => Promise.resolve(undefined),
    update: () => Promise.resolve(undefined),
  })
);

export const TestPersistentProvider: React.FC = (props) => {
  const provider: RemoteService = useMemo(() => {
    console.log("Create ServiceProvider");
    let rootData: { data: any } = { data: {} };
    return {
      load: () => {
        console.log("start load");
        return new Promise((res) =>
          setTimeout(() => {
            res(rootData.data);
            console.log("resolve once");
          }, 1000)
        );
      },
      update: (key, value) =>
        new Promise((res) => {
          setTimeout(() => {
            // if (key === "") {
            //   rootData.data = value;
            // } else {
            //   let target = rootData.data;
            //   const parts = key.split(".");
            //   const parents = parts.slice(0, parts.length - 1);
            //   const field = parts[parts.length - 1];
            //   for (let kp of parents) {
            //     target = target[kp];
            //   }
            //   target[field] = value;
            // }
            res();
          }, 1000);
        }),
    };
  }, []);

  const datacenter = useMemo(() => {
    console.log("Create DataCenter");
    return new PersistentAgent(provider);
  }, [provider]);

  return (
    <PersistentContext.Provider value={datacenter}>
      {props.children}
    </PersistentContext.Provider>
  );
};

interface PersistentValue<T> {
  loading: boolean;
  value: T | undefined;
}
export function usePersistent<T>(key: string, empty?: T) {
  const [value, setValue] = useState<PersistentValue<T>>({
    loading: true,
    value: empty,
  });

  const dataCenter = useContext(PersistentContext);

  useEffect(() => {
    const { value, loading } = dataCenter.get<T>(key);
    console.log("First GET", value, loading); //!!NO!
    setValue({
      value: value === undefined ? empty : value,
      loading,
    });

    const cb = () => {
      const { value, loading } = dataCenter.get<T>(key);
      console.log("On Callback", value, loading); //!!NO!
      setValue({
        value: value === undefined ? empty : value,
        loading,
      });
    };

    console.log("setup callback");
    dataCenter.on(key, cb);
    return () => {
      console.log("remove callback");
      dataCenter.off(key, cb);
    };
  }, [key, dataCenter, empty]);

  const update = useCallback(
    (value: T) => dataCenter.update(key, value),
    [dataCenter, key]
  );

  return {
    ...value,
    update,
  };
}
