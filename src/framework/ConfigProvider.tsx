import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "./AppContext";
import {
  PersistentAgent,
  RemoteService,
} from "../common/providers/persistent/agent";
import {
  PersistentContext,
  usePersistent,
} from "../common/providers/persistent/context";
import { BrowserStorage } from "../common/providers/persistent/LocalPersistentProvider";

interface ConfigSource {
  id: string;
  title: string;
  remoteService: RemoteService;
}

const BROWSER_STORAGE = new BrowserStorage("__settings", 300);

export interface ConfigContextProps {
  configSource: ConfigSource;
  setConfigSource: React.Dispatch<React.SetStateAction<ConfigSource>>;
}

export const ConfigContext = React.createContext<ConfigContextProps>({
  configSource: {
    id: "",
    title: "",
    remoteService: {
      load: () => Promise.resolve({}),
      update: () => Promise.resolve(),
    },
  },
  setConfigSource: () => {},
});

export const ConfigProvider: React.FC<{}> = (props) => {
  // TODO 从历史记录中获取
  const [configSource, setConfigSource] = useState<ConfigSource>({
    id: "local",
    title: "Browser Storage",
    remoteService: BROWSER_STORAGE,
  });

  const persistentAgent = useMemo(
    () => new PersistentAgent(configSource.remoteService),
    [configSource]
  );

  const configProviderProps = useMemo(
    () => ({ configSource, setConfigSource }),
    [configSource, setConfigSource]
  );

  return (
    <ConfigContext.Provider value={configProviderProps}>
      <PersistentContext.Provider value={persistentAgent}>
        {props.children}
      </PersistentContext.Provider>
    </ConfigContext.Provider>
  );
};

export function useAppConfig<T>(key: string, defaultValue: T) {
  const {
    runtime: {
      config: { appId },
    },
  } = useContext(AppContext);
  const persistentKey = appId + (key ? `.${key}` : "");
  const { loading, value, update } = usePersistent<T>(persistentKey);
  useEffect(() => {
    if (value === undefined) {
      update(defaultValue);
    }
  }, [value, defaultValue, update]);
  return {
    loading,
    update,
    value: value || defaultValue,
  };
}

export default ConfigProvider;
