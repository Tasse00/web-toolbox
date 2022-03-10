import { Button, Card, Input, notification } from "antd";
import { TextAreaRef } from "antd/lib/input/TextArea";
import React, { useCallback, useRef } from "react";
import "./Editor.scss";

const Editor: React.FC<{
  value: string;
  onChange: (v: string) => void;
  style?: React.CSSProperties;
}> = ({ value, onChange, style }) => {
  const formatValue = useCallback(() => {
    try {
      const obj = JSON.parse(value);
      onChange(JSON.stringify(obj, undefined, 2));
    } catch (err) {
      notification.error({
        description: `${err}`,
        message: `Is not valid JSON format`,
      });
    }
  }, [value, onChange]);

  const textRef = useRef<TextAreaRef>(null);
  const noRef = useRef<TextAreaRef>(null);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",

        ...style,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
        }}
      >
        <Input.TextArea
          ref={noRef}
          bordered={false}
          style={{ width: 60, paddingRight: 0 }}
          disabled
          className={"json-editor-line-no"}
          value={value
            .split("\n")
            .map((_, idx) => `${idx + 1}`)
            .join("\n")}
          onScroll={(e) => {
            const elem = e.target as HTMLTextAreaElement;
            if (textRef.current && textRef.current.resizableTextArea) {
              textRef.current.resizableTextArea.textArea.scrollTo({
                top: elem.scrollTop,
              });
            }
          }}
        />
        <Input.TextArea
          style={{ flex: 1 }}
          onScroll={(e) => {
            const elem = e.target as HTMLTextAreaElement;
            if (noRef.current && noRef.current.resizableTextArea) {
              noRef.current.resizableTextArea.textArea.scrollTo({
                top: elem.scrollTop,
              });
            }
          }}
          ref={textRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <Card
        size="small"
        bodyStyle={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 4,
        }}
      >
        <Button size="small" onClick={formatValue}>
          Format
        </Button>
      </Card>
    </div>
  );
};

export default Editor;
