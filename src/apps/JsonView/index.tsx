import { Card } from "antd";
import React, { useEffect } from "react";
import Layout from "../../common/components/Layout";
// import { Logger } from "../../common/utils/logger";
import Editor from "./components/Editor";
import ModeButton, { Mode } from "./components/ModeButton";
import Viewer from "./components/Viewer";
import { AppConfig } from "../../framework/Framework";

// const logger = new Logger({ name: "JsonView" });

export const JsonViewApp: React.FC<{}> = () => {
  const [mode, setMode] = React.useState<Mode>(Mode.Edit);
  const [value, setValue] = React.useState("");

  return (
    <Layout
      bar={
        <Card size="small">
          <ModeButton value={mode} onChange={setMode} />
        </Card>
      }
    >
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {mode === Mode.Edit && (
          <Editor
            value={value}
            onChange={setValue}
            style={{ height: "100%" }}
          />
        )}
        {mode === Mode.View && (
          <Viewer value={value} style={{ height: "100%", overflow: "auto" }} />
        )}
      </div>
    </Layout>
  );
};

export const JsonViewAppConfig: AppConfig = {
  appId: "json-viewer",
  title: "JsonViewer",
  component: JsonViewApp,
  defaultProps: {},
  suggestSize: [800, 600],
};
