import { useAccount, useContractDebug } from '../../hooks/web3';
import React from 'react';
import { Row, Col } from 'antd';
import Query from '../Query/Query';

const QueryGroup: React.FC<{}> = (props) => {
  const { queryOptions, removeQuery, address } = useContractDebug();
  const account = useAccount();
  return (
    <Row style={{ width: '100%' }} gutter={[16, 16]}>
      {queryOptions.map((q) => (
        <Col key={q.id}>
          <Query
            {...q}
            onRemove={() => removeQuery(q.id)}
            contractAddress={address}
            from={account}
          />
        </Col>
      ))}
    </Row>
  );
};

export default QueryGroup;
