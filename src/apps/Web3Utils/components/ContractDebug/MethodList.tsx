import { useContractDebug } from '../../hooks/web3';
import React from 'react';
import { List, Row, Col, Typography, Tag } from 'antd';

const MethodList: React.FC<{}> = (props) => {
  const { abi, createQuery } = useContractDebug();

  const methodAbi = React.useMemo(
    () => abi.filter((item) => item.type === 'function'),
    [abi],
  );
  return (
    <List
      dataSource={methodAbi.filter((a) => a.type === 'function')}
      renderItem={(abi) => (
        <List.Item
          style={{ width: 200, cursor: 'pointer' }}
          onClick={() => createQuery(abi as any)}
        >
          <List.Item.Meta
            title={
              <Row justify="space-between">
                <Col>
                  <Typography.Text strong ellipsis>
                    {abi.stateMutability === 'pure' && (
                      <Tag color="green">call</Tag>
                    )}
                    {abi.stateMutability === 'view' && (
                      <Tag color="green">call</Tag>
                    )}

                    {abi.stateMutability === 'nonpayable' && (
                      <Tag color="blue">send</Tag>
                    )}
                    {abi.stateMutability === 'payable' && (
                      <Tag color="blue">send</Tag>
                    )}
                    {abi.stateMutability === 'payable' && (
                      <Tag color="red">pay</Tag>
                    )}
                    {abi.name}
                  </Typography.Text>
                </Col>
              </Row>
            }
            description={
              <Row justify="space-between">
                <Col>
                  <Typography.Text type="secondary" ellipsis>
                    {(abi.inputs || []).map((ipt) => ipt.name).join(',')}
                  </Typography.Text>
                </Col>
                <Col>
                  <Typography.Text type="success" ellipsis>
                    {(abi.outputs || []).map((opt) => opt.type).join(',')}
                  </Typography.Text>
                </Col>
              </Row>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default MethodList;
