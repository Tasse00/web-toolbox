import { Radio } from "antd";
import React from "react";

export enum Mode {
  Edit = "Edit",
  View = "View",
  // Filter = "Filter",
}

const ModeButton: React.FC<{
  value: Mode;
  onChange: (v: Mode) => void;
}> = ({ value, onChange }) => {
  return (
    <Radio.Group value={value} onChange={(e) => onChange(e.target.value)}>
      <Radio.Button value={Mode.Edit}>{Mode.Edit}</Radio.Button>
      <Radio.Button value={Mode.View}>{Mode.View}</Radio.Button>
      {/* <Radio.Button value={Mode.Filter}>{Mode.Filter}</Radio.Button> */}
    </Radio.Group>
  );
};

export default ModeButton;
