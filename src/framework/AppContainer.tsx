import React from "react";
import { useDrop, XYCoord } from "react-dnd";
import { DragItemApp, DragItemResizeIcon, ItemTypes } from ".";
import AppBox from "./AppBox";
import { FrameworkContext } from "./Framework";

const AppContainer: React.FC<{}> = () => {
  const { apps, moveApp, resizeApp } = React.useContext(FrameworkContext);

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
      {apps.map((app) => (
        <AppBox key={app.insId} runtime={app} />
      ))}
    </div>
  );
};

export default AppContainer;
