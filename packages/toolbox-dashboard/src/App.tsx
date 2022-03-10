import React from "react";
import "antd/dist/antd.min.css";
import "./App.css";
import { Framework } from "toolbox-framework";
import configs from "./apps";

const Dashboard: React.FC = () => <div>FC</div>;

function App() {
  return (
    <Framework defaultConfigs={configs}>
      <Dashboard />
    </Framework>
  );
}

export default App;
