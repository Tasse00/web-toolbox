import React from 'react';
import { AbiItem } from 'web3-utils';

// 一个合约的调试环境
const ContractDebugProvider: React.FC<{
  address: string;
  abi: AbiItem[];
}> = ({ address, abi, children }) => {
  const [state, dispatch] = React.useReducer(reducer, {
    address,
    abi,
    queryOptions: [],
  });

  React.useEffect(() => {
    dispatch({ type: 'RESET_CONTRACT', payload: { address, abi } });
  }, [address, abi]);

  const value = {
    createQuery: React.useCallback(
      (abi: AbiItem) => dispatch({ type: 'CREATE_QUERY', payload: { abi } }),
      [],
    ),
    removeQuery: React.useCallback(
      (id: string) => dispatch({ type: 'REMOVE_QUERY', payload: { id } }),
      [],
    ),
    ...state,
  };

  return (
    <ContractDebugContext.Provider value={value}>
      {children}
    </ContractDebugContext.Provider>
  );
};

export interface QueryOption {
  id: string;
  abi: AbiItem;
}

export interface ContractDebugState {
  address: string;
  abi: AbiItem[];
  queryOptions: QueryOption[];
}

interface CreateQueryAction {
  type: 'CREATE_QUERY';
  payload: {
    abi: AbiItem;
  };
}
interface RemoveQueryAction {
  type: 'REMOVE_QUERY';
  payload: {
    id: string;
  };
}
interface ResetContract {
  type: 'RESET_CONTRACT';
  payload: {
    address: string;
    abi: AbiItem[];
  };
}

type Action = CreateQueryAction | RemoveQueryAction | ResetContract;

function reducer(
  state: ContractDebugState,
  action: Action,
): ContractDebugState {
  switch (action.type) {
    case 'CREATE_QUERY':
      return {
        ...state,
        queryOptions: [
          ...state.queryOptions,
          {
            id: generateQueryOption(),
            abi: action.payload.abi,
          },
        ],
      };
    case 'REMOVE_QUERY':
      const idx = state.queryOptions.findIndex(
        (q) => q.id === action.payload.id,
      );
      if (idx >= 0) {
        state.queryOptions.splice(idx, 1);
      }
      return {
        ...state,
        queryOptions: [...state.queryOptions],
      };
    case 'RESET_CONTRACT':
      return {
        address: action.payload.address,
        abi: action.payload.abi,
        queryOptions: [],
      };
    default:
      return state;
  }
}
export function generateQueryOption(): string {
  return Math.random().toString();
}

export interface ContractDebugContextValue extends ContractDebugState {
  createQuery: (abi: AbiItem) => void;
  removeQuery: (id: string) => void;
}
export const ContractDebugContext =
  React.createContext<ContractDebugContextValue>({
    address: '',
    abi: [],
    queryOptions: [],
    createQuery: () => {},
    removeQuery: () => {},
  });

export default ContractDebugProvider;
