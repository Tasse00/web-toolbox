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
  const { apps, size, moveApp, resizeApp, focusApp, setAppOpen, terminateApp } =
    React.useContext(FrameworkContext);

  const [, drop] = useDrop(
    () => ({
      accept: [
        ItemTypes.App,
        ItemTypes.ResizeIcon,
        ItemTypes.RightBorderResize,
        ItemTypes.LeftBorderResize,
        ItemTypes.TopBorderResize,
        ItemTypes.BottomBorderResize,
      ],
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
        } else if (monitor.getItemType() === ItemTypes.RightBorderResize) {
          const newSize: [number, number] = [
            Math.max(size[0] + xo, 64),
            // Math.max(size[1] + yo, 64),
            size[1],
          ];
          resizeApp({
            insId,
            size: newSize,
          });
        } else if (monitor.getItemType() === ItemTypes.LeftBorderResize) {
          const newSize: [number, number] = [
            Math.max(size[0] - xo, 64),
            // Math.max(size[1] + yo, 64),
            size[1],
          ];
          const newPosition: [number, number] = [position[0] + xo, position[1]];
          resizeApp({
            insId,
            size: newSize,
          });

          moveApp({ insId, position: newPosition });
        } else if (monitor.getItemType() === ItemTypes.TopBorderResize) {
          const newSize: [number, number] = [
            size[0],
            Math.max(size[1] - yo, 64),
          ];
          const newPosition: [number, number] = [position[0], position[1] + yo];
          resizeApp({ insId, size: newSize });
          moveApp({ insId, position: newPosition });
        }else if (monitor.getItemType() === ItemTypes.BottomBorderResize) {
          const newSize: [number, number] = [
            size[0],
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

  const { isDragging, offset, dragInsId } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
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
        size,
      },
    }))
  );

  const maxOrder = React.useMemo(
    () => Math.max(...apps.map((app) => app.order)),
    [apps]
  );

  const layoutPositionPropsElems = useLayoutPositionElems(
    isDragging,
    size,
    resizeApp,
    moveApp,
    maxOrder
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
      {layoutPositionPropsElems}
    </div>
  );
};

function useLayoutPositionElems(
  isDragging: boolean,
  size: [number, number],
  resizeApp: FrameworkContextValue["resizeApp"],
  moveApp: FrameworkContextValue["moveApp"],
  maxOrder: number
) {
  return React.useMemo(() => {
    const zIndex = maxOrder + 1;
    const props: (LayoutPositionProps & { key: string })[] = [
      {
        key: "left",
        style: {
          left: 0,
          marginTop: -32,
          height: 64,
          width: 32,
          top: "50%",
          zIndex,
        },
        isDragging,
        targetSize: [size[0] / 2, size[1]],
        targetPosition: [0, 0],
        resizeApp,
        moveApp,
        tip: "To Left",
      },
      {
        key: "right",
        style: {
          right: 0,
          marginTop: -32,
          height: 64,
          width: 32,
          top: "50%",
          zIndex,
        },
        isDragging,
        targetSize: [size[0] / 2, size[1]],
        targetPosition: [size[0] / 2, 0],
        resizeApp,
        moveApp,
        tip: "To Right",
      },
      {
        key: "top",
        style: {
          top: 0,
          left: "50%",
          marginLeft: -32,
          height: 32,
          width: 64,
          zIndex,
        },
        isDragging,
        targetSize: [size[0], size[1] / 2],
        targetPosition: [0, 0],
        resizeApp,
        moveApp,
        tip: "To Top",
      },
      {
        key: "bottom",
        style: {
          bottom: 0,
          left: "50%",
          marginLeft: -32,
          height: 32,
          width: 64,
          zIndex,
        },
        isDragging,
        targetSize: [size[0], size[1] / 2],
        targetPosition: [0, size[1] / 2],
        resizeApp,
        moveApp,
        tip: "To Bottom",
      },

      {
        key: "lefttop",
        style: {
          top: 0,
          left: 0,
          height: 32,
          width: 32,
          zIndex,
        },
        isDragging,
        targetSize: [size[0] / 2, size[1] / 2],
        targetPosition: [0, 0],
        resizeApp,
        moveApp,
        tip: "To LT",
      },

      {
        key: "righttop",
        style: {
          top: 0,
          right: 0,
          height: 32,
          width: 32,
          zIndex,
        },
        isDragging,
        targetSize: [size[0] / 2, size[1] / 2],
        targetPosition: [size[0] / 2, 0],
        resizeApp,
        moveApp,
        tip: "To RT",
      },

      {
        key: "leftbottom",
        style: {
          bottom: 0,
          left: 0,
          height: 32,
          width: 32,
          zIndex,
        },
        isDragging,
        targetSize: [size[0] / 2, size[1] / 2],
        targetPosition: [0, size[1] / 2],
        resizeApp,
        moveApp,
        tip: "To LB",
      },
      {
        key: "rightbottom",
        style: {
          bottom: 0,
          right: 0,
          height: 32,
          width: 32,
          zIndex,
        },
        isDragging,
        targetSize: [size[0] / 2, size[1] / 2],
        targetPosition: [size[0] / 2, size[1] / 2],
        resizeApp,
        moveApp,
        tip: "To RB",
      },
    ];
    return props.map((props) => <LayoutPosition {...props} />);
  }, [isDragging, size, resizeApp, moveApp, maxOrder]);
}

interface LayoutPositionProps {
  style: React.CSSProperties;
  isDragging: boolean;
  targetSize: [number, number];
  targetPosition: [number, number];
  resizeApp: FrameworkContextValue["resizeApp"];
  moveApp: FrameworkContextValue["moveApp"];
  tip?: string;
}

const LayoutPosition: React.FC<LayoutPositionProps> = ({
  style,
  isDragging,
  targetSize,
  targetPosition,
  resizeApp,
  moveApp,
  tip = "",
}) => {
  const [{ isHover }, dropRef] = useDrop(
    () => ({
      accept: ItemTypes.App,
      collect: (monitor) => ({
        isHover: monitor.isOver(),
      }),
      drop({ insId }: DragItemApp) {
        setTimeout(() => {
          // 2. async resize & move
          moveApp({ insId, position: targetPosition });
          resizeApp({ insId, size: targetSize });
        }, 0);
        // for animation
        // 1. move position to here
        return true;
      },
    }),
    [moveApp, resizeApp, targetPosition, targetSize]
  );

  if (!isDragging) {
    return null;
  } else {
    return (
      <div
        ref={dropRef}
        style={{
          position: "absolute",
          backgroundColor: isHover
            ? "rgba(100,200,100,0.5)"
            : "rgba(200,200,200,0.5)",
          transition: "all 0.2s",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontSize: 12,
          ...style,
        }}
      >
        {tip}
      </div>
    );
  }
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
  size,
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
      container: {
        width: size[0],
        height: size[1],
      },
    }),
    [runtime, terminate, resize, move, setOpen, focus, size]
  );

  return (
    <AppContext.Provider value={props}>
      <AppBox runtime={runtime} dragOffset={dragOffset} />
    </AppContext.Provider>
  );
};

export default AppContainer;
