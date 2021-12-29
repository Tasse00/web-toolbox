import { useFrameGroup } from '../hooks/frames';
import { Card, Row, Col } from 'antd';
import React from 'react';
import ContractDebug from './ContractDebug';
import ERC721Debug from './ERC721Debug';
import DetectContract from './DetectContract';

const Dashboard: React.FC<{}> = (props) => {
  const { createFrame } = useFrameGroup();
  return (
    <Row gutter={[16, 16]}>
      <Col>
        <Card
          hoverable
          onClick={() => {
            createFrame(
              {
                title: 'ERC721 Debug',
                component: <ERC721Debug />,
                closable: true,
              },
              true,
            );
          }}
        >
          New ERC721 Debug
        </Card>
      </Col>
      <Col>
        <Card
          hoverable
          onClick={() => {
            createFrame(
              {
                title: 'Contract Debug',
                component: <ContractDebug />,
                closable: true,
              },
              true,
            );
          }}
        >
          Contract Debug
        </Card>
      </Col> <Col>
        <Card
          hoverable
          onClick={() => {
            createFrame(
              {
                title: 'View Block',
                component: <DetectContract />,
                closable: true,
              },
              true,
            );
          }}
        >
          Detect Contract
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard;
