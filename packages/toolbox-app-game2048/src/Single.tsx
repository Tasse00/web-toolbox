import React, { useContext, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { AppContext } from "toolbox-framework";
import { useAppConfig } from "toolbox-framework";
import { Block } from "./Block";
import { use2048 } from "./hooks";
import { DEFAULT_COLOR, DEFAULT_CHANCE4 } from "./utils";

const Single: React.FC<{
  onFinish: () => any;
}> = ({ onFinish }) => {
  const [focused, setFocused] = useState(false);

  const { loading: loadingChance4, value: chance4 } = useAppConfig(
    "chance4",
    DEFAULT_CHANCE4
  );
  const { value: color } = useAppConfig("color", DEFAULT_COLOR);

  const { blocks, lost, score, moveDown, moveLeft, moveRight, moveUp } =
    use2048({
      chance4,
    });

  const ref = useHotkeys<HTMLDivElement>(
    "up,left,right,down,w,a,s,d",
    (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") {
        moveUp();
      } else if (e.code === "KeyS" || e.code === "ArrowDown") {
        moveDown();
      } else if (e.code === "KeyA" || e.code === "ArrowLeft") {
        moveLeft();
      } else if (e.code === "KeyD" || e.code === "ArrowRight") {
        moveRight();
      }
    },
    { enabled: !loadingChance4 },
    [moveLeft, moveDown, moveLeft, moveRight]
  );

  const {
    control: { setTitle, resize },
  } = useContext(AppContext);
  // update title
  useEffect(() => {
    setTitle({
      title: `${score} points ${focused ? "" : "[click to continue]"}`,
    });
  }, [setTitle, score, focused, lost]);

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

      {lost && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "rgb(200,200,200)",
            opacity: 0.8,
            fontSize: 32,
          }}
        >
          Lost!
          <button onClick={onFinish}>Ok</button>
        </div>
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

export default Single;
