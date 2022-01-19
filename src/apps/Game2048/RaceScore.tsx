import React, { useContext, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { AppContext } from "../../framework/AppContext";
import { useAppConfig } from "../../framework/ConfigProvider";
import { Block } from "./Block";
import { use2048 } from "./hooks";
import { DEFAULT_CHANCE4, DEFAULT_COLOR } from "./utils";

const RaceScore: React.FC<{ onFinish: () => any }> = ({ onFinish }) => {
  const [focused, setFocused] = useState(false);

  const { loading: loadingChance4, value: chance4 } = useAppConfig(
    "chance4",
    DEFAULT_CHANCE4
  );
  const { value: color } = useAppConfig("color", DEFAULT_COLOR);

  const {
    blocks: p1Blocks,
    lost: p1Lost,
    score: p1Score,
    moveDown: p1MoveDown,
    moveLeft: p1MoveLeft,
    moveRight: p1MoveRight,
    moveUp: p1MoveUp,
  } = use2048({ chance4 });

  const {
    blocks: p2Blocks,
    lost: p2Lost,
    score: p2Score,
    moveDown: p2MoveDown,
    moveLeft: p2MoveLeft,
    moveRight: p2MoveRight,
    moveUp: p2MoveUp,
  } = use2048({ chance4 });

  const [winner, setWinner] = useState<"p1" | "p2" | undefined>(undefined);

  const ref = useHotkeys<HTMLDivElement>(
    "up,left,right,down,w,a,s,d",
    (e: KeyboardEvent) => {
      if (winner !== undefined) return;
      switch (e.code) {
        case "KeyW":
          p1MoveUp();
          break;
        case "KeyS":
          p1MoveDown();
          break;
        case "KeyA":
          p1MoveLeft();
          break;
        case "KeyD":
          p1MoveRight();
          break;
        case "ArrowUp":
          p2MoveUp();
          break;
        case "ArrowLeft":
          p2MoveLeft();
          break;
        case "ArrowRight":
          p2MoveRight();
          break;
        case "ArrowDown":
          p2MoveDown();
          break;
        default: {
          console.log("UNKNOWN", e);
        }
      }
    },
    { enabled: !loadingChance4 },
    [
      p1MoveDown,
      p1MoveUp,
      p1MoveLeft,
      p1MoveRight,
      p2MoveDown,
      p2MoveUp,
      p2MoveLeft,
      p2MoveRight,
      winner,
    ]
  );

  const {
    control: { setTitle, resize },
  } = useContext(AppContext);

  useEffect(() => {
    for (let row of p1Blocks) {
      for (let val of row) {
        if (val >= 2048) {
          setWinner("p1");
          return;
        }
      }
    }
  }, [p1Blocks, setWinner]);

  useEffect(() => {
    for (let row of p2Blocks) {
      for (let val of row) {
        if (val >= 2048) {
          setWinner("p2");
          return;
        }
      }
    }
  }, [p2Blocks, setWinner]);

  // update title
  useEffect(() => {
    setTitle({
      title: `P1: ${p1Score} ; P2: ${p2Score} ; ${winner === null} ${
        focused ? "" : "[click to continue]"
      }`,
    });
  }, [setTitle, p1Score, p2Score, focused, winner]);

  // set app size
  useEffect(() => {
    resize({ size: [480 + 64, 240] });
  }, [resize]);

  return (
    <div
      style={{ width: "100%", height: "100%", position: "relative" }}
      ref={ref}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      tabIndex={-1}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "stretch",
          height: "100%",
        }}
      >
        <div style={{ flex: 1, position: "relative" }}>
          {p1Blocks.map((row, ridx) =>
            row.map((col, cidx) => (
              <Block
                key={`${ridx}-${cidx}`}
                val={col}
                row={ridx}
                col={cidx}
                color={color}
              />
            ))
          )}
        </div>
        <div
          style={{
            width: 64,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ marginTop: 8 }}>P1: {p1Score}</div>
          <div style={{ marginTop: 8 }}>P2: {p2Score}</div>
          {winner !== undefined && (
            <div style={{ marginTop: 8 }}>
              {winner === "p1" ? "P1 Win!" : "P2 win!"}
            </div>
          )}
          <div>
            <button onClick={onFinish}>结束</button>
          </div>
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          {p2Blocks.map((row, ridx) =>
            row.map((col, cidx) => (
              <Block
                key={`${ridx}-${cidx}`}
                val={col}
                row={ridx}
                col={cidx}
                color={color}
              />
            ))
          )}
        </div>
      </div>

      {loadingChance4 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgb(200,200,200)",
            opacity: 0.8,
            fontSize: 32,
          }}
        >
          Loading
        </div>
      )}
    </div>
  );
};

export default RaceScore;
