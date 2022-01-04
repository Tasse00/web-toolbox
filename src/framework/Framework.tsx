import React from "react";
import Layout from "../common/components/Layout";
import Bar from "./Bar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AppContainer from "./AppContainer";

const PanelStyle: React.CSSProperties = {
  border: "1px solid rgba(100, 100, 100, 0.5)",
  background: "rgba(200, 200, 200, 0.2)",
};

const Framework: React.FC<{
  defaultConfigs: AppConfig[];
}> = ({ children, defaultConfigs }) => {
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

  return (
    <FrameworkContext.Provider
      value={{
        launchApp,
        terminateApp,
        moveApp,
        resizeApp,
        focusApp,
        setAppOpen,
        configs,
        apps,
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <Layout
          bar={<Bar />}
          barPosition="bottom"
          barStyle={PanelStyle}
          style={{ height: "100vh", width: "100vw" }}
          contentStyle={{ position: "relative", overflow: "hidden" }}
        >
          <AppContainer />
          {children}
        </Layout>
      </DndProvider>
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

  configs: State["configs"];
  apps: State["apps"];
}

export const FrameworkContext = React.createContext<FrameworkContextValue>({
  launchApp: () => {},
  terminateApp: () => {},
  setAppOpen: () => {},
  moveApp: () => {},
  resizeApp: () => {},
  focusApp: () => {},

  configs: [],
  apps: [],
});

export interface AppConfig<Props = {}> {
  appId: string;
  title: string;
  component: React.FC<Props>;
}

export interface AppRuntime<Props = {}> {
  insId: string;
  config: AppConfig<Props>;
  props: Props; // App 参数
  open: boolean; // App 是否打开
  order: number; // 显示顺序，数字越大显示在最前方
  position: [number, number];
  size: [number, number];
}

interface State {
  configs: AppConfig<any>[];
  apps: AppRuntime<any>[];
  nextOrder: number;
}

// 启动App
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

// 中止App
interface ActTerminateApp {
  type: "TERMINATE_APP";
  payload: {
    insId: string;
  };
}

// 移动位置
interface ActMoveApp {
  type: "MOVE_APP";
  payload: {
    insId: string;
    position: AppRuntime["position"];
  };
}

// 改变应用大小
interface ActResizeApp {
  type: "RESIZE_APP";
  payload: {
    insId: string;
    size: AppRuntime["size"];
  };
}

// 打开关闭App
interface ActSetAppOpen {
  type: "SET_APP_OPEN";
  payload: {
    insId: string;
    open: boolean;
  };
}

// 聚焦App, 显示到最上方
interface ActFocusOpen {
  type: "FOCUS_APP";
  payload: {
    insId: string;
  };
}

type Action =
  | ActLaunchApp
  | ActTerminateApp
  | ActSetAppOpen
  | ActMoveApp
  | ActResizeApp
  | ActFocusOpen;

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

      const runtime: AppRuntime<any> = {
        insId,
        config: { ...config },
        props,
        open,
        position,
        size,
        order: state.nextOrder,
      };

      return {
        ...state,
        apps: [...state.apps, runtime],
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
      const maxOrder = Math.max(...state.apps.map(a=>a.order));
      if (maxOrder === state.apps[idx].order) {
        return state;
      }
      const updatedApps = [...state.apps];
      updatedApps[idx] = { ...updatedApps[idx], order: state.nextOrder }
      
      return {
        ...state,
        apps: updatedApps,
        nextOrder: state.nextOrder + 1,
      };
    }
    default: {
      console.error("unknow action", action);
      return state;
    }
  }
}

export default Framework;
