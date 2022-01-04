import React from "react";
import { useDragLayer, useDrop, XYCoord } from "react-dnd";
import { DragItemApp, DragItemResizeIcon, ItemTypes } from ".";
import { useCachedArrayRender } from "../common/hooks/render";
import AppBox from "./AppBox";
import { AppContext } from "./AppContext";
import {
  AppRuntime,
  FrameworkContext,
  FrameworkContextValue,
} from "./Framework";

const ZERO_OFFSET = { x: 0, y: 0 };

const AppContainer: React.FC = () => {
  const { apps, moveApp, resizeApp, focusApp, setAppOpen, terminateApp } =
    React.useContext(FrameworkContext);

  const [, drop] = useDrop(
    () => ({
      accept: [ItemTypes.App, ItemTypes.ResizeIcon],
      drop(
        { insId, position, size }: DragItemApp | DragItemResizeIcon,
        monitor
      ) {
        const { x: xo, y: yo } = monitor.getDifferenceFromInitialOffset() || {
          x: 0,
          y: 0,
        };
        if (monitor.getItemType() === ItemTypes.App) {
          const { x: xo, y: yo } =
            monitor.getDifferenceFromInitialOffset() as XYCoord;
          const newPosition: [number, number] = [
            position[0] + xo,
            position[1] + yo,
          ];
          moveApp({
            insId,
            position: newPosition,
          });
        } else if (monitor.getItemType() === ItemTypes.ResizeIcon) {
          const newSize: [number, number] = [
            Math.max(size[0] + xo, 64),
            Math.max(size[1] + yo, 64),
          ];
          resizeApp({
            insId,
            size: newSize,
          });
        }

        return undefined;
      },
    }),
    [moveApp, resizeApp]
  );

  const { offset, dragInsId } = useDragLayer((monitor) => ({
    offset: monitor.getDifferenceFromInitialOffset() || ZERO_OFFSET,
    dragInsId: monitor.getItem()?.insId || "",
  }));

  const elems = useCachedArrayRender(
    AppBoxWithAppContext,
    apps.map((app) => ({
      key: app.insId,
      props: {
        runtime: app,
        dragOffset: app.insId === dragInsId ? offset : ZERO_OFFSET,
        terminateApp,
        resizeApp,
        setAppOpen,
        moveApp,
        focusApp,
      },
    }))
  );

  return (
    <div
      ref={drop}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {elems}
    </div>
  );
};

const AppBoxWithAppContext: React.FC<
  {
    runtime: AppRuntime<any>;
    dragOffset: XYCoord;
  } & Omit<FrameworkContextValue, "apps" | "configs" | "launchApp">
> = ({
  runtime,
  dragOffset,
  terminateApp,
  resizeApp,
  moveApp,
  focusApp,
  setAppOpen,
}) => {
  const insId = runtime.insId;

  const terminate = React.useCallback(
    () => terminateApp({ insId }),
    [insId, terminateApp]
  );

  const resize = React.useCallback(
    (opts: { size: [number, number] }) => resizeApp({ insId, size: opts.size }),
    [insId, resizeApp]
  );

  const move = React.useCallback(
    (opts: { position: [number, number] }) =>
      moveApp({ insId, position: opts.position }),
    [insId, moveApp]
  );

  const setOpen = React.useCallback(
    (opts: { open: boolean }) => setAppOpen({ insId, open: opts.open }),
    [insId, setAppOpen]
  );

  const focus = React.useCallback(() => {
    focusApp({ insId });
  }, [insId, focusApp]);

  const props = React.useMemo(
    () => ({
      runtime,
      control: {
        terminate,
        resize,
        move,
        setOpen,
        focus,
      },
    }),
    [runtime, terminate, resize, move, setOpen, focus]
  );

  return (
    <AppContext.Provider value={props}>
      <AppBox runtime={runtime} dragOffset={dragOffset} />
    </AppContext.Provider>
  );
};

export default AppContainer;
