import { FileOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Layout from "../../common/components/Layout";
import SettingsDrawer from "./components/SettingsDrawer";
import useWebSocket from "react-use-websocket";
import { useAppConfig } from "../../framework/ConfigProvider";
import { SignalingSendMessage, usePeersManager } from "./hooks";
import WebsocketStatus from "./components/sidebar/WebsocketStatus";
import ShareCard from "./components/ShareCard";
import PeersDrawer from "./components/PeersDrawer";
import PeersStatus from "./components/sidebar/PeersStatus";
import DownloadsIcon from "./components/topbar/DownloadsIcon";
import DownloadsDrawer from "./components/DownloadsDrawer";

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

  // Modal开关
  const [downloadsDrawerVis, setDownloadsDrawerVis] = useState(false);

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
    downloads,

    provideFiles,
    fetchFile,
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

  const iptFileRef = useRef<HTMLInputElement>(null);

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
        <Layout
          bar={
            <Card size="small">
              <Row justify="space-between">
                <Col>
                  <Button
                    size="large"
                    type="text"
                    icon={<FileOutlined />}
                    onClick={() => {
                      iptFileRef.current?.click();
                    }}
                  >
                    <input
                      ref={iptFileRef}
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        // 1. 存储至PM文件提供器
                        const files = [];
                        if (e.target.files) {
                          for (let i = 0; i < e.target.files.length; i++) {
                            files.push(e.target.files[i]);
                          }
                        }
                        const providedFiles = provideFiles(files);

                        // 2. 使用PM广播文件消息`
                        for (const file of providedFiles) {
                          share({
                            type: "file",
                            name: file.name,
                            id: file.id,
                            size: file.file.size,
                          });
                        }
                      }}
                    />
                  </Button>
                </Col>
                <Col>
                  <DownloadsIcon
                    downloads={downloads}
                    onClick={() => setDownloadsDrawerVis(true)}
                  />
                </Col>
              </Row>
            </Card>
          }
        >
          <div
            style={{ height: "100%", overflow: "auto" }}
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
                onDownload={(share) => {
                  fetchFile(share);
                  setDownloadsDrawerVis(true);
                }}
              />
            ))}
          </div>
        </Layout>
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

      <DownloadsDrawer
        downloads={downloads}
        visible={downloadsDrawerVis}
        onClose={() => setDownloadsDrawerVis(false)}
      />
    </div>
  );
};

export default Clipboard;
