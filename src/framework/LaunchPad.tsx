import React from "react";
import { AppConfig, FrameworkContextValue } from "./Framework";
import { useHotkeys } from "react-hotkeys-hook";
import AppLaunchIcon from "./AppLaunchIcon";
const LaunchPad: React.FC<{
  zIndex: number;
  configs: AppConfig<any>[];
  launchApp: FrameworkContextValue["launchApp"];
}> = ({ zIndex, configs, launchApp }) => {
  const [visible, setVisible] = React.useState(false);

  const pointerEvents: React.CSSProperties["pointerEvents"] = visible
    ? undefined
    : "none";

  // useHotkeys("shift+l", () => setVisible((prev) => !prev), [setVisible]);
  useHotkeys("esc", () => setVisible((prev) => !prev), {}, []);
  const opacity: React.CSSProperties["opacity"] = visible ? 1 : 0;

  return (
    <div
      style={{ ...FullscreenStyle, zIndex, pointerEvents, opacity }}
      onClick={() => setVisible(false)}
    >
      <div style={ContainerStyle}>
        {configs.map((conf) => (
          <AppLaunchIcon
            key={conf.appId}
            config={conf}
            size={96}
            onLaunch={() => {
              setVisible(false);
              setTimeout(
                () =>
                  launchApp({
                    appId: conf.appId,
                    props: { ...conf.defaultProps },
                    insId: Math.random().toString(),
                  }),
                100
              );
            }}
            style={{
              margin: 8,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const FullscreenStyle: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  background: "rgba(200,200,200,0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.2s",
};

const ContainerStyle: React.CSSProperties = {
  position: "absolute",
  width: "80%",
  height: "80%",
  background: "rgba(255,255,255,1)",
  borderRadius: 16,
  boxShadow: "0 0 16px rgba(200,200,200,0.5)",
  padding: 8,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default LaunchPad;
