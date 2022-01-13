import React, { useContext, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { AppContext } from "../../framework/AppContext";
import { useAppConfig } from "../../framework/ConfigProvider";

const ROWS = 4;
const COLS = 4;

function randomGenerate(blocks: number[][], chance4: number) {
  const available: [number, number][] = [];
  blocks.forEach((rowValue, row) => {
    rowValue.forEach((colValue, col) => {
      if (blocks[row][col] === 0) {
        available.push([row, col]);
      }
    });
  });
  if (available.length > 0) {
    const idx = Math.floor(Math.random() * available.length);
    blocks[available[idx][0]][available[idx][1]] =
      Math.random() < chance4 ? 4 : 2;
  }
}

const DEFAULT_COLOR: Record<number, { background: string; text: string }> = {
  0: { background: "rgba(200,200,200,0.2)", text: "#73695F" },
  2: { background: "#E7DDD1", text: "#73695F" },
  4: { background: "#E6D9C2", text: "#73695F" },
  8: { background: "#EAAB75", text: "#FFFFFF" },
  16: { background: "#ED9060", text: "#FFFFFF" },
  32: { background: "#EE785C", text: "#FFFFFF" },
  64: { background: "#DF6644", text: "#FFFFFF" },
  128: { background: "#E9CE77", text: "#FFFFFF" },
  256: { background: "#E8CA54", text: "#FFFFFF" },
  512: { background: "#E8BF51", text: "#FFFFFF" },
  1024: { background: "#E6BB48", text: "#FFFFFF" },
  2048: { background: "#E5BD2F", text: "#FFFFFF" },
  4096: { background: "#E76267", text: "#FFFFFF" },
  8192: { background: "#EB4858", text: "#FFFFFF" },
  16384: { background: "#EE3D3C", text: "#FFFFFF" },
  32768: { background: "#68AFD5", text: "#FFFFFF" },
  65536: { background: "#5993C6", text: "#FFFFFF" },
  131072: { background: "#157EC9", text: "#FFFFFF" },
};

const Game2048App: React.FC<{}> = () => {
  const [blocks, setBlocks] = useState([
    [2, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 2],
  ]);
  const [score, setScore] = useState(0);
  const [focused, setFocused] = useState(false);

  const { loading: loadingChance4, value: chance4 } = useAppConfig(
    "chance4",
    0.5
  );
  const { value: color } = useAppConfig("color", DEFAULT_COLOR);

  const ref = useHotkeys<HTMLDivElement>(
    "up,left,right,down,w,a,s,d",
    (e: KeyboardEvent) => {
      let splitJobs: (blocks: number[][]) => {
        get: (idx: number) => number;
        set: (idx: number, value: number) => void;
        length: number;
      }[] = () => [];

      if (e.code === "KeyW" || e.code === "ArrowUp") {
        splitJobs = (blocks: number[][]) => {
          return Object.keys(new Array(COLS).fill(0)).map((col) => ({
            get: (idx) => blocks[idx][parseInt(col)],
            set: (idx, value) => (blocks[idx][parseInt(col)] = value),
            length: ROWS,
          }));
        };
      } else if (e.code === "KeyS" || e.code === "ArrowDown") {
        splitJobs = (blocks: number[][]) => {
          return Object.keys(new Array(COLS).fill(0)).map((col) => ({
            get: (idx) => blocks[ROWS - idx - 1][parseInt(col)],
            set: (idx, value) =>
              (blocks[ROWS - idx - 1][parseInt(col)] = value),
            length: ROWS,
          }));
        };
      } else if (e.code === "KeyA" || e.code === "ArrowLeft") {
        splitJobs = (blocks) => {
          return Object.keys(new Array(ROWS).fill(0)).map((row) => ({
            get: (idx) => blocks[parseInt(row)][idx],
            set: (idx, value) => (blocks[parseInt(row)][idx] = value),
            length: COLS,
          }));
        };
      } else if (e.code === "KeyD" || e.code === "ArrowRight") {
        splitJobs = (blocks) => {
          return Object.keys(new Array(ROWS).fill(0)).map((row) => ({
            get: (idx) => blocks[parseInt(row)][COLS - idx - 1],
            set: (idx, value) =>
              (blocks[parseInt(row)][COLS - idx - 1] = value),
            length: COLS,
          }));
        };
      }

      splitJobs(blocks).forEach(({ get, set, length }) => {
        const getNearestSameIdx = (idx: number) => {
          let nearest = -1;
          for (let nearestIdx = idx - 1; nearestIdx >= 0; nearestIdx--) {
            if (get(nearestIdx) === get(idx)) {
              nearest = nearestIdx;
            } else if (get(nearestIdx) !== 0) {
              break;
            }
          }
          return nearest;
        };

        const getFarestEmptyIdx = (idx: number) => {
          let farest = -1;
          for (let farestIdx = idx - 1; farestIdx >= 0; farestIdx--) {
            if (get(farestIdx) === 0) {
              farest = farestIdx;
            } else {
              break;
            }
          }
          return farest;
        };
        const indexUpdated: Record<number, boolean> = {};
        for (let idx = 0; idx < length; idx++) {
          const farestEmptyIdx = getFarestEmptyIdx(idx);
          const nearestSameIdx = getNearestSameIdx(idx);
          if (nearestSameIdx !== -1 && !indexUpdated[nearestSameIdx]) {
            const scoreToAdd = get(nearestSameIdx) * 2;
            setScore((score) => score + scoreToAdd);
            set(nearestSameIdx, scoreToAdd);
            set(idx, 0);
            indexUpdated[nearestSameIdx] = true;
          } else if (farestEmptyIdx !== -1) {
            set(farestEmptyIdx, get(idx));
            set(idx, 0);
          }
        }
      });
      randomGenerate(blocks, chance4);
      setBlocks([...blocks]);
    },
    { enabled: !loadingChance4 },
    [blocks, setBlocks, chance4]
  );

  const {
    control: { setTitle, resize },
  } = useContext(AppContext);
  // update title
  useEffect(() => {
    setTitle({
      title: `${score} points ${focused ? "" : "[click to continue]"}`,
    });
  }, [setTitle, score, focused]);

  // set app size
  useEffect(() => {
    resize({ size: [240, 240] });
  }, [resize]);

  return (
    <div
      ref={ref}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      tabIndex={-1}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {blocks.map((row, ridx) =>
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

const Block: React.FC<{
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

export default Game2048App;
