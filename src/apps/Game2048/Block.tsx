import React from "react";

export const Block: React.FC<{
  val: number;
  row: number;
  col: number;
  color: Record<number, { background: string; text: string }>;
}> = ({ val, row, col, color }) => {
  const { background, text } = color[val] || {};

  return (
    <div
      style={{
        position: "absolute",
        width: "25%",
        height: "25%",
        top: `${row * 25}%`,
        left: `${col * 25}%`,
        boxSizing: "border-box",
        backgroundColor: background || "rgba(200,200,200,0.2)",
        color: text || "#000000",
        border: "1px solid rgba(200,200,200,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none", // for hotkeys
      }}
    >
      {val || ""}
    </div>
  );
};
