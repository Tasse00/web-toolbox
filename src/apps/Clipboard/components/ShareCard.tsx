import { CopyOutlined } from "@ant-design/icons";
import { Button, notification, Typography } from "antd";
import React from "react";
import { copyToClipboard } from "../../../common/utils/clipboard";
import { ShareWithPeer } from "../hooks";

const ShareCard: React.FC<{
  share: ShareWithPeer;
  style?: React.CSSProperties;
}> = ({ share, style }) => {
  return (
    <div key={share.timestamp} style={style}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Typography.Text> {share.identity}</Typography.Text>
        </div>
        <div>
          <Button
            icon={<CopyOutlined />}
            onClick={() => {
              copyToClipboard(share.content).then(() =>
                notification.success({
                  message: "copied",
                })
              );
            }}
          />
        </div>
      </div>
      <div
        style={{
          marginTop: 8,
          backgroundColor: "#FFFFFF",
          padding: 16,
          borderRadius: 16,
        }}
      >
        <pre style={{ marginBottom: 0 }}>{share.content}</pre>
      </div>
    </div>
  );
};

export default ShareCard;
