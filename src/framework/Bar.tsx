import { Button, Card, List, Dropdown, Tooltip } from "antd";
import React from "react";
import { AppConfig, FrameworkContext } from "./Framework";
import Layout from "../common/components/Layout";
import {
  CloseOutlined,
  MenuOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const Bar: React.FC<{}> = (props) => {
  const { configs, launchApp, apps } = React.useContext(FrameworkContext);
  const cols = React.useMemo(
    () =>
      configs.map((conf) => (
        <div key={conf.appId} style={{ marginRight: 8 }}>
          <AppLaunchIcon
            onLaunch={() =>
              launchApp({
                appId: conf.appId,
                props: { ...conf.defaultProps },
                insId: Math.random().toString(),
              })
            }
            config={conf}
          />
        </div>
      )),
    [configs, launchApp]
  );

  // TODO 左右布局
  return (
    <Layout
      style={{ height: 64 }}
      sidePosition="right"
      side={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Dropdown overlay={<InstanceList />} placement="topRight">
            <Button icon={<MenuOutlined />} type="text" size="large">
              {apps.length}
            </Button>
          </Dropdown>
        </div>
      }
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          width: "100%",
          padding: "0 8px",
        }}
      >
        {cols}
      </div>
    </Layout>
  );
};

const AppLaunchIcon: React.FC<{ config: AppConfig; onLaunch: () => void }> = ({
  config,
  onLaunch,
}) => {
  const size = "48px";

  return (
    <Tooltip title={config.title}>
      <div
        style={{
          width: size,
          height: size,
          lineHeight: size,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",

          borderRadius: 8,
          backgroundColor: "rgba(200, 200, 200, 0.5)",
          cursor: "pointer",
        }}
        onClick={onLaunch}
      >
        {config.title}
      </div>
    </Tooltip>
  );
};

const InstanceList: React.FC = (props) => {
  const { apps, setAppOpen, terminateApp, focusApp } =
    React.useContext(FrameworkContext);

  return (
    <Card size="small">
      <List
        style={{ width: 200 }}
        rowKey={(app) => (app ? app.insId : "clear")}
        dataSource={apps.length > 0 ? [...apps, null] : []}
        renderItem={(app) =>
          app ? (
            <List.Item
              onClick={() => {
                if (!app.open) {
                  setAppOpen({ insId: app.insId, open: true });
                }
                focusApp({ insId: app.insId });
              }}
              extra={
                <>
                  {app.open ? (
                    <Button
                      type="text"
                      icon={<MinusOutlined />}
                      size="small"
                      onClick={() =>
                        setAppOpen({ insId: app.insId, open: false })
                      }
                    />
                  ) : (
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() =>
                        setAppOpen({ insId: app.insId, open: true })
                      }
                    />
                  )}
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    size="small"
                    onClick={() => terminateApp({ insId: app.insId })}
                  />
                </>
              }
            >
              <List.Item.Meta
                title={app.config.title}
                description={app.insId}
              />
            </List.Item>
          ) : (
            <List.Item>
              <Button
                size="small"
                block
                type="text"
                onClick={() => {
                  for (let app of apps) {
                    terminateApp({ insId: app.insId });
                  }
                }}
              >
                Clear All
              </Button>
            </List.Item>
          )
        }
      />
    </Card>
  );
};
export default Bar;
