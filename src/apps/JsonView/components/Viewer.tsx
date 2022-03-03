import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Input, Radio, Typography } from "antd";
import RAny from "./RAny";
import { AsyncTaskQueueExecutor } from "../utils/AsyncTaskQueueExecutor";
import { Logger } from "../../../common/utils/logger";
import { useViewerContext, ViewerContext } from "../contexts/ViewerContext";
import { AsyncTaskQueueContext } from "../contexts/AsyncQueueQueueContext";
import jsonpath from "jsonpath";

const logger = new Logger({ name: "Viewer" });

const Viewer: React.FC<{
  value: string;
  style?: React.CSSProperties;
}> = ({ value, style }) => {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    try {
      logger.log("start parse");
      const res = JSON.parse(value);
      logger.log("end parse");
      setResult(res);
    } catch (err) {
      // @ts-ignore
      setError(err);
    }
  }, [value]);

  const asyncTaskQueueContextState = useMemo(
    () => ({
      executor: new AsyncTaskQueueExecutor(),
    }),
    []
  );

  // useEffect(() => {
  //   console.time("Async Render");
  //   return () => console.timeEnd("Async Render");
  // }, []);

  const {
    value: viewerContextState,
    expandShallowerThan,
    collapseDeeperThan,
    setAsyncRender,
  } = useViewerContext();

  const [jp, setJp] = useState("$");
  const [jpResult, setJpResult] = useState<any[]>([]);

  useEffect(() => {
    try {
      const res = jsonpath.query(result, jp);
      setJpResult(res);
    } catch (err) {
      console.log(err);
    }
  }, [jp, result]);

  if (value === "") {
    return (
      <Card style={style}>
        <Alert type="info" message={"There is no input."} />
      </Card>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        ...style,
      }}
    >
      <Card
        bodyStyle={{
          padding: 4,
        }}
      >
        <Input.Search
          placeholder="enter jsonpath to filter data, default si '$'"
          onSearch={(v) => {
            if (v !== "") {
              setJp(v);
            } else setJp("$");
          }}
        />
      </Card>

      <div style={{ flex: 1, overflow: "auto", padding: 8 }}>
        {error ? (
          <Card style={style}>
            <Alert type="error" message={error.message} />
          </Card>
        ) : (
          jpResult.map((res, idx) => (
            <Card
              key={idx}
              size="small"
              style={{ marginTop: 4, marginBottom: 4 }}
            >
              <AsyncTaskQueueContext.Provider
                value={asyncTaskQueueContextState}
              >
                <ViewerContext.Provider value={viewerContextState}>
                  <RAny v={res} depth={0} />
                </ViewerContext.Provider>
              </AsyncTaskQueueContext.Provider>
            </Card>
          ))
        )}
      </div>

      <Card
        bodyStyle={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: 4,
          columnGap: 8,
        }}
      >
        <div>
          <Typography.Text>Render:</Typography.Text>
          <Radio.Group
            size="small"
            value={JSON.stringify(viewerContextState.asyncRender)}
            onChange={(e) => setAsyncRender(JSON.parse(e.target.value))}
          >
            <Radio.Button value={"true"}>Async</Radio.Button>
            <Radio.Button value={"false"}>Sync</Radio.Button>
          </Radio.Group>
        </div>
        {/* <Button size="small" onClick={() => setCollapsed((v) => !v)}>
          {viewerContextState.collapsed ? "Expand All" : "Collapse All"}
        </Button> */}

        <Input.Search
          size="small"
          type="number"
          placeholder="deeper after"
          enterButton="Collapse"
          style={{ width: 160 }}
          onSearch={(v) => collapseDeeperThan(parseInt(v))}
        />

        <Input.Search
          size="small"
          type="number"
          placeholder="shallower before"
          enterButton="Shallow"
          style={{ width: 160 }}
          onSearch={(v) => expandShallowerThan(parseInt(v))}
        />
      </Card>
    </div>
  );
};

export default Viewer;
