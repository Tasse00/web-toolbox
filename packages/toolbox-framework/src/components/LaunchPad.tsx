import React, {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { AppConfig, FrameworkContextValue } from "./Framework";
import { useHotkeys } from "react-hotkeys-hook";
import { Input } from "antd";
import AppLaunchItem from "./AppLaunchItem";
export const LaunchPad: React.FC<{
  zIndex: number;
  configs: AppConfig<any>[];
  launchApp: FrameworkContextValue["launchApp"];
}> = ({ zIndex, configs, launchApp }) => {
  const [visible, setVisible] = React.useState(false);
  const [appKeywork, setAppKeywork] = React.useState("");
  const [idx, setIdx] = React.useState(0);

  const pointerEvents: React.CSSProperties["pointerEvents"] = visible
    ? undefined
    : "none";

  // useHotkeys("shift+l", () => setVisible((prev) => !prev), [setVisible]);
  useHotkeys("esc", () => setVisible((prev) => !prev), {}, []);

  // const opacity: React.CSSProperties["opacity"] = visible ? 1 : 0;
  const opacity = visible ? 1 : 0;

  const ref = useRef<Input>(null);
  useEffect(() => {
    if (visible && ref.current) {
      ref.current.focus();
    }
  }, [visible]);

  const filteredConfigs = configs.filter(
    (conf) => conf.appId.includes(appKeywork) || conf.title.includes(appKeywork)
  );
  useEffect(() => {
    if (filteredConfigs.length > 0 && idx >= filteredConfigs.length) {
      setIdx(filteredConfigs.length - 1);
    }
  }, [filteredConfigs, idx]);
  // TODO 键盘上、下、回车

  const onLaunch = useCallback(
    (config: AppConfig) => {
      setVisible(false);
      setTimeout(() => {
        launchApp({
          appId: config.appId,
          props: { ...config.defaultProps },
          insId: Math.random().toString(),
        });
        setAppKeywork("");
        setIdx(0);
      }, 100);
    },
    [launchApp]
  );
  return (
    <div
      style={{ ...FullscreenStyle, zIndex, pointerEvents, opacity }}
      onClick={() => setVisible(false)}
    >
      <div style={ContainerStyle}>
        <Input
          ref={ref}
          placeholder="Search App"
          value={appKeywork}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setAppKeywork(e.target.value)
          }
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            switch (e.code) {
              case "ArrowDown":
                setIdx((v) => Math.min(v + 1, filteredConfigs.length - 1));
                break;
              case "ArrowUp":
                setIdx((v) => Math.max(v - 1, 0));
                break;
              case "Escape":
                setVisible((v) => !v);
                break;
            }
          }}
          onPressEnter={() => onLaunch(filteredConfigs[idx])}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: 4,
            overflow: "auto",
          }}
        >
          {filteredConfigs.map((conf, cidx) => (
            <AppLaunchItem
              key={conf.appId}
              config={conf}
              style={{
                border:
                  cidx === idx
                    ? "2px solid rgb(100,100,100, 0.5)"
                    : "2px solid rgb(100,100,100,0)",
              }}
              onLaunch={() => onLaunch(conf)}
            />
          ))}
        </div>
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
  maxWidth: "90%",
  maxHeight: "90%",
  background: "rgba(255,255,255,1)",
  borderRadius: 16,
  boxShadow: "0 0 16px rgba(200,200,200,0.5)",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  rowGap: 8,
};

export default LaunchPad;
