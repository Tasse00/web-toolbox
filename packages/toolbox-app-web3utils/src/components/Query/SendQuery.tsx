import { CloseOutlined, DownOutlined } from "@ant-design/icons";
import {
  Space,
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Typography,
  Alert,
} from "antd";
import React from "react";
import { QueryProps } from "./Query";
import useContractSend from "../../hooks/web3/useContractSend";
import { SendResult } from "../../hooks/web3";

const SendQuery: React.FC<QueryProps> = ({
  abi,
  id,
  style,
  contractAddress,
  onRemove,
}) => {
  const inputs = React.useMemo(() => abi.inputs || [], [abi]);

  const initialValue = React.useMemo(() => {
    const initialValue: Record<string, string> = {};
    inputs.forEach((ipt) => {
      initialValue[ipt.name] = "";
    });
    return initialValue;
  }, [inputs]);

  const { getField, setField } = useDynamicFields(initialValue);

  const callArgs = React.useMemo(() => {
    const callArgs: any[] = [];
    inputs.forEach((ipt) => {
      callArgs.push(getField(ipt.name));
    });
    return callArgs;
  }, [inputs, getField]);

  const {
    run,
    data,
    error,
    pending: loading,
  } = useContractSend(
    {
      address: contractAddress,
      abi,
      options: callArgs,
    },
    { auto: false }
  );

  return (
    <Card
      size="small"
      title={
        <Space direction="horizontal">
          {abi.name}
          <Typography.Text type="secondary">{id}</Typography.Text>{" "}
        </Space>
      }
      style={style}
      extra={
        <Button
          icon={<CloseOutlined />}
          type="text"
          size="small"
          onClick={onRemove}
        />
      }
    >
      {inputs && inputs.length > 0 && (
        <Row gutter={[16, 16]} align="middle">
          <Col style={{ minWidth: 80 }}>
            <Typography.Text>Inputs:</Typography.Text>
          </Col>
          <Col flex={1}>
            <Row gutter={[16, 16]}>
              {inputs.map((ipt) => (
                <Col key={ipt.name}>
                  <Card size="small" bordered>
                    <Row align="middle" gutter={8}>
                      <Col>
                        <Typography.Text>{ipt.name}</Typography.Text>
                      </Col>
                      <Col flex={1}>
                        <Input
                          style={{ width: "100%" }}
                          placeholder={ipt.type}
                          value={getField(ipt.name)}
                          onChange={(e) => setField(ipt.name, e.target.value)}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      )}

      <Divider>
        <Button
          shape="circle"
          icon={<DownOutlined />}
          onClick={run}
          loading={loading}
        />
      </Divider>

      {error && <Alert type="error" message={error.message} />}

      {data && <SendResultView result={data} />}
    </Card>
  );
};

const SendResultView: React.FC<{ result: SendResult }> = ({ result }) => (
  <div>
    {[
      { label: "BlockNumber", value: result.blockNumber },
      { label: "BlockHash", value: result.blockHash },
      { label: "TxHash", value: result.transactionHash },
      { label: "TxIdx", value: result.transactionIndex },
      { label: "GasUsed", value: result.gasUsed },
      { label: "Events", value: Object.keys(result.events).length },
    ].map(({ label, value }) => (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>{label}</div>
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "rgba(100, 100, 100, 0.8)",
          }}
        >
          {value}
        </div>
      </div>
    ))}
  </div>
);

function useDynamicFields(initialValue: Record<string, any>) {
  const [store, setStore] = React.useState(initialValue);

  return {
    getField: (field: string) => store[field],
    setField: (field: string, value: any) => {
      setStore({ ...store, [field]: value });
    },
    values: store,
  };
}

export default SendQuery;
