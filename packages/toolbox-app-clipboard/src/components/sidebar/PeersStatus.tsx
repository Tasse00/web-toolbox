import { ClusterOutlined } from "@ant-design/icons";
import React from "react";
import { PeerState } from "../../hooks";

const PeersStatus: React.FC<{
  peers: PeerState[];
  onClick?: () => any;
  style?: React.CSSProperties;
}> = ({ peers, onClick, style }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        ...style,
      }}
      onClick={onClick}
    >
      <ClusterOutlined />
      <div>
        {
          peers.filter(
            (p) =>
              p.connectionState === "connected" && p.dataChannelState === "open"
          ).length
        }
        /{peers.length}
      </div>
    </div>
  );
};

export default PeersStatus;
