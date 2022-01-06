import { Button } from "antd";
import React, { useEffect } from "react";
import { AppRuntime, FrameworkContext } from "./Framework";
import Layout from "../common/components/Layout";
import { CloseOutlined } from "@ant-design/icons";
import "./Bar.scss";

function formatId(runtime: AppRuntime<any>): string {
  return `ins-bar.${runtime.insId}`;
}

const Bar: React.FC<{}> = (props) => {
  const { apps, terminateApp, setAppOpen, focusApp } =
    React.useContext(FrameworkContext);

  const maxVisibleOrder = Math.max(
    ...apps.filter((app) => app.open).map((app) => app.order)
  );

  useEffect(() => {
    const app = apps.find((app) => app.order === maxVisibleOrder);
    if (app) {
      const id = formatId(app);
      const elem = document.getElementById(id);
      if (elem) {
        //// will make appbox drag, resize wrong
        // TODO Why??
        // elem.scrollIntoView({ inline: "nearest", behavior: "smooth" });
        setTimeout(
          () => elem.scrollIntoView({ inline: "nearest", behavior: "smooth" }),
          0
        );
      }
    }
  }, [maxVisibleOrder, apps]);

  return (
    <Layout
      style={{ height: 40, userSelect: "none" }}
      sidePosition="right"
      contentClassName="framework-bar"
      contentStyle={{
        display: "flex",
        alignItems: "center",
        height: "100%",
        width: "100%",
        paddingRight: 4,
      }}
    >
      {apps.map((app) => (
        <div
          key={app.insId}
          id={formatId(app)}
          style={{
            height: 32,
            border: "1px solid rgb(200,200,200)",
            marginLeft: 4,
            display: "flex",
            alignItems: "center",
            paddingLeft: 8,
            // background: "rgba(255,255,255,1)",
            background:
              maxVisibleOrder === app.order
                ? "rgba(200,200,200,0.4)"
                : "rgba(255,255,255,0.2)",
            cursor: "pointer",
          }}
          onClick={() => {
            if (!app.open || maxVisibleOrder !== app.order) {
              setAppOpen({ insId: app.insId, open: true });
              setTimeout(() => {
                focusApp({ insId: app.insId });
              }, 0);
            } else {
              setAppOpen({ insId: app.insId, open: false });
            }
          }}
        >
          <div>{app.title || app.config.title}</div>
          <div>
            <Button
              icon={<CloseOutlined size={12} />}
              size="small"
              type="text"
              onClick={() => terminateApp({ insId: app.insId })}
            />
          </div>
        </div>
      ))}
    </Layout>
  );
};

export default Bar;
