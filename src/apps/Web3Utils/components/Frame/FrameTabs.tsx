import { useFrameGroup } from '../../hooks/frames';
import React from 'react';
import { Card, Button, Col, Row, Typography } from 'antd';

import { CloseOutlined } from '@ant-design/icons';

const FrameTabs: React.FC = () => {
  const { frames, closeFrame, switchFrame, currFrame } = useFrameGroup();

  
  return (
    <div style={{ width: '100%', overflow: 'auto', display: 'flex' }}>
      {frames.map((frame) => (
        <div key={frame.id} style={{ marginRight: 8 }}>
          <Card
            size="small"
            onClick={(e) => {
              switchFrame(frame.id);
            }}
            bodyStyle={{
              padding: '4px 8px',
              transition: 'all 0.2s',
              opacity: currFrame && currFrame.id === frame.id ? 1 : 0.5,
              cursor: 'pointer',
            }}
          >
            <Row justify="space-between" align="middle" wrap={false}>
              <Col>
                <Typography.Text style={{ whiteSpace: 'nowrap' }}>
                  {frame.title}
                </Typography.Text>
              </Col>

              <Col>
                <Button
                  size="small"
                  icon={<CloseOutlined />}
                  type="text"
                  disabled={!frame.closable}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent.preventDefault();
                    e.nativeEvent.stopImmediatePropagation();
                    closeFrame(frame.id);
                  }}
                />
              </Col>
            </Row>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default FrameTabs;
