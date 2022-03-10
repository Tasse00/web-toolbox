import React from "react";
import {
  Steps,
  Select,
  Input,
  Button,
  AutoComplete,
  Row,
  Col,
  Card,
  Typography,
} from "antd";
import ABIs from "../abis";
import { useCachedState } from "../hooks/cache";
import { isValidAddress } from "../utils/web3";
import { unique } from "../utils/array";
import ContractDebugProvider from "../providers/ContractDebugProvider";
import MethodList from "../components/ContractDebug/MethodList";
import QueryGroup from "../components/ContractDebug/QueryGroup";
import { Layout } from "toolbox-components";

// const options = Object.keys(ABIs).map((name) => ({
//   label: name,
//   value: ABIs[name],
// }));

const ContractDebug: React.FC<{}> = (props) => {
  // choose ABI
  // choose address
  // set frame name

  const [current, setCurrent] = React.useState(0);
  const [isOk, setIsOk] = React.useState(false);
  const [customAbi, setCustomAbi] = React.useState("[]");

  const [abiType, setAbiType] = React.useState("IERC721");

  const [address, setAddress] = React.useState("");
  const [cachedAddresses, setCachedAddresses] = useCachedState<string[]>(
    `_store_${abiType.toLowerCase()}_address`,
    []
  );
  const options = cachedAddresses
    .filter((c) => c.includes(address))
    .map((v) => ({ value: v }));

  let isValidCustomAbi = React.useMemo(() => {
    try {
      JSON.parse(customAbi);
      return true;
    } catch {
      return false;
    }
  }, [customAbi]);

  const abi = React.useMemo(() => {
    if (abiType === "Custom") {
      try {
        return JSON.parse(customAbi);
      } catch {
        return [];
      }
    } else {
      // @ts-ignore
      return ABIs[abiType];
    }
  }, [abiType, customAbi]);

  return isOk ? (
    <ContractDebugProvider abi={abi} address={address}>
      <Layout
        style={{ width: "100%", height: "100%" }}
        sidePosition="right"
        bar={
          <Card>
            <Row align="middle">
              <Col>
                <Typography.Text style={{ marginRight: 16 }}>
                  Contract Address
                </Typography.Text>
              </Col>
              <Col flex={1}>
                <Input disabled value={address} style={{ width: "100%" }} />
              </Col>
              <Col>
                <Button
                  style={{ width: 120 }}
                  type="default"
                  onClick={() => setIsOk(false)}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Card>
        }
        side={
          <Card size="small" style={{ height: "100%", overflow: "auto" }}>
            <MethodList />
          </Card>
        }
      >
        <Layout style={{ width: "100%", height: "100%" }} side={false}>
          <QueryGroup />
        </Layout>
      </Layout>
    </ContractDebugProvider>
  ) : (
    <>
      <Steps size="small" current={current}>
        <Steps.Step title="Choose ABI" />
        <Steps.Step title="Set Address" />
      </Steps>

      {current === 0 && (
        <>
          <Select
            value={abiType}
            onChange={(t) => setAbiType(t)}
            options={[...Object.keys(ABIs), "Custom"].map((name) => ({
              value: name,
            }))}
          />
          {"Custom" === abiType && (
            <Input.TextArea
              value={customAbi}
              onChange={(e) => {
                setCustomAbi(e.target.value);
              }}
            />
          )}

          <Button disabled={!isValidCustomAbi} onClick={() => setCurrent(1)}>
            Next
          </Button>
        </>
      )}

      {current === 1 && (
        <>
          <AutoComplete
            placeholder="Contract Address"
            options={options}
            value={address}
            style={{ width: "100%" }}
            onChange={(e) => setAddress(e)}
            onSelect={(e) => setAddress(e.toString())}
          />

          <Button
            style={{ width: 120 }}
            type="primary"
            disabled={!isValidAddress(address)}
            onClick={() => {
              setIsOk(true);
              setCachedAddresses(unique([address, ...cachedAddresses]));
            }}
          >
            Interact
          </Button>
        </>
      )}
    </>
  );
};

export default ContractDebug;
