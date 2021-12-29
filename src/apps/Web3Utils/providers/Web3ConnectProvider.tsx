import React from "react";
import Web3 from "web3";
import { ContractOptions } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import { Web3State } from "./Web3Provider";
interface Props {}

const Web3ConnectProvider: React.FC<Props> = (props) => {
  const [web3, setWeb3] = React.useState<undefined | Web3>(undefined);

  const [providerType, setProviderType] = React.useState<
    undefined | ProviderType
  >(undefined);

  const disconnect = React.useCallback(() => {
    setWeb3(undefined);
    setProviderType(undefined);
  }, []);

  const setup = React.useCallback((web3: Web3, providerType: ProviderType) => {
    setWeb3(web3);
    setProviderType(providerType);
  }, []);

  // const [chainId, setChainId] = React.useState(0);
  const [account, setAccount] = React.useState("");
  const [accounts, setAccounts] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (web3) {
      // web3.eth.getChainId().then((chainId) => {
      //   setChainId(chainId);
      // });

      const accounts = [];
      for (let idx = 0; idx < web3.eth.accounts.wallet.length; idx++) {
        accounts.push(web3.eth.accounts.wallet[idx].address);
      }

      setAccounts(accounts);
      if (web3.eth.defaultAccount == null) {
        web3.eth.defaultAccount = accounts[0];
      }
      setAccount(web3.eth.defaultAccount);
    }
  }, [web3]);

  const getContract = React.useCallback(
    (abi: AbiItem[], address: string, options?: ContractOptions) => {
      if (!web3) {
        throw new Error("web3 not initialized");
      }
      return new web3.eth.Contract(abi, address, options);
    },
    [web3]
  );
  const getWeb3 = React.useCallback(() => {
    if (!web3) {
      throw new Error("web3 not initialized");
    }
    return web3;
  }, [web3]);

  const setAccountWrapper = React.useCallback(
    (account: string) => {
      setAccount(account);
      if (web3) {
        web3.eth.defaultAccount = account;
      }
    },
    [web3]
  );

  const value = {
    web3,
    providerType,
    disconnect,
    setup,
    setAccount: setAccountWrapper,
    state:
      account && accounts && web3 !== undefined
        ? {
            account,
            accounts,
            getContract,
            getWeb3,
          }
        : undefined,
  };

  return (
    <Web3ConnectContext.Provider value={value}>
      {props.children}
    </Web3ConnectContext.Provider>
  );
};

export type ProviderType = "metamask" | "web3";

export interface Web3ConnectState {
  web3?: Web3;
  providerType?: ProviderType;
  setup: (web3: Web3, providerType: ProviderType) => void;
  disconnect: () => void;
  setAccount: (account: string) => void;
  state?: Web3State;
}

export const Web3ConnectContext = React.createContext<Web3ConnectState>({
  web3: undefined,
  providerType: undefined,
  disconnect: () => {},
  setup: () => {},
  setAccount: () => {},
});

export default Web3ConnectProvider;
