import { notification } from "antd";
import React, { useState } from "react";
import { copyToClipboard } from "toolbox-utils";

const Message: React.FC<{
  msg: any;
}> = ({ msg }) => {
  return (
    <div
      style={{
        margin: 8,
        backgroundColor: "rgba(220,220,220,0.2)",
        borderRadius: 8,
      }}
      onDoubleClick={() => {
        copyToClipboard(JSON.stringify(msg, undefined, 2));
        notification.success({ message: "Copied" });
      }}
    >
      <pre>{JSON.stringify(msg, undefined, 2)}</pre>
    </div>
  );
};

export default Message;
