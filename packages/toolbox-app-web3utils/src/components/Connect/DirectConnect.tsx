import { useWeb3Control } from "../../hooks/web3";
import { Storage } from "../../storage";
import { unique } from "../../utils/array";
import {
  AutoComplete,
  Button,
  Col,
  Input,
  message,
  Row,
  List,
  Typography,
} from "antd";
import React from "react";
import Web3 from "web3";
import {
  MinusCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { isValidNodeUrl, isValidPrivateKey } from "../../utils/web3";
const storage = new Storage();

const DirectConnect: React.FC<{}> = (props) => {
  const [url, setUrl] = React.useState("");

  const [privateKeys, setPrivateKeys] = React.useState(() =>
    storage.getPrivateKeys()
  );

  const storedUrls = React.useMemo(() => storage.getUrls(), []);

  const { setup } = useWeb3Control();

  const onConnect = () => {
    const trimUrl = url.trim();

    if (!isValidNodeUrl(trimUrl)) {
      message.warn({ content: "invalid url" });
      return;
    }

    const web3 = new Web3(trimUrl);

    const uniquePks = unique(privateKeys);

    for (let pk of uniquePks) {
      web3.eth.accounts.wallet.add(pk);
    }
    if (uniquePks.length > 0) {
      web3.eth.defaultAccount = web3.eth.accounts.wallet[0].address;
    }
    setup(web3, "web3");

    storage.setUrls(unique([url, ...storedUrls]));
    storage.setPrivateKeys(uniquePks);
  };

  const newPk = () => {
    setPrivateKeys([...privateKeys, ""]);
  };

  const enabled =
    isValidNodeUrl(url) &&
    privateKeys.map(isValidPrivateKey).filter((b) => !b).length === 0;

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={4}>Node URL</Typography.Title>
        <AutoComplete
          placeholder="eg. http://127.0.0.1:7545"
          options={storedUrls
            .filter((u) => u.includes(url.trim()))
            .map((u) => ({ label: u, value: u }))}
          value={url}
          onChange={(e) => setUrl(e)}
          style={{ width: "100%" }}
          onSelect={(e) => setUrl(e.toString())}
        />
      </Col>
      <Col span={24}>
        <Typography.Title level={4}>Private Keys</Typography.Title>
        <List
          dataSource={[...privateKeys, "NEW ONE"]}
          renderItem={(pk, idx) => (
            <List.Item>
              {pk === "NEW ONE" ? (
                <Button block type="dashed" onClick={newPk}>
                  {" "}
                  Add Private Key{" "}
                </Button>
              ) : (
                <Input
                  name={`pk-${idx}`}
                  value={pk}
                  onChange={(e) => {
                    privateKeys[idx] = e.target.value;
                    setPrivateKeys([...privateKeys]);
                  }}
                  prefix={
                    isValidPrivateKey(pk) ? (
                      <CheckCircleOutlined />
                    ) : (
                      <InfoCircleOutlined />
                    )
                  }
                  suffix={
                    <MinusCircleOutlined
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setPrivateKeys([...privateKeys.filter((v) => v !== pk)])
                      }
                    />
                  }
                />
              )}
            </List.Item>
          )}
        />
      </Col>
      {/* TODO Add Account Private Keys */}
      <Col span={24}>
        <Button type="primary" block onClick={onConnect} disabled={!enabled}>
          Connect
        </Button>
      </Col>
    </Row>
  );
};

export default DirectConnect;
