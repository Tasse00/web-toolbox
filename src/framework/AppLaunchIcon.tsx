import React from "react";
import { AppConfig } from "./Framework";
import "./AppLaunchIcon.scss";

const AppLaunchIcon: React.FC<{
  config: AppConfig;
  onLaunch: () => void;
  style?: React.CSSProperties;
  size?: number;
}> = ({ config, onLaunch, style, size = 64 }) => {
  return (
    <div
      className="app-launch-icon"
      style={{
        width: size,
        height: size,

        ...style,
      }}
      onClick={onLaunch}
    >
      {config.title}
    </div>
  );
};
export default AppLaunchIcon;
