import { SettingOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import Layout from "../../common/components/Layout";
import SettingsDrawer from "./components/SettingsDrawer";
import useWebSocket from "react-use-websocket";
import { useAppConfig } from "../../framework/ConfigProvider";
import { SignalingSendMessage, usePeersManager } from "./hooks";
import WebsocketStatus from "./components/sidebar/WebsocketStatus";
import ShareCard from "./components/ShareCard";
import PeersDrawer from "./components/PeersDrawer";
import PeersStatus from "./components/sidebar/PeersStatus";

// 信令: 推送房间内成员
interface SSEMembers {
  type: "members";
  payload: {
    connId: number;
  }[];
}

// 信令: 存在Peer邀请建立链接
interface SSEOffer {
  type: "offer";
  payload: {
    connId: number;
    offer: string;
  };
}

// 信令: Peer回应建立连接邀请
interface SSEAnswer {
  type: "answer";
  payload: {
    connId: number;
    answer: string;
  };
}

// 信令: Peer交换其IceCandidate
interface SSEIceCandidate {
  type: "iceCandidate";
  payload: {
    connId: number;
    iceCandidate: string;
  };
}

// 信令: peer失去连接
interface SSELost {
  type: "lost";
  payload: {
    connId: number;
  };
}

type SignalingServerEvent =
  | SSEMembers
  | SSEOffer
  | SSEAnswer
  | SSEIceCandidate
  | SSELost;

const Clipboard: React.FC<{}> = () => {
  // 抽屉开关
  const [peersDrawerVis, setPeersDrawerVis] = useState(false);
  const [settingsDrawerVis, setSettingsDrawerVis] = useState(false);

  // 配置
  const { value: signalingServerUrl } = useAppConfig("signalingServerUrl", "");
  const { value: identity } = useAppConfig("identity", "");

  // Signaling Server 连接
  const { readyState, sendJsonMessage, lastJsonMessage } = useWebSocket(
    signalingServerUrl,
    {}
  );

  const sendToSignalingServer = useCallback(
    (act: SignalingSendMessage) => {
      switch (act.type) {
        case "offer":
          sendJsonMessage({
            type: "offer",
            payload: {
              connId: act.payload.peerConnId,
              offer: act.payload.offer,
            },
          } as SSEOffer);
          break;
        case "answer":
          sendJsonMessage({
            type: "answer",
            payload: {
              connId: act.payload.peerConnId,
              answer: act.payload.answer,
            },
          } as SSEAnswer);
          break;
        case "iceCandidate":
          sendJsonMessage({
            type: "iceCandidate",
            payload: {
              connId: act.payload.peerConnId,
              iceCandidate: act.payload.iceCandidate,
            },
          } as SSEIceCandidate);
      }
    },
    [sendJsonMessage]
  );

  // peers 管理
  const {
    processAnswer,
    processIceCandidate,
    processOffer,
    createPeer,
    removePeer,
    share,

    shares,
    peers,
  } = usePeersManager({
    sendToSignalingServer: sendToSignalingServer,
    identity: identity,
  });

  // 处理 Signaling Server 的事件
  useEffect(() => {
    if (!lastJsonMessage) return;
    const sse: SignalingServerEvent = lastJsonMessage;
    switch (sse.type) {
      case "members":
        for (let m of sse.payload) {
          createPeer(m.connId);
        }
        break;
      case "offer":
        processOffer(sse.payload.connId, sse.payload.offer);
        break;

      case "answer":
        processAnswer(sse.payload.connId, sse.payload.answer);
        break;
      case "iceCandidate":
        processIceCandidate(sse.payload.connId, sse.payload.iceCandidate);
        break;
      case "lost":
        removePeer(sse.payload.connId);
        break;
    }
  }, [
    lastJsonMessage,
    processAnswer,
    processIceCandidate,
    processOffer,
    createPeer,
    removePeer,
  ]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Layout
        style={{ width: "100%", height: "100%", backgroundColor: "#F0F0F0" }}
        sidePosition="right"
        side={
          <Card
            size="small"
            style={{ height: "100%" }}
            bodyStyle={{ height: "100%" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Button
                type="text"
                size="large"
                icon={<SettingOutlined />}
                onClick={() => setSettingsDrawerVis(true)}
              />

              <div style={{ width: "100%" }}>
                <PeersStatus
                  peers={peers}
                  onClick={() => setPeersDrawerVis(true)}
                />

                <WebsocketStatus status={readyState} />
              </div>
            </div>
          </Card>
        }
      >
        <div
          style={{ minHeight: "100%" }}
          onPaste={(e) => {
            const content = e.clipboardData.getData("text/plain");
            share({
              type: "text",
              content,
            });
          }}
        >
          {shares.map((s) => (
            <ShareCard
              key={s.timestamp}
              share={s}
              style={{ margin: "16px 32px" }}
            />
          ))}
        </div>
      </Layout>

      <SettingsDrawer
        visible={settingsDrawerVis || !identity || !signalingServerUrl}
        onClose={() => setSettingsDrawerVis(false)}
      />

      <PeersDrawer
        peers={peers}
        visible={peersDrawerVis}
        onClose={() => setPeersDrawerVis(false)}
      />
    </div>
  );
};

export default Clipboard;
