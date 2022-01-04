import React from "react";
import { AppRuntime } from "./Framework";

import { useDrag, XYCoord } from "react-dnd";
import { Button } from "antd";
import { CloseOutlined, MinusOutlined } from "@ant-design/icons";
import { ItemTypes } from ".";
import { getEmptyImage } from "react-dnd-html5-backend";
import { AppContext } from "./AppContext";

const ZERO_OFFSET = { x: 0, y: 0 };

const AppBox: React.FC<{
  runtime: AppRuntime<any>;
  dragOffset?: XYCoord;
}> = ({ runtime, dragOffset = ZERO_OFFSET }) => {

  const {
    control: { setOpen, terminate, focus },
  } = React.useContext(AppContext);

  const {
    position,
    size,
    order,
    config: { component, title },
    props,
    insId,
    open,
  } = runtime;

  const [{ isDragging: isDraggingPos }, moveDragRef, preview] = useDrag(
    () => ({
      type: ItemTypes.App,
      item: runtime,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [runtime]
  );

  const [{ isDragging: isDraggingSize }, resizeDragRef] = useDrag(
    () => ({
      type: ItemTypes.ResizeIcon,
      item: runtime,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [runtime]
  );

  const offset = dragOffset;

  const style: React.CSSProperties = {
    position: "absolute",
    top: position[1],
    left: position[0],
    width: size[0],
    height: size[1],
    zIndex: order, // 配合拖动效果

    display: "flex",
    flexDirection: "column",

    border: "1px solid rgba(100, 100, 100, 0.2)",
    background: "rgba(255,255,255,1)",
  };

  if (isDraggingPos) {
    style.top = position[1] + offset.y;
    style.left = position[0] + offset.x;
  }
  if (isDraggingSize) {
    style.width = Math.max(0, size[0] + offset.x);
    style.height = Math.max(0, size[1] + offset.y);
  }

  if (!open) {
    style.top = "100%";
  }

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const com = React.useMemo(() => {
    const Com = component;
    return <Com {...props} />;
  }, [component, props]);
  return (
    <div style={style} onMouseDown={focus}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(100, 100, 100, 0.2)",
          background: "rgba(200, 200, 200, 0.2)",
          overflow: "auto",
        }}
        ref={moveDragRef}
      >
        <div>
          {title} #{insId}
        </div>
        <div>
          <Button
            icon={<MinusOutlined />}
            size="small"
            onClick={() => setOpen({ open: false })}
          />
          <Button
            icon={<CloseOutlined />}
            size="small"
            onClick={() => terminate()}
          />
        </div>
      </div>
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        {com}
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
      />
    </div>
  );
};

export default AppBox;
