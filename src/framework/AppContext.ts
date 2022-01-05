import React from "react";
import { AppRuntime } from "./Framework";

export interface AppContextProps<T> {
  runtime: AppRuntime<T>;
  container: {
    width: number;
    height: number;
  };
  control: {
    terminate: () => void;
    setOpen: (params: { open: boolean }) => void;
    focus: () => void;
    resize: (params: { size: [number, number] }) => void;
    move: (params: { position: [number, number] }) => void;
    setTitle: (params: { title: string }) => void;
  };
}

export const AppContext = React.createContext<AppContextProps<any>>({
  runtime: {
    config: { title: "", appId: "", component: () => null, defaultProps: {} },
    insId: "",
    order: 0,
    position: [0, 0],
    size: [0, 0],
    props: {},
    open: false,
    title: null,
  },
  container: {
    width: 0,
    height: 0,
  },
  control: {
    terminate: () => {},
    setOpen: () => {},
    focus: () => {},
    resize: () => {},
    move: () => {},
    setTitle: () => {},
  },
});
