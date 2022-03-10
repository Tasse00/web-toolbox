import { CopyOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, notification, Typography } from "antd";
import React from "react";
import { copyToClipboard } from "toolbox-utils";
import { useAppConfig } from "toolbox-framework";
import { PeersManagerState, ShareWithPeer } from "../hooks";

const ShareCard: React.FC<{
  share: ShareWithPeer;
  style?: React.CSSProperties;
  onDownload: PeersManagerState["fetchFile"];
}> = ({ share, style, onDownload }) => {
  const { value: identity } = useAppConfig("identity", "");
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
        {share.type === "text" ? (
          <div>
            <Button
              icon={<CopyOutlined />}
              type="text"
              onClick={() => {
                copyToClipboard(share.content).then(() =>
                  notification.success({
                    message: "copied",
                  })
                );
              }}
            />
          </div>
        ) : (
          <div>
            {share.identity !== identity && (
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={() => {
                  console.log("download", share);
                  onDownload(share);
                }}
              />
            )}
          </div>
        )}
      </div>
      <div
        style={{
          marginTop: 8,
          backgroundColor: "#FFFFFF",
          padding: 16,
          borderRadius: 16,
        }}
      >
        {share.type === "text" ? (
          <pre style={{ marginBottom: 0 }}>{share.content}</pre>
        ) : (
          <div>
            File: {share.id} | {share.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareCard;
