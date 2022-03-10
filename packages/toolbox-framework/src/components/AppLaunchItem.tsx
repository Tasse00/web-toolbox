import React from "react";
import { AppConfig } from "./Framework";

interface Props {
  config: AppConfig;
  onLaunch: () => void;
  style?: React.CSSProperties;
}

export const AppLaunchItem: React.FC<Props> = ({ style, onLaunch, config }) => {
  const size = 64;
  return (
    <div
      style={{
        padding: 8,
        borderRadius: 8,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        columnGap: 16,
        background: "rgba(220,220,220,0.2)",
        ...style,
      }}
      onClick={onLaunch}
    >
      <div
        style={{
          width: size,
          height: size,
          background: "rgba(200, 200, 200, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>{config.title[0]}</div>
      </div>
      <div style={{ flex: 1 }}>
        <div>{config.title}</div>
        <div style={{ fontSize: 14, color: "rgb(200,200,200)" }}>
          {config.appId}
        </div>
      </div>
    </div>
  );
};

export default AppLaunchItem;
