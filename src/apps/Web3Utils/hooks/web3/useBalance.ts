import { useCallback } from "react";
import { Web3State } from "../../providers/Web3Provider";
import useAsync, { UseAsyncOptions } from "../useAsync";
import { useWeb3State } from "../web3";

async function fetchBalance(
  getWeb3: Web3State["getWeb3"],
  address: string
): Promise<string> {
  const web3 = getWeb3();
  return await web3.eth.getBalance(address);
}

export function useBalance(
  address: string,
  options?: Omit<UseAsyncOptions<any[]>, "autoParams">
) {
  const { getWeb3 } = useWeb3State();

  return useAsync(fetchBalance, { ...options, autoParams: [getWeb3, address] });
}
