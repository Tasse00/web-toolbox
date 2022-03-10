import { Drawer, List } from "antd";
import React from "react";
import { PeerState } from "../hooks";

const PeersDrawer: React.FC<{
  peers: PeerState[];
  visible: boolean;
  onClose: () => any;
}> = ({ visible, onClose, peers }) => {
  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      maskClosable
      getContainer={false}
      style={{ position: "absolute" }}
    >
      <List
        dataSource={peers}
        renderItem={(peer) => (
          <List.Item>
            <List.Item.Meta
              title={peer.identity}
              description={`${peer.connectionState} | ${peer.dataChannelState}`}
            />
          </List.Item>
        )}
      />
    </Drawer>
  );
};

export default PeersDrawer;
