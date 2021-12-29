import React from 'react';
import { Tabs } from 'antd';
import DirectConnect from './DirectConnect';
import MetaMaskConnect from './MetaMaskConnect';
const Connect: React.FC<{

}> = props => {

  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Direct" key="direct">
        <DirectConnect />
      </Tabs.TabPane>
      <Tabs.TabPane tab="MetaMask" key="metamask">
        <MetaMaskConnect />
      </Tabs.TabPane>
    </Tabs>
  )
}

export default Connect;