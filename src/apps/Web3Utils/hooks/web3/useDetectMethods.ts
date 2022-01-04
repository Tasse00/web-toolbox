import React from 'react';
import { getAbiKey } from '../../utils/web3';
import { AbiItem, AbiInput } from 'web3-utils';
import { useContract } from '../web3';
import { getPromiseWithAbort } from '../../utils/async';


const ExistedCaseMatchers: ((errStr: string) => boolean)[] = [
  (errStr) =>
    /^Returned error: VM Exception while processing transaction: revert .+$/.test(
      errStr,
    ),
  (errStr) => /^Returned error: execution reverted: .+$/.test(errStr),
];

const NonExistedCaseMatchers: ((errStr: string) => boolean)[] = [
  (errStr) =>
    /Provided address 0x[0-9A-Fa-f]{40} is invalid, the capitalization checksum test failed, or it's an indirect IBAN address which can't be converted./.test(
      errStr,
    ),

  (errStr) =>
    /^Returned error: VM Exception while processing transaction: revert$/.test(
      errStr,
    ),
  (errStr) => /^Returned error: execution reverted$/.test(errStr),
];

function isExisted(errStr: string): boolean {
  for (let matcher of ExistedCaseMatchers) {
    if (matcher(errStr)) {
      return true;
    }
  }
  return false;
}

function isNonExisted(errStr: string): boolean {
  for (let matcher of NonExistedCaseMatchers) {
    if (matcher(errStr)) {
      return true;
    }
  }
  return false;
}

function getDefaultValueForType(type: AbiInput['type']): string {
  return (
    {
      uint256: '0',
      address: '0x0000000000000000000000000000000000000001',
      bytes: '0x00',
      bytes4: '0x00',
      bytes32: '0x00',
    }[type] || '0'
  );
}

export default function useDetectMethods(
  abi: AbiItem[],
  address: string,
): CheckState[] {
  const [state, dispatch] = React.useReducer(reducer, []);
  const cancells = React.useRef<((reason: any) => void)[]>([]);

  const funcAbi = React.useMemo(
    () => abi.filter((a) => a.type === 'function'),
    [abi],
  );

  const contract = useContract(funcAbi, address);

  React.useEffect(() => {
    for (let cancel of cancells.current) {
      cancel('reset');
    }
    cancells.current = [];

    dispatch({
      type: 'RESET_ABI',
      payload: funcAbi,
    });

    const { abort } = getPromiseWithAbort(
      (async () => {
        for (let item of funcAbi) {
          const { abort } = getPromiseWithAbort(
            (async () => {
              try {
                const options = (item.inputs || []).map((ipt) =>
                  getDefaultValueForType(ipt.type),
                );

                await contract.methods[item.name || ''](...options).call();

                dispatch({
                  type: 'UPDATE_CHECK_STATE',
                  payload: {
                    abiKey: getAbiKey(item),
                    status: 'existed',
                  },
                });
              } catch (err) {
                let errStr = (err as any).message as string;
                let status: ActUpdateCheckState['payload']['status'];
                if (isNonExisted(errStr)) {
                  status = 'not-existed';
                } else if (isExisted(errStr)) {
                  status = 'existed';
                } else {
                  status = 'failed';
                }
                dispatch({
                  type: 'UPDATE_CHECK_STATE',
                  payload: {
                    abiKey: getAbiKey(item),
                    status,
                  },
                });
              }
            })(),
          );
          cancells.current.push(() => abort('cancel'));
        }
      })(),
    );
    cancells.current.push(() => abort('cancel'));
  }, [address, contract, funcAbi]);

  return state;
}

export interface CheckState {
  status: 'checking' | 'existed' | 'not-existed' | 'failed';
  abi: AbiItem;
}

interface ActResetAbi {
  type: 'RESET_ABI';
  payload: AbiItem[];
}

interface ActUpdateCheckState {
  type: 'UPDATE_CHECK_STATE';
  payload: {
    abiKey: string;
    status: CheckState['status'];
  };
}

type Action = ActResetAbi | ActUpdateCheckState;

function reducer(state: CheckState[], action: Action): CheckState[] {
  switch (action.type) {
    case 'RESET_ABI':
      return action.payload
        .filter((abi) => abi.type === 'function')
        .map((abi) => ({
          abi,
          status: 'checking',
        }));

    case 'UPDATE_CHECK_STATE': {
      const idx = state.findIndex(
        (cs) => getAbiKey(cs.abi) === action.payload.abiKey,
      );
      if (idx > -1) {
        state[idx] = { ...state[idx], status: action.payload.status };
      }
      return [...state];
    }

    default:
      return state;
  }
}
