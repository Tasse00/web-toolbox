import React, { useEffect } from "react";
import "./AppBox.scss";
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
    control: { setOpen, terminate, focus, resize, move },
    container,
  } = React.useContext(AppContext);

  const {
    position,
    size,
    order,
    config: { component, title },
    props,
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

  const [{ isDragging: isDraggingSize }, resizeDragRef, previewResizeDrag] =
    useDrag(
      () => ({
        type: ItemTypes.ResizeIcon,
        item: runtime,
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }),
      [runtime]
    );
  useEffect(() => {
    previewResizeDrag(getEmptyImage(), { captureDraggingState: true });
  }, [previewResizeDrag]);

  const [
    { isDragging: isDraggingRightBorder },
    rightResizeDragRef,
    rightResizePreview,
  ] = useDrag(
    () => ({
      type: ItemTypes.RightBorderResize,
      item: runtime,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [runtime]
  );
  useEffect(() => {
    rightResizePreview(getEmptyImage(), { captureDraggingState: true });
  }, [rightResizePreview]);

  const [
    { isDragging: isDraggingLeftBorder },
    leftResizeDragRef,
    leftResizePreview,
  ] = useDrag(
    () => ({
      type: ItemTypes.LeftBorderResize,
      item: runtime,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [runtime]
  );

  useEffect(() => {
    leftResizePreview(getEmptyImage(), { captureDraggingState: true });
  }, [leftResizePreview]);
  const [
    { isDragging: isDraggingTopBorder },
    topResizeDragRef,
    topResizePreview,
  ] = useDrag(
    () => ({
      type: ItemTypes.TopBorderResize,
      item: runtime,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [runtime]
  );
  useEffect(() => {
    topResizePreview(getEmptyImage(), { captureDraggingState: true });
  }, [topResizePreview]);
  const [
    { isDragging: isDraggingBottomBorder },
    bottomResizeDragRef,
    bottomResizePreview,
  ] = useDrag(
    () => ({
      type: ItemTypes.BottomBorderResize,
      item: runtime,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [runtime]
  );
  useEffect(() => {
    bottomResizePreview(getEmptyImage(), { captureDraggingState: true });
  }, [bottomResizePreview]);
  const offset = dragOffset;

  const isDragging =
    isDraggingPos ||
    isDraggingSize ||
    isDraggingRightBorder ||
    isDraggingLeftBorder ||
    isDraggingTopBorder ||
    isDraggingBottomBorder;
  const style: React.CSSProperties = {
    position: "absolute",
    top: position[1],
    left: position[0],
    width: size[0],
    height: size[1],
    zIndex: order, // 配合拖动效果

    display: "flex",
    flexDirection: "column",
    overflow: 'visible',

    border: "1px solid rgba(100, 100, 100, 0.2)",
    background: "rgba(255,255,255,1)",
    transition: isDragging ? undefined : "all 0.2s",
  };

  // TODO preview
  if (isDraggingPos) {
    style.top = position[1] + offset.y;
    style.left = position[0] + offset.x;
  }
  if (isDraggingSize) {
    style.width = Math.max(0, size[0] + offset.x);
    style.height = Math.max(0, size[1] + offset.y);
  }
  if (isDraggingRightBorder) {
    style.width = Math.max(64, size[0] + offset.x);
  }
  if (isDraggingLeftBorder) {
    style.width = Math.max(64, size[0] - offset.x);
    style.left = position[0] + offset.x;
  }
  if (isDraggingTopBorder) {
    style.height = Math.max(64, size[1] - offset.y);
    style.top = position[1] + offset.y;
  }
  if (isDraggingBottomBorder) {
    style.height = Math.max(64, size[1] + offset.y);
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

  const [prevLoc, setPrevLoc] = React.useState<{
    position: [number, number];
    size: [number, number];
  } | null>(null);

  const resizeMax = React.useCallback(() => {
    setPrevLoc({ position, size });
    resize({ size: [container.width, container.height] });
    move({ position: [0, 0] });
  }, [resize, move, position, size, container]);

  const resizeMin = React.useCallback(() => {
    setPrevLoc(null);
    if (prevLoc) {
      resize({ size: prevLoc.size });
      move({ position: prevLoc.position });
    }
  }, [resize, move, prevLoc]);

  return (
    <div
      style={style}
      onMouseDown={focus}
      onDoubleClick={prevLoc ? resizeMin : resizeMax}
    >
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
        <div>{title}</div>
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
        className="appbox-resize-icon"
      />

      <div
        ref={rightResizeDragRef}
        className="appbox-border-lr"
        style={{
          right: 0,
          cursor: "e-resize",
        }}
      />

      <div
        ref={leftResizeDragRef}
        className="appbox-border-lr"
        style={{
          left: 0,
          cursor: "w-resize",
        }}
      />
      <div
        ref={topResizeDragRef}
        className="appbox-border-tb"
        style={{
          top: 0,
          cursor: "n-resize",
        }}
      />
      <div
        ref={bottomResizeDragRef}
        className="appbox-border-tb"
        style={{
          bottom: 0,
          cursor: "s-resize",
        }}
      />
    </div>
  );
};

export default AppBox;
