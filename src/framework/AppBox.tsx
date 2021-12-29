import React from "react";
import { AppRuntime, FrameworkContext } from "./Framework";

import { useDrag } from "react-dnd";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const ItemTypes = {
  App: "app",
  ResizeIcon: "resize-icon",
};

const AppBox: React.FC<{
  runtime: AppRuntime<any>;
}> = ({
  runtime: {
    position,
    size,
    order,
    config: { component, title },
    props,
    insId,
  },
}) => {
  const { moveApp, resizeApp, terminateApp, focusApp } =
    React.useContext(FrameworkContext);

  const moveDragRef = useDrag(
    () => ({
      type: ItemTypes.App,
      item: { insId, position },
      end: (_, monitor) => {
        const { insId, position } = monitor.getItem();
        const { x: xo, y: yo } = monitor.getDifferenceFromInitialOffset() || {
          x: 0,
          y: 0,
        };
        const newPosition: [number, number] = [
          position[0] + xo,
          position[1] + yo,
        ];
        moveApp({
          insId,
          position: newPosition,
        });
      },
    }),
    [insId, position]
  )[1];

  const resizeDragRef = useDrag(
    () => ({
      type: ItemTypes.ResizeIcon,
      item: { insId, size },
      end: (_, monitor) => {
        const { insId, size } = monitor.getItem();
        const { x: xo, y: yo } = monitor.getDifferenceFromInitialOffset() || {
          x: 0,
          y: 0,
        };
        const newSize: [number, number] = [
          Math.max(size[0] + xo, 64),
          Math.max(size[1] + yo, 64),
        ];
        resizeApp({
          insId,
          size: newSize,
        });
      },
    }),
    [insId, size]
  )[1];

  const style: React.CSSProperties = {
    position: "absolute",
    top: position[1],
    left: position[0],
    width: size[0],
    height: size[1],
    zIndex: order,

    border: "1px solid rgba(100, 100, 100, 0.2)",
    background: "rgba(255,255,255,1)",
  };

  const Com = component;

  return (
    <div style={style} onClick={() => focusApp({ insId })}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(100, 100, 100, 0.2)",
          background: "rgba(200, 200, 200, 0.2)",
          overflow: 'auto',
        }}
        ref={moveDragRef}
      >
        <div>
          {title} #{insId}
        </div>
        <div>
          <Button
            icon={<CloseOutlined />}
            size="small"
            onClick={() => terminateApp({ insId })}
          />
        </div>
      </div>
      <div
        ref={resizeDragRef}
        style={{
          width: 8,
          height: 8,
          position: "absolute",
          right: 0,
          bottom: 0,
          background: "rgba(200, 200, 200, 0.2)",
          cursor: "se-resize",
        }}
      ></div>
      <Com {...props} />
    </div>
  );
};

export default AppBox;
