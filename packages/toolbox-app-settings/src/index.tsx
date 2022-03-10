import { Card, Col, Divider, Empty, Row, Typography } from "antd";
import React, { useContext, useEffect } from "react";
import {
  usePersistent,
  AppContext,
  ConfigContext,
  AppConfig,
} from "toolbox-framework";

import AppSettingsEditor from "./AppSettingsEditor";

// 切换配置源
// 查看所有App下的设置

const SettingsApp: React.FC<{}> = (props) => {
  const { configSource } = useContext(ConfigContext);
  const {
    control: { resize, move },
    container: { width, height },
  } = useContext(AppContext);
  useEffect(() => {
    resize({ size: [width * 0.5, height * 0.5] });
    move({ position: [width * 0.25, height * 0.25] });
  }, [resize, move, width, height]);

  const { value: config = {} } = usePersistent<Record<string, any>>("");

  return (
    <Card style={{ height: "100%", overflow: "auto" }} size="small">
      <Row gutter={16}>
        <Col>
          <Typography.Text strong>Config From:</Typography.Text>
        </Col>
        <Col>
          <Typography.Text>{configSource.title}</Typography.Text>
        </Col>
      </Row>
      <Divider style={{ marginTop: 16, marginBottom: 16 }} />
      {Object.keys(config).length > 0 ? (
        Object.keys(config).map((app, idx, arr) => {
          return (
            <div key={app}>
              <AppSettingsEditor appId={app} />
              {idx + 1 !== arr.length && (
                <Divider style={{ marginTop: 16, marginBottom: 16 }} />
              )}
            </div>
          );
        })
      ) : (
        <Empty description="No Settings" />
      )}
    </Card>
  );
};

export const SettingsAppConfig: AppConfig = {
  appId: "settings",
  title: "Settings",
  component: SettingsApp,
  defaultProps: {},
};
