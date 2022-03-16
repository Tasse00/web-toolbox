import { Button, Typography } from "antd";
import React, { useEffect, useRef } from "react";

interface Props {
  title: string;
  lines: string[];
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => any;
  onNext: () => any;
  onMenu: () => any;
  style?: React.CSSProperties;
}

export const ChapterViewer: React.FC<Props> = ({
  title,
  lines,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onMenu,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // 内容变幻时立即滚动到顶部
  useEffect(() => {
    if (ref.current) {
      console.log(ref.current);
      ref.current.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }
  }, [lines]);
  return (
    <div
      ref={ref}
      style={{ height: "100%", overflow: "auto", padding: 16, ...style }}
    >
      <Typography.Title level={3} style={{ textAlign: "center" }}>
        {title}
      </Typography.Title>
      <div style={{ paddingTop: 16 }}>
        {lines.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          columnGap: 16,
          paddingLeft: 16,
          paddingRight: 16,
          flexWrap: "nowrap",
        }}
      >
        {hasPrev && (
          <Button block onClick={onPrev}>
            Prev
          </Button>
        )}
        <Button block onClick={onMenu}>
          Menu
        </Button>
        {hasNext && (
          <Button block onClick={onNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
