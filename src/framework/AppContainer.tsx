import React from "react";
import { useDragLayer, useDrop, XYCoord } from "react-dnd";
import { DragItemApp, ItemTypes } from ".";
import { useCachedArrayRender } from "../common/hooks/render";
import AppBox from "./AppBox";
import { AppContext } from "./AppContext";
import {
  AppRuntime,
  FrameworkContext,
  FrameworkContextValue,
} from "./Framework";
import "./LayoutPosition.scss";

const ZERO_OFFSET = { x: 0, y: 0 };

const AppContainer: React.FC = () => {
  const {
    apps,
    size,
    moveApp,
    resizeApp,
    focusApp,
    setAppOpen,
    terminateApp,
    setAppInsTitle,
  } = React.useContext(FrameworkContext);

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
      drop({ insId, position, size }: AppRuntime<any>, monitor) {
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
        } else if (monitor.getItemType() === ItemTypes.BottomBorderResize) {
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

  const maxOrder = React.useMemo(
    () => Math.max(...apps.map((app) => app.order), 0),
    [apps]
  );

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
        setAppInsTitle,
        size,
        focused: app.order === maxOrder,
      },
    }))
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
    const props: (Omit<
      LayoutPositionProps,
      "style" | "className" | "isDragging" | "resizeApp" | "moveApp"
    > & { key: string })[] = [
      {
        key: "left",
        targetSize: [size[0] / 2, size[1]],
        targetPosition: [0, 0],
        tip: "To Left",
      },
      {
        key: "right",
        targetSize: [size[0] / 2, size[1]],
        targetPosition: [size[0] / 2, 0],
        tip: "To Right",
      },
      {
        key: "top",
        targetSize: [size[0], size[1] / 2],
        targetPosition: [0, 0],
        tip: "To Top",
      },
      {
        key: "bottom",
        targetSize: [size[0], size[1] / 2],
        targetPosition: [0, size[1] / 2],
        tip: "To Bottom",
      },
      {
        key: "lefttop",
        targetSize: [size[0] / 2, size[1] / 2],
        targetPosition: [0, 0],
        tip: "To LT",
      },
      {
        key: "righttop",
        targetSize: [size[0] / 2, size[1] / 2],
        targetPosition: [size[0] / 2, 0],
        tip: "To RT",
      },

      {
        key: "leftbottom",
        targetSize: [size[0] / 2, size[1] / 2],
        targetPosition: [0, size[1] / 2],
        tip: "To LB",
      },
      {
        key: "rightbottom",
        targetSize: [size[0] / 2, size[1] / 2],
        targetPosition: [size[0] / 2, size[1] / 2],
        tip: "To RB",
      },
    ];
    return props.map((props) => (
      <LayoutPosition
        {...props}
        isDragging={isDragging}
        style={{ zIndex }}
        resizeApp={resizeApp}
        moveApp={moveApp}
        className={`layout-position-${props.key}`}
      />
    ));
  }, [isDragging, size, resizeApp, moveApp, maxOrder]);
}

interface LayoutPositionProps {
  style: React.CSSProperties;
  isDragging: boolean;
  targetSize: [number, number];
  className: string;
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
  className,
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
      drop({ insId, position }: DragItemApp, monitor) {
        // 1. move to current drag position;
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

        setTimeout(() => {
          // 2. async resize & move, for css transition animation
          moveApp({ insId, position: targetPosition });
          resizeApp({ insId, size: targetSize });
        }, 0);

        return undefined;
      },
    }),
    [moveApp, resizeApp, targetPosition, targetSize]
  );

  if (!isDragging) {
    style["opacity"] = 0;
    style["pointerEvents"] = "none";
    style.zIndex = 0;
  }

  return (
    <div
      ref={dropRef}
      className={`${className} ${isHover ? className + "-hover" : ""}`}
      style={style}
    >
      {tip}
    </div>
  );
};

const AppBoxWithAppContext: React.FC<
  {
    runtime: AppRuntime<any>;
    dragOffset: XYCoord;
    focused: boolean;
  } & Omit<FrameworkContextValue, "apps" | "configs" | "launchApp">
> = ({
  runtime,
  dragOffset,
  terminateApp,
  resizeApp,
  moveApp,
  focusApp,
  setAppOpen,
  setAppInsTitle,
  focused,
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

  const setTitle = React.useCallback(
    (opts: { title: string }) => {
      setAppInsTitle({ insId, title: opts.title });
    },
    [insId, setAppInsTitle]
  );

  const props = React.useMemo(
    () => ({
      runtime,
      control: {
        terminate,
        resize,
        move,
        setOpen,
        focus,
        setTitle,
      },
      container: {
        width: size[0],
        height: size[1],
      },
    }),
    [runtime, terminate, resize, move, setOpen, focus, setTitle, size]
  );

  return (
    <AppContext.Provider value={props}>
      <AppBox runtime={runtime} dragOffset={dragOffset} focused={focused} />
    </AppContext.Provider>
  );
};

export default AppContainer;
