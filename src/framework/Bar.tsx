import { Button, Card, List, Dropdown } from "antd";
import React from "react";
import { FrameworkContext } from "./Framework";
import Layout from "../common/components/Layout";
import { CloseOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";

const Bar: React.FC<{}> = (props) => {
  const { apps, terminateApp, setAppOpen, focusApp } =
    React.useContext(FrameworkContext);

  const maxVisibleOrder = Math.max(
    ...apps.filter((app) => app.open).map((app) => app.order)
  );

  // TODO 左右布局
  return (
    <Layout
      style={{ height: 40, userSelect: "none" }}
      sidePosition="right"
      contentStyle={{
        display: "flex",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      {apps.map((app) => (
        <div
          style={{
            height: 32,
            border: "1px solid rgb(200,200,200)",
            marginLeft: 4,
            display: "flex",
            alignItems: "center",
            paddingLeft: 8,
            background: "rgba(255,255,255,1)",
            cursor: "pointer",
          }}
          onClick={() => {
            console.log(app.open, app.order, maxVisibleOrder);
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
