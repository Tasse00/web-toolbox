import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Image, List, Typography } from "antd";
import React from "react";
import { Layout } from "toolbox-components";
import { NovelDetails } from "../providers/ServiceProvider";
import { SyncStatus } from "./SyncStatus";

interface Props {
  info: NovelDetails;
  onChapter: (id: number) => any;
}

export const MenuViewer: React.FC<Props> = ({ info, onChapter }) => {
  const { img, title, author, chapters, source } = info;
  return (
    <Layout style={{ height: "100%" }}>
      <div
        style={{
          display: "flex",
          margin: 8,
          padding: 8,
          backgroundColor: "rgba(220,220,220,0.2)",
          borderRadius: 16,
          alignItems: "center",
        }}
      >
        <Image width={90} height={120} src={img} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            // justifyContent: "space-between",
            // padding: 32,
            paddingLeft: 32,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography.Text>{title}</Typography.Text>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography.Text type="secondary">{author}</Typography.Text>
            </div>
          </div>
          <div>From {source}</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <SyncStatus novel={info} />
            <Button size="small">View Source</Button>
          </div>
        </div>
      </div>
      <div>
        <List
          size="small"
          dataSource={chapters}
          renderItem={(meta) => (
            <List.Item
              key={meta.url}
              onClick={() => {
                if (meta.id && meta.synced) {
                  onChapter(meta.id);
                }
              }}
            >
              <List.Item.Meta
                title={
                  <Typography.Text type={meta.synced ? undefined : "secondary"}>
                    {meta.title}
                  </Typography.Text>
                }
                description={meta.synced ? undefined : "Not Synced"}
              />
            </List.Item>
          )}
        />
      </div>
    </Layout>
  );
};
