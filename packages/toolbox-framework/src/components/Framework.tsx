import React, { useEffect, useState } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import ConfigProvider from "./ConfigProvider";
import { Mobile } from "./Mobile/Layout";
import PC from "./PC";
import { BrowserView, MobileView } from "react-device-detect";

export const Framework: React.FC<{
  defaultConfigs: AppConfig[];
}> = ({ defaultConfigs }) => {
  const [{ apps, configs }, dispatch] = React.useReducer(reducer, {
    configs: defaultConfigs,
    apps: [],
    nextOrder: 1,
  });

  const launchApp = React.useCallback(
    (payload) => dispatch({ type: "LAUNCH_APP", payload }),
    [dispatch]
  );
  const terminateApp = React.useCallback(
    (payload) => dispatch({ type: "TERMINATE_APP", payload }),
    [dispatch]
  );
  const setAppOpen = React.useCallback(
    (payload) => dispatch({ type: "SET_APP_OPEN", payload }),
    [dispatch]
  );
  const moveApp = React.useCallback(
    (payload) => dispatch({ type: "MOVE_APP", payload }),
    [dispatch]
  );
  const resizeApp = React.useCallback(
    (payload) => dispatch({ type: "RESIZE_APP", payload }),
    [dispatch]
  );
  const focusApp = React.useCallback(
    (payload) => dispatch({ type: "FOCUS_APP", payload }),
    [dispatch]
  );
  const setAppInsTitle = React.useCallback(
    (payload) => dispatch({ type: "UPDATE_APP_INS_TITLE", payload }),
    [dispatch]
  );

  const [size, setSize] = useState<[number, number]>([400, 200]);

  return (
    <FrameworkContext.Provider
      value={{
        launchApp,
        terminateApp,
        moveApp,
        resizeApp,
        focusApp,
        setAppOpen,
        setAppInsTitle,
        setFrameworkSize: setSize,
        configs,
        apps,
        size,
      }}
    >
      <ConfigProvider>
        <DndProvider backend={HTML5Backend}>
          <BrowserView>
            <PC />
          </BrowserView>

          <MobileView>
            <Mobile />
          </MobileView>
        </DndProvider>
      </ConfigProvider>
    </FrameworkContext.Provider>
  );
};

export interface FrameworkContextValue {
  launchApp: (args: ActLaunchApp["payload"]) => void;
  terminateApp: (args: ActTerminateApp["payload"]) => void;
  setAppOpen: (args: ActSetAppOpen["payload"]) => void;
  moveApp: (args: ActMoveApp["payload"]) => void;
  resizeApp: (args: ActResizeApp["payload"]) => void;
  focusApp: (args: ActFocusOpen["payload"]) => void;
  setAppInsTitle: (args: ActUpdateAppInsTitle["payload"]) => void;
  setFrameworkSize: (args: [number, number]) => void;

  configs: State["configs"];
  apps: State["apps"];
  size: [number, number];
}

export const FrameworkContext = React.createContext<FrameworkContextValue>({
  launchApp: () => {},
  terminateApp: () => {},
  setAppOpen: () => {},
  moveApp: () => {},
  resizeApp: () => {},
  focusApp: () => {},
  setAppInsTitle: () => {},

  setFrameworkSize: () => {},
  configs: [],
  apps: [],
  size: [0, 0],
});

export interface AppConfig<Props = {}> {
  appId: string;
  title: string;
  component: React.FC<Props>;
  defaultProps: Props;
  suggestSize?: [number, number];
}

export interface AppRuntime<Props = {}> {
  insId: string;
  config: AppConfig<Props>;
  title: string | null; // ?????????Title
  props: Props; // App ??????
  open: boolean; // App ????????????
  order: number; // ?????????????????????????????????????????????
  position: [number, number];
  size: [number, number];
}

interface State {
  configs: AppConfig<any>[];
  apps: AppRuntime<any>[];
  nextOrder: number;
}

// ??????App
interface ActLaunchApp {
  type: "LAUNCH_APP";
  payload: {
    appId: string; // appId
    insId: string;
    props: any;
    open?: boolean;
    position?: [number, number];
    size?: [number, number];
  };
}

// ??????App
interface ActTerminateApp {
  type: "TERMINATE_APP";
  payload: {
    insId: string;
  };
}

// ????????????
interface ActMoveApp {
  type: "MOVE_APP";
  payload: {
    insId: string;
    position: AppRuntime["position"];
  };
}

// ??????????????????
interface ActResizeApp {
  type: "RESIZE_APP";
  payload: {
    insId: string;
    size: AppRuntime["size"];
  };
}

// ????????????App
interface ActSetAppOpen {
  type: "SET_APP_OPEN";
  payload: {
    insId: string;
    open: boolean;
  };
}

// ??????App, ??????????????????
interface ActFocusOpen {
  type: "FOCUS_APP";
  payload: {
    insId: string;
  };
}

interface ActUpdateAppInsTitle {
  type: "UPDATE_APP_INS_TITLE";
  payload: {
    insId: string;
    title: string | null;
  };
}

type Action =
  | ActLaunchApp
  | ActTerminateApp
  | ActSetAppOpen
  | ActMoveApp
  | ActResizeApp
  | ActFocusOpen
  | ActUpdateAppInsTitle;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LAUNCH_APP": {
      const {
        appId,
        insId,
        props,
        open = true,
        position = [100, 100],
        size = [400, 300],
      } = action.payload;

      const config = state.configs.find((conf) => conf.appId === appId);
      if (config === undefined) {
        return state;
      }
      if (!action.payload.size && config.suggestSize) {
        size[0] = config.suggestSize[0];
        size[1] = config.suggestSize[1];
      }

      const runtime: AppRuntime<any> = {
        insId,
        config: { ...config },
        props,
        open,
        title: null,
        position,
        size,
        order: state.nextOrder,
      };

      return {
        ...state,
        apps: [runtime, ...state.apps],
        nextOrder: state.nextOrder + 1,
      };
    }
    case "TERMINATE_APP": {
      const { insId } = action.payload;
      return {
        ...state,
        apps: state.apps.filter((app) => app.insId !== insId),
      };
    }
    case "SET_APP_OPEN": {
      const { insId, open } = action.payload;
      const idx = state.apps.findIndex((app) => app.insId === insId);
      if (idx < 0 || state.apps[idx].open === open) {
        return state;
      }
      state.apps[idx] = { ...state.apps[idx], open };
      return {
        ...state,
        apps: [...state.apps],
      };
    }
    case "MOVE_APP": {
      const { insId, position } = action.payload;
      const idx = state.apps.findIndex((app) => app.insId === insId);
      if (idx < 0) {
        return state;
      }
      state.apps[idx] = { ...state.apps[idx], position };
      return {
        ...state,
        apps: [...state.apps],
      };
    }
    case "RESIZE_APP": {
      const { insId, size } = action.payload;
      const idx = state.apps.findIndex((app) => app.insId === insId);
      if (idx < 0) {
        return state;
      }
      state.apps[idx] = { ...state.apps[idx], size };
      return {
        ...state,
        apps: [...state.apps],
      };
    }
    case "FOCUS_APP": {
      const { insId } = action.payload;
      const idx = state.apps.findIndex((app) => app.insId === insId);
      if (idx < 0) {
        return state;
      }
      const maxOrder = Math.max(...state.apps.map((a) => a.order));
      if (maxOrder === state.apps[idx].order) {
        return state;
      }
      const updatedApps = [...state.apps];
      updatedApps[idx] = { ...updatedApps[idx], order: state.nextOrder };
      return {
        ...state,
        apps: updatedApps,
        nextOrder: state.nextOrder + 1,
      };
    }
    case "UPDATE_APP_INS_TITLE": {
      const { insId, title } = action.payload;
      const idx = state.apps.findIndex((app) => app.insId === insId);
      if (idx < 0) {
        return state;
      }
      if (title === state.apps[idx].title) {
        return state;
      }

      const updatedApps = [...state.apps];
      updatedApps[idx] = { ...updatedApps[idx], title };
      return {
        ...state,
        apps: updatedApps,
      };
    }
    default: {
      console.error("unknow action", action);
      return state;
    }
  }
}
