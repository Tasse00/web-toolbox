import React from "react";
import { AppRuntime } from "./Framework";

export interface AppContextProps<T> {
  runtime: AppRuntime<T>;

  control: {
    terminate: () => void;
    setOpen: (params: { open: boolean }) => void;
    focus: () => void;
    resize: (params: { size: [number, number] }) => void;
    move: (params: { position: [number, number] }) => void;
  };
}

export const AppContext = React.createContext<AppContextProps<any>>({
  runtime: {
    config: { title: "", appId: "", component: () => null },
    insId: "",
    order: 0,
    position: [0, 0],
    size: [0, 0],
    props: {},
    open: false,
  },
  control: {
    terminate: () => {},
    setOpen: () => {},
    focus: () => {},
    resize: () => {},
    move: () => {},
  },
});
