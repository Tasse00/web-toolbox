import React from 'react';
import { AbiItem } from 'web3-utils';
import useAsync, { UseAsyncOptions, UseAsyncResult } from '../useAsync';
import { useAccount, useContract } from '../web3';

export interface UseContractCallParams<P extends any[]> {
  address: string;
  abi: AbiItem;
  options?: P;
}

export default function useContractCall<P extends any[], R extends any[]>(
  { address, abi, options }: UseContractCallParams<P>,
  asyncOptions: Omit<UseAsyncOptions<P>, 'autoParams'>,
): UseAsyncResult<P, R> {
  const abiArr = React.useMemo(() => [abi], [abi]);
  const contract = useContract(abiArr, address);
  const account = useAccount();
  const svc = React.useCallback(
    async () =>
      await contract.methods[abi.name || ''](...(options || [])).call({
        from: account,
      }),
    [contract, abi, account, options],
  );

  return useAsync(svc, asyncOptions);
}
