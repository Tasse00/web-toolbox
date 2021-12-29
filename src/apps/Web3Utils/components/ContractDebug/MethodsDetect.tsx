import React from 'react';
import { AbiItem } from 'web3-utils';
import { List, Tag, Card } from 'antd';
import { formatAbi } from '../../utils/web3';
import useDetectMethods from '../../hooks/web3/useDetectMethods';
const MethodsDetect: React.FC<{
  address: string;
  abi: AbiItem[];
  name: string;
}> = ({ abi, address, name }) => {
  const methodStatus = useDetectMethods(abi, address);

  const total = methodStatus.length;
  const existed = methodStatus.filter(ms=>ms.status==='existed').length;
  return (
    <Card title={name} extra={`${existed}/${total}`}>
      <List
        dataSource={methodStatus}
        renderItem={(ms) => (
          <List.Item extra={<Tag>{ms.status}</Tag>}>
            <List.Item.Meta title={formatAbi(ms.abi)} />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default MethodsDetect;
