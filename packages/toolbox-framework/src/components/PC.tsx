import React, { useContext, useEffect } from "react";
import { Layout } from "toolbox-components";
import Bar from "./Bar";
import AppContainer from "./AppContainer";
import LaunchPad from "./LaunchPad";
import { FrameworkContext } from "..";

const PanelStyle: React.CSSProperties = {
  border: "1px solid rgba(100, 100, 100, 0.5)",
  background: "rgba(200, 200, 200, 0.2)",
};

interface Props {}

const PC: React.FC<Props> = (props) => {
  const { setFrameworkSize, configs, launchApp, apps } =
    useContext(FrameworkContext);

  const ref = React.useRef<HTMLDivElement>(null);

  const launchPadIndex = Math.max(0, ...apps.map((app) => app.order)) + 1;

  useEffect(() => {
    const func = () => {
      if (ref.current) {
        setFrameworkSize([ref.current.clientWidth, ref.current.clientHeight]);
      }
    };
    window.addEventListener("resize", func);
    return () => window.removeEventListener("resize", func);
  }, [setFrameworkSize]);

  useEffect(() => {
    if (ref.current) {
      setFrameworkSize([ref.current.clientWidth, ref.current.clientHeight]);
    }
  }, []);

  return (
    <>
      <Layout
        bar={<Bar />}
        barPosition="bottom"
        barStyle={PanelStyle}
        style={{ height: "100vh", width: "100vw" }}
      >
        <div
          ref={ref}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <AppContainer />
          <LaunchPad
            zIndex={launchPadIndex}
            configs={configs}
            launchApp={launchApp}
          />
          {/* {children} */}
        </div>
      </Layout>
    </>
  );
};

export default PC;
