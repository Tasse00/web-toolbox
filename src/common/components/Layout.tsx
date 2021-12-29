// fixed Top & Side
// scroll in Content
import React from "react";

const Layout: React.FC<{
  style?: React.CSSProperties;
  sidePosition?: "left" | "right";
  barPosition?: "top" | "bottom";

  bar?: React.ReactElement | false | React.ReactNode;
  barStyle?: React.CSSProperties;
  barClassName?: string;

  side?: React.ReactElement | false | React.ReactNode;
  sideStyle?: React.CSSProperties;
  sideClassName?: string;

  bottom?: React.ReactElement | false | React.ReactNode;

  contentStyle?: React.CSSProperties;
  contentClassName?: string;
}> = ({
  style,
  sidePosition = "left",
  barPosition = "top",

  bar: top,
  barStyle: topStyle,
  barClassName: topClassName,

  side,
  sideStyle,
  sideClassName,

  children,
  contentStyle,
  contentClassName,
}) => {
  const renderSide = () => (
    <div className={sideClassName} style={sideStyle}>
      {!!side ? side : undefined}
    </div>
  );
  const renderBar = () => (
    <div className={topClassName} style={topStyle}>
      {!!top ? top : undefined}
    </div>
  );
  console.log("Layout children: ",children);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {barPosition === "top" && renderBar()}
      <div style={{ flex: "1 1 1px", display: "flex", overflow: "hidden" }}>
        {sidePosition === "left" && renderSide()}
        <div
          className={contentClassName}
          style={{ flex: "1 1 1px", overflow: "auto", ...contentStyle }}
        >
          {children}
        </div>
        {sidePosition === "right" && renderSide()}
      </div>
      {barPosition === "bottom" && renderBar()}
    </div>
  );
};

export default Layout;
