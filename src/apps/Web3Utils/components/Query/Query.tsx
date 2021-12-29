
import React from 'react';
import CallQuery from './CallQuery';
import SendQuery from './SendQuery';
import { AbiItem } from 'web3-utils';

export interface QueryProps {
  id: string; // 唯一ID
  contractAddress: string; // 合约地址
  abi: AbiItem;
  from: string; // 调用人
  style?: React.CSSProperties;
  onRemove?: () => void;
}

const Query: React.FC<QueryProps & { type?: 'call' | 'send' }> = ({
  type,
  ...props
}) => {
  const queryType =
    type ||
    (['pure', 'view'].includes(props.abi.stateMutability || '')
      ? 'call'
      : 'send');

  return queryType === 'call' ? (
    <CallQuery {...props} />
  ) : (
    <SendQuery {...props} />
  );
};

export default Query;
