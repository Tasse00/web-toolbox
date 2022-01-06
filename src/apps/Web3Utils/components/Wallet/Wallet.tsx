import { useAccount, useAccounts, useWeb3Control } from "../../hooks/web3";
import React, { useMemo } from "react";
import {
  Row,
  Col,
  Typography,
  Select,
  List,
  Card,
  Button,
  message,
  Tooltip,
} from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "../../utils/copy";
import { useBalance } from "../../hooks/web3/useBalance";
import BN from "bn.js";

const Wallet: React.FC<{}> = (props) => {
  const accounts = useAccounts();
  const defaultAccount = useAccount();
  const { setAccount } = useWeb3Control();
  const {
    data: balance,
    pending,
    error,
  } = useBalance(defaultAccount, { auto: true });
  const balanceReadable = useMemo(() => {
    if (pending || error || !balance) {
      console.log(error, balance);
      return 0;
    } else {
      const res = BigInt(balance) / BigInt("100000000000000");
      return parseFloat(res.toString()) / 10000;
    }
  }, [balance, error, pending]);
  return (
    <Row
      gutter={[8, 8]}
      style={{ width: "100%" }}
      justify="space-between"
      align="middle"
    >
      <Col>
        <Title>Default Account</Title>
      </Col>
      <Col>
        <Select
          style={{ width: "100%" }}
          options={accounts.map((acc) => ({ value: acc }))}
          value={defaultAccount || ""}
          onSelect={(v) => setAccount(v.toString())}
        />
      </Col>
      <Col span={24}>
        <Row justify="space-between">
          <Col>Balance</Col>
          <Col>{pending || error ? "--" : balanceReadable}</Col>
        </Row>
      </Col>

      <Col>
        <Title>Accounts</Title>
      </Col>
      <Col>
        <Card size="small" bodyStyle={{ padding: 4 }}>
          <List
            size="small"
            dataSource={accounts}
            renderItem={(acc) => (
              <List.Item>
                <Tooltip title={acc}>
                  <Typography.Text ellipsis>{acc}</Typography.Text>
                </Tooltip>
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  type="text"
                  onClick={() => {
                    copyToClipboard(acc);
                    message.success({ content: "Copied" });
                  }}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
};

const Title: React.FC = (props) => (
  <Typography.Title level={5} style={{ marginBottom: 0 }}>
    {props.children}
  </Typography.Title>
);

export default Wallet;
