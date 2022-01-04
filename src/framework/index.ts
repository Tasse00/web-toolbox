import { AppRuntime } from "./Framework";

export const ItemTypes = {
  App: "app",
  ResizeIcon: "resize-icon",
};

export type DragItemApp = AppRuntime<any>;
export type DragItemResizeIcon = AppRuntime<any>;
