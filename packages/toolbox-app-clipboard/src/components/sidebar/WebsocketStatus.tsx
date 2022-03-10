import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  QuestionOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import React from "react";
import { ReadyState } from "react-use-websocket";

const WebsocketStatus: React.FC<{
  status: ReadyState;
  style?: React.CSSProperties;
}> = ({ status, style }) => {
  const map = {
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  };
  const iconMap = {
    [ReadyState.CLOSED]: <CloseOutlined />,
    [ReadyState.CLOSING]: <CloseOutlined />,
    [ReadyState.CONNECTING]: <LoadingOutlined />,
    [ReadyState.OPEN]: <CheckOutlined />,
    [ReadyState.UNINSTANTIATED]: <QuestionOutlined />,
  };
  return (
    <Tooltip title={`SignalingServer: ${map[status]}`}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          ...style,
        }}
      >
        <WifiOutlined />
        {iconMap[status]}
      </div>
    </Tooltip>
  );
};

export default WebsocketStatus;
