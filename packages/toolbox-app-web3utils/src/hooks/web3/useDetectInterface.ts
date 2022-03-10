import useRequest from '@ahooksjs/use-request';
import { AbiItem } from 'web3-utils';
import { useContract } from '../web3';

export interface DetectInterfaceResult {
  supportedERC165: boolean;
  supported: boolean;
}

const ERC165Abi: AbiItem[] = [
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export default function useDetectInterface(address: string, interfaceId: string) {
  const contract = useContract(
    ERC165Abi,
    address,
  );

  return useRequest(
    async () => {
      try {
        const supportERC165 = await contract.methods
          .supportsInterface('0x01ffc9a7')
          .call();
        if (supportERC165) {
          const supported = await contract.methods
            .supportsInterface(interfaceId)
            .call();
          return {
            supported,
            supportedERC165: true,
          } as DetectInterfaceResult;
        } else {
          return {
            supported: false,
            supportedERC165: false,
          } as DetectInterfaceResult;
        }
      } catch {
        return {
          supported: false,
          supportedERC165: false,
        } as DetectInterfaceResult;
      }
    },
    { refreshDeps: [contract, interfaceId] },
  );

  // 1. get contract
  // 2. check erc165 supported
  // 3. check interface supported
}
