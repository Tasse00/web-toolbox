import React from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Contract, ContractOptions } from "web3-eth-contract";

export interface Web3State {
  account: string;
  accounts: string[];
  getContract: (
    abi: AbiItem[],
    address: string,
    options?: ContractOptions
  ) => Contract;
  getWeb3: () => Web3;
}

const Web3Provider: React.FC<Web3State> = ({ children, ...value }) => {
  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const Web3Context = React.createContext<Web3State>({
  account: "",
  accounts: [],

  getWeb3: () => {
    throw new Error("new Web3()");
  },
  getContract: () => {
    throw new Error("web3 not initialized;");
  },
});

export default Web3Provider;

//
// Connect Wallet and manage
