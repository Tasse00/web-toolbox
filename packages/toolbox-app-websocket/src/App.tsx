import { Button, Input, notification } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Layout, WebsocketStatus } from "toolbox-components";
import useWebsocket from "react-use-websocket";
import { isValidWsUrl } from "toolbox-utils";
import Message from "./components/Message";
const App: React.FC<{}> = (props) => {
  const [iptVal, setIptVal] = useState("");
  const [iptSend, setIptSend] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [url, setUrl] = useState("");
  const { readyState, lastJsonMessage, sendJsonMessage } = useWebsocket(
    url,
    {},
    isValidWsUrl(url)
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setMessages((msgs) => [...msgs, lastJsonMessage]);
    }
  }, [lastJsonMessage]);

  const sendJson = useCallback(
    (json) => {
      sendJsonMessage(json);
      setMessages((msgs) => [...msgs, json]);
    },
    [sendJsonMessage]
  );
  useEffect(() => {
    if (ref.current) {
      console.log("scroll");
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <Layout
      bar={
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{}}>
            <WebsocketStatus status={readyState} />
          </div>
          <div style={{ flex: 1 }}>
            <Input.Search
              enterButton="Connect"
              value={iptVal}
              onChange={(e) => setIptVal(e.target.value)}
              onSearch={(val) => {
                setUrl(val);
                console.log(val, isValidWsUrl(val));
              }}
            />
          </div>
        </div>
      }
    >
      <Layout
        style={{ height: "100%" }}
        barPosition="bottom"
        bar={
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>Your Inputs</div>
              <Button
                style={{ height: "100%" }}
                onClick={() => {
                  try {
                    const v = JSON.parse(iptSend);
                    sendJson(v);
                  } catch (err) {
                    notification.warn({ message: "invalid json value" });
                  }
                }}
              >
                Send
              </Button>
            </div>
            <div>
              <Input.TextArea
                value={iptSend}
                onChange={(e) => setIptSend(e.target.value)}
              />
            </div>
          </div>
        }
      >
        {/* TODO View */}
        <div style={{ overflow: "auto", maxHeight: "100%" }} ref={ref}>
          {messages.map((msg, idx) => (
            <Message key={idx} msg={msg} />
          ))}
        </div>
      </Layout>
    </Layout>
  );
  // return <Layout> App </Layout>;
};

export default App;
