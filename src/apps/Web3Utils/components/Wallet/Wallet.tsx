import { useAccount, useAccounts, useWeb3Control } from '../../hooks/web3';
import React from 'react';
import {
  Row,
  Col,
  Typography,
  Select,
  List,
  Card,
  Button,
  message,
  Tooltip,
} from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { copyToClipboard } from '../../utils/copy';

const Wallet: React.FC<{}> = (props) => {
  const accounts = useAccounts();
  const defaultAccount = useAccount();
  const { setAccount } = useWeb3Control();

  return (
    <Row gutter={[8, 8]} style={{ width: '100%' }}>
      <Col>
        <Title>Default Account</Title>
      </Col>
      <Col>
        <Select
          style={{ width: '100%' }}
          options={accounts.map((acc) => ({ value: acc }))}
          value={defaultAccount || ''}
          onSelect={(v)=>setAccount(v.toString())}
        />
      </Col>
      <Col>
        <Title>Accounts</Title>
      </Col>
      <Col>
        <Card size="small" bodyStyle={{ padding: 4 }}>
          <List
            size="small"
            dataSource={accounts}
            renderItem={(acc) => (
              <List.Item>
                <Tooltip title={acc}>
                  <Typography.Text ellipsis>{acc}</Typography.Text>
                </Tooltip>
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  type="text"
                  onClick={() => {
                    copyToClipboard(acc);
                    message.success({ content: 'Copied' });
                  }}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
};

const Title: React.FC = (props) => (
  <Typography.Title level={5} style={{ marginBottom: 0 }}>
    {props.children}
  </Typography.Title>
);

export default Wallet;
