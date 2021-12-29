import React from "react";
import { FrameworkContext } from "./Framework";

const Bar: React.FC<{}> = (props) => {
  const { configs, launchApp } = React.useContext(FrameworkContext);
  const cols = React.useMemo(
    () =>
      configs.map((conf) => (
        <div key={conf.appId}>
          <div
            style={{
              width: 48,
              height: 48,
              background: "rgba(100, 100, 100, 0.4)",
            }}
            onClick={() =>
              launchApp({
                appId: conf.appId,
                props: {},
                insId: Math.random().toString(),
              })
            }
          >
            {conf.title}
          </div>
        </div>
      )),
    [configs, launchApp]
  );
  return (
    <div style={{ overflow: "auto", display: "flex", flexWrap: "nowrap" }}>
      {cols}
    </div>
  );
};

export default Bar;
