import { SaveOutlined } from "@ant-design/icons";
import { Button, Drawer, List, Progress, Typography } from "antd";
import React from "react";
import { DownloadTask, DownloadTaskStatus } from "../transmission";

const DownloadsDrawer: React.FC<{
  downloads: DownloadTask[];

  visible: boolean;
  onClose: () => any;
}> = ({ downloads, visible, onClose }) => {
  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      closable={false}
      maskClosable
      getContainer={false}
      style={{ position: "absolute" }}
    >
      <List
        dataSource={downloads}
        renderItem={(d) => (
          <List.Item>
            <List.Item.Meta
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography.Text
                    type={
                      d.status === DownloadTaskStatus.Downloaded
                        ? "secondary"
                        : undefined
                    }
                  >
                    {d.filename}
                  </Typography.Text>
                  {d.status === DownloadTaskStatus.Downloadable && (
                    <Button
                      size="small"
                      type="text"
                      icon={<SaveOutlined />}
                      onClick={() => {
                        d.store();
                      }}
                    />
                  )}
                </div>
              }
              description={<Progress percent={Math.floor(d.percent)} />}
            />
          </List.Item>
        )}
      />
    </Drawer>
  );
};

export default DownloadsDrawer;
