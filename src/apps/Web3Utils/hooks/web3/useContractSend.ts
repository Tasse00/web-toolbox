import React from 'react';
import { AbiItem } from 'web3-utils';
import { EventData } from 'web3-eth-contract';
import useAsync, { UseAsyncOptions, UseAsyncResult } from '../useAsync';
import { useAccount, useContract } from '../web3';

export interface UseContractSendParams<P extends any[]> {
  address: string;
  abi: AbiItem;
  options?: P;
  gas?: number;
  value?: number | string;
}

export interface SendResult {
  blockHash: string;
  blockNumber: number;
  cumulativeGasUsed: number;
  events: EventData[];
  from: string;
  gasUsed: number;
  logsBloom: string;
  to: string;
  transactionHash: string;
  transactionIndex: number;
}

export default function useContractSend<P extends any[]>(
  { address, abi, options, gas = 200000, value = 0 }: UseContractSendParams<P>,
  asyncOptions: Omit<UseAsyncOptions<P>, 'autoParams'>,
): UseAsyncResult<P, SendResult> {
  const abiArr = React.useMemo(() => [abi], [abi]);
  const contract = useContract(abiArr, address);
  const account = useAccount();

  const svc = React.useCallback(
    async () =>
      await contract.methods[abi.name || ''](...(options || [])).send({
        from: account,
        gas,
        value,
      }),
    [contract, abi],
  );

  return useAsync(svc, asyncOptions);
}
