import React from "react";
import { Col, Row } from "antd";
import AutoCompleteWithCache from "../components/Input/AutoCompleteWithCache";
import ABIs from "../abis";
import InterfaceDetect from "../components/ContractDebug/InterfaceDetect";
import MethodsDetect from "../components/ContractDebug/MethodsDetect";
import Layout from "../../../common/components/Layout";

// View Block
const DetectContract: React.FC<{}> = (props) => {
  const [address, setAddress] = React.useState("");

  return (
    <Layout style={{ width: "100%", height: "100%" }}>
      <div style={{ overflow: "hidden" }}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <AutoCompleteWithCache
              storeKey="address"
              btnTxt={address ? "reset" : "set"}
              onConfirm={(v) => {
                setAddress(v);
              }}
            />
          </Col>
          {address && (
            <>
              {Object.entries(ABIs).map((entry) => (
                <Col key={entry[0]}>
                  <InterfaceDetect
                    address={address}
                    name={entry[0]}
                    abi={entry[1]}
                  />
                </Col>
              ))}
              {Object.entries(ABIs).map((entry) => (
                <Col key={entry[0]} span={24}>
                  <MethodsDetect
                    address={address}
                    name={entry[0]}
                    abi={entry[1]}
                  />
                </Col>
              ))}
            </>
          )}
        </Row>
      </div>
    </Layout>
  );
};

export default DetectContract;
