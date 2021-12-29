import React from "react";
import FrameGroup from "./components/Frame/FrameGroup";
import Dashboard from "./frames/Dashboard";
import MainLayout from "./layouts/MainLayout";
import Web3ConnectProvider from "./providers/Web3ConnectProvider";
import theme from "./theme";
import "./theme.scss";

export const Web3UtilsApp: React.FC = () => {
  return (
    <div className={theme.app}>
      <Web3ConnectProvider>
        <MainLayout>
          <FrameGroup
            initialFrames={[
              {
                id: "dashboard",
                title: "Dashboard",
                component: <Dashboard />,
              },
            ]}
          />
        </MainLayout>
      </Web3ConnectProvider>
    </div>
  );
};
