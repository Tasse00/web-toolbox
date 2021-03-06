import { useWeb3Control } from "../hooks/web3";
import React from "react";
import { Button, Card, Tag } from "antd";
import Connect from "../components/Connect/Connect";
import Wallet from "../components/Wallet/Wallet";
import Web3Provider from "../providers/Web3Provider";
import { Layout } from "toolbox-components";
import theme from "../theme";

interface Props {}

const MainLayout: React.FC<Props> = ({ children }) => {
  const { web3, providerType, disconnect, state } = useWeb3Control();

  const inner = (
    <Layout
      style={{ width: "100%", height: "100%" }}
      bar={
        web3 &&
        providerType && (
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div></div>
              <div>
                <Tag>{providerType}</Tag>
                <Button onClick={disconnect}>Reset</Button>
              </div>
            </div>
          </div>
        )
      }
      barClassName={theme.panel}
      side={
        web3 &&
        providerType && (
          <div style={{ width: 240 }}>
            <Wallet />
          </div>
        )
      }
      sideClassName={theme.panel}
    >
      {state ? (
        children
      ) : (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card style={{ width: 400, transition: "all 0.3s" }}>
            <Connect />
          </Card>
        </div>
      )}
    </Layout>
  );

  return state ? <Web3Provider {...state}>{inner}</Web3Provider> : inner;
};

export default MainLayout;
