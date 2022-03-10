import useContractCall from "../../hooks/web3/useContractCall";
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
import { useDynamicFields } from "./hooks";
import { QueryProps } from "./Query";

const CallQuery: React.FC<QueryProps> = ({
  abi,
  id,
  style,
  contractAddress,
  onRemove,
}) => {
  const inputs = React.useMemo(() => abi.inputs || [], [abi]);
  const outputs = React.useMemo(() => abi.outputs || [], [abi]);

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
  } = useContractCall(
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
      {inputs.length > 0 && (
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

      {data && data.length > 0 && (
        <Row gutter={[16, 16]} align="middle">
          <Col style={{ minWidth: 80 }}>
            <Typography.Text>Outputs:</Typography.Text>
          </Col>
          <Col flex={1}>
            <Row gutter={[16, 16]}>
              {outputs.length === 1 && (
                <Col>
                  <Card size="small" bordered>
                    <Row align="middle" gutter={8}>
                      <Col>
                        <Typography.Text>{outputs[0].type}</Typography.Text>
                      </Col>
                      <Col>
                        <Input
                          placeholder={outputs[0].type}
                          value={data ? data.toString() : "--"}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              )}

              {outputs.length > 1 &&
                outputs.map((opt, idx) => (
                  <Col key={idx}>
                    <Card size="small" bordered>
                      <Row align="middle" gutter={8}>
                        <Col>
                          <Typography.Text>{opt.type}</Typography.Text>
                        </Col>
                        <Col>
                          <Input
                            placeholder={opt.type}
                            value={data ? data.toString() : "--"}
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
    </Card>
  );
};

export default CallQuery;
