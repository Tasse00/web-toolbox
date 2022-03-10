import React from "react";
import { Card, Row, AutoComplete, Button, Col } from "antd";
import storage from "../storage";
import { isValidAddress } from "../utils/web3";
import { unique } from "../utils/array";
import ABI from "../abis/ERC721Enumerable.json";
import ContractDebugProvider from "../providers/ContractDebugProvider";
import MethodList from "../components/ContractDebug/MethodList";
import QueryGroup from "../components/ContractDebug/QueryGroup";
import ERC721Info from "../components/ContractDebug/ERC721/ERC721Info";
import { useCachedState } from "../hooks/cache";
import { Layout } from "toolbox-components";

const _STORE_ERC721_ADDRESS = "_store_erc721_address";

const ERC721Debug: React.FC<{}> = (props) => {
  const [address, setAddress] = React.useState("");
  const [addressLocked, setAddressLocked] = React.useState(false);

  const [cachedAddresses, setCachedAddresses] = useCachedState<string[]>(
    _STORE_ERC721_ADDRESS,
    []
  );

  const options = cachedAddresses
    .filter((c) => c.includes(address))
    .map((v) => ({ value: v }));

  const lockAddress = () => {
    setAddressLocked(true);
    storage.set(_STORE_ERC721_ADDRESS, unique([address, ...cachedAddresses]));
    setCachedAddresses(unique([address, ...cachedAddresses]));
  };

  const unlockAddress = () => {
    setAddressLocked(false);
  };

  return (
    <ContractDebugProvider abi={ABI as any} address={address}>
      <Layout
        style={{ width: "100%", height: "100%" }}
        sidePosition="right"
        bar={
          <Card>
            <Row>
              <Col flex={1}>
                <AutoComplete
                  disabled={addressLocked}
                  placeholder="Contract Address"
                  options={options}
                  value={address}
                  style={{ width: "100%" }}
                  onChange={(e) => setAddress(e)}
                  onSelect={(e) => setAddress(e.toString())}
                />
              </Col>
              <Col>
                {addressLocked ? (
                  <Button
                    style={{ width: 120 }}
                    type="default"
                    onClick={unlockAddress}
                  >
                    Reset
                  </Button>
                ) : (
                  <Button
                    style={{ width: 120 }}
                    type="primary"
                    disabled={!isValidAddress(address)}
                    onClick={lockAddress}
                  >
                    Interact
                  </Button>
                )}
              </Col>
            </Row>
          </Card>
        }
        side={
          addressLocked && (
            <Card size="small" style={{ height: "100%", overflow: "auto" }}>
              <MethodList />
            </Card>
          )
        }
      >
        {addressLocked && (
          <Layout
            style={{ width: "100%", height: "100%" }}
            bar={<ERC721Info />}
          >
            <QueryGroup />
          </Layout>
        )}
      </Layout>
    </ContractDebugProvider>
  );
};

export default ERC721Debug;
