import { AppRuntime } from "./Framework";
export const ItemTypes = {
  App: "app",
  ResizeIcon: "resize-icon",
  RightBorderResize: "right-border-resize",
  LeftBorderResize: "left-border-resize",
  TopBorderResize: "top-border-resize",
  BottomBorderResize: "bottom-border-resize",
};

export type DragItemApp = AppRuntime<any>;
export type DragItemResizeIcon = AppRuntime<any>;
export type DragItemRightBorderResize = AppRuntime<any>;
export type DragItemLeftBorderResize = AppRuntime<any>;
export type DragItemTopBorderResize = AppRuntime<any>;
export type DragItemBottomBorderResize = AppRuntime<any>;
