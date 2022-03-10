import { EllipsisOutlined, MinusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useAsyncTaskQueueContextState } from "../contexts/AsyncQueueQueueContext";
import {
  useViewerContextState,
  ViewerContext,
} from "../contexts/ViewerContext";

const INDENT = 16;

const STYLE_KEY: React.CSSProperties = {
  color: "#215FBF",
};
const STYLE_NUMBER: React.CSSProperties = {
  color: "#72B8A8",
};
const STYLE_BOOL: React.CSSProperties = {
  color: "#3888D0",
};
const STYLE_NULL: React.CSSProperties = {
  color: "#3888D0",
};
const STYLE_STRING: React.CSSProperties = {
  color: "#C8707F",
};

const CollapseIcon: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <Button
      icon={<MinusOutlined />}
      type="text"
      size="small"
      onClick={onClick}
    />
  );
};

const ExpandIcon: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <Button
    icon={<EllipsisOutlined />}
    type="text"
    size="small"
    onClick={onClick}
  />
);

type Render<T> = React.FC<{ v: T; depth: number }>;

const RBool: Render<boolean> = ({ v }) => {
  return <span style={STYLE_BOOL}>{`${v}`}</span>;
};
const RString: Render<string> = ({ v }) => {
  return <span style={STYLE_STRING}>"{v}</span>;
};
const RNumber: Render<number> = ({ v }) => {
  return <span style={STYLE_NUMBER}>{`${v}`}</span>;
};
const RNull: Render<null> = ({ v }) => {
  return <span style={STYLE_NULL}>{`${v}`}</span>;
};

const AsyncRender: React.FC = ({ children }) => {
  const [show, setShow] = useState(false);
  const { executor } = useAsyncTaskQueueContextState();
  useEffect(() => {
    const func = () => {
      setShow(true);
      // console.timeLog("Async Render");
    };
    executor.append(func);
    return () => executor.remove(func);
  }, [executor]);

  return show ? <>{children}</> : <>loading...</>;
};

const RArray: Render<any[]> = ({ v, depth }) => {
  const [collapsed, setCollpased] = useState(true);

  const { collapseDepth, expandDepth } = useContext(ViewerContext);
  useEffect(() => {
    if (collapseDepth <= depth) {
      setCollpased(true);
    } else if (depth < expandDepth) {
      setCollpased(false);
    }
  }, [collapseDepth, expandDepth, depth]);

  if (collapsed) {
    return (
      <span>
        [<ExpandIcon onClick={() => setCollpased((v) => !v)} />]
      </span>
    );
  } else {
    return (
      <>
        <span>
          [{v.length > 0 && <CollapseIcon onClick={() => setCollpased(true)} />}
        </span>
        {v.map((i, idx, arr) => (
          <div key={idx} style={{ paddingLeft: INDENT }}>
            <RAny v={i} depth={depth + 1} />
            {idx + 1 < arr.length && <span>,</span>}
          </div>
        ))}
        <span>]</span>
      </>
    );
  }
};

const RObject: Render<object> = ({ v, depth }) => {
  const [collapsed, setCollpased] = useState(true);

  const { collapseDepth, expandDepth } = useContext(ViewerContext);
  useEffect(() => {
    if (collapseDepth <= depth) {
      setCollpased(true);
    } else if (depth < expandDepth) {
      setCollpased(false);
    }
  }, [collapseDepth, expandDepth, depth]);

  if (collapsed) {
    return (
      <span>
        {"{"}
        <ExpandIcon onClick={() => setCollpased(false)} />
        {"}"}
      </span>
    );
  } else {
    return (
      <>
        <span>
          {"{"}
          {Object.keys(v).length > 0 && (
            <CollapseIcon onClick={() => setCollpased(true)} />
          )}
        </span>
        {Object.entries(v).map(([k, v], idx, arr) => (
          <div key={idx} style={{ paddingLeft: INDENT }}>
            <span style={{ ...STYLE_KEY, marginRight: 4 }}>"{k}"</span>
            <span style={{ marginLeft: 4, marginRight: 4 }}>:</span>
            <RAny v={v} depth={depth + 1} />

            {idx + 1 < arr.length && <span>,</span>}
          </div>
        ))}
        <span>{"}"}</span>
      </>
    );
  }
};

export const RAny: Render<any> = ({ v, depth }) => {
  const { asyncRender } = useViewerContextState();

  switch (typeof v) {
    case "string":
      return <RString v={v} depth={depth} />;
    case "boolean":
      return <RBool v={v} depth={depth} />;
    case "number":
      return <RNumber v={v} depth={depth} />;
    case "object":
      // TODO 优化，异步渲染
      // 思路: 先返回空组件，待内部组件就绪后返回实际组件
      if (v instanceof Array) {
        return asyncRender ? (
          <AsyncRender>
            <RArray v={v} depth={depth} />
          </AsyncRender>
        ) : (
          <RArray v={v} depth={depth} />
        );
      } else if (v instanceof Object) {
        return asyncRender ? (
          <AsyncRender>
            <RObject v={v} depth={depth} />
          </AsyncRender>
        ) : (
          <RObject v={v} depth={depth} />
        );
      } else if (v === null) {
        return <RNull v={v} depth={depth} />;
      } else {
        break;
      }
    default:
      break;
  }
  return <span>Invalid Json Data</span>;
};

export default RAny;
