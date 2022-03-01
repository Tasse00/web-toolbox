import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { PeersManagerState } from "../../hooks";

const DownloadsIcon: React.FC<{
  downloads: PeersManagerState["downloads"];
  onClick: () => any;
}> = ({ onClick }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Button icon={<DownloadOutlined />} onClick={onClick} />
      {/* {downloads.length} */}
    </div>
  );
};

export default DownloadsIcon;
