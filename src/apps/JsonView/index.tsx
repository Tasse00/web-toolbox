import React, { useEffect } from "react";
import ReactJson from "react-json-view";

export const JsonViewApp: React.FC<{}> = () => {
  const [value, setValue] = React.useState("");
  const [result, setResult] = React.useState<any>(undefined);
  const [error, setError] = React.useState<string>("");
  const timeoutHandler = React.useRef<null | NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutHandler.current) {
      clearTimeout(timeoutHandler.current);
      timeoutHandler.current = null;
    }

    timeoutHandler.current = setTimeout(() => {
      try {
        const result = JSON.parse(value);
        setError("");
        setResult(result);
      } catch (err: any) {
        setError(err.toString());
        setResult(undefined);
      }
      timeoutHandler.current = null;
    }, 500);
  }, [value]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <div style={{ flex: 1 }}>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        {error && <div style={{ color: "red" }}>Invalid Input: {error}</div>}
        {result !== undefined && <ReactJson src={result} />}
      </div>
    </div>
  );
};
