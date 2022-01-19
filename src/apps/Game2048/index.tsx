import React, { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../framework/AppContext";
import RaceScore from "./RaceScore";
import Single from "./Single";

// 1. Choost Mode: single, challenge
// 2. Start Game

type GameMode = "single" | "2players-race-time" | "2players-race-score";

const Game2048App: React.FC<{}> = () => {
  const [mode, setMode] = useState<GameMode | null>(null);
  const {
    control: { setTitle },
  } = useContext(AppContext);
  const onFinish = useCallback(() => setMode(null), []);
  useEffect(() => {
    if (mode === null) {
      setTitle({ title: "2048" });
    }
  }, [mode, setTitle]);
  switch (mode) {
    case "single":
      return <Single onFinish={onFinish} />;
    case "2players-race-score":
      return <RaceScore onFinish={onFinish} />;
    case "2players-race-time":
      return <div>2prt</div>;
    case null:
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button style={ButtonStyle} onClick={() => setMode("single")}>
            {" "}
            Single{" "}
          </button>
          <button
            style={ButtonStyle}
            onClick={() => setMode("2players-race-time")}
          >
            {" "}
            2P Race Time{" "}
          </button>
          <button
            style={ButtonStyle}
            onClick={() => setMode("2players-race-score")}
          >
            {" "}
            2P Race Score{" "}
          </button>
        </div>
      );
  }
};
const ButtonStyle: React.CSSProperties = {
  width: 120,
  margin: 16,
};
export default Game2048App;
