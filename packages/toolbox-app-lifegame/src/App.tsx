import {
  Button,
  Checkbox,
  Col,
  InputNumber,
  Row,
  Select,
  Slider,
  Typography,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDrag, useDragLayer, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useInterval } from "toolbox-framework";

interface Props {}
type BoundaryType = "loop" | "limit-dead" | "limit-alive";
const LifeGame: React.FC<Props> = () => {
  const [boundaryType, setBoundaryType] = useState<BoundaryType>("limit-dead");
  const [auto, setAuto] = useState(false);
  const [step, setStep] = useState(1000);
  const [scale, setScale] = useState(1);
  const [worldSize, setWorldSize] = useState(32);
  const [worldAlivePercent, setWorldAlivePercent] = useState(0.1);

  // const {
  // control: { resize },
  // } = useContext(AppContext);
  // useEffect(() => resize({ size: [800, 600] }), [resize]);
  // 性能优化: 组件化、超界卸载、
  const [world, setWorld] = useState<boolean[][]>([
    [false, false, true],
    [false, true, true],
    [false, true, false],
  ]);

  const resetWorld = useCallback(() => {
    const worlds = new Array(worldSize)
      .fill(0)
      .map(() => new Array(worldSize).fill(false));
    console.log(worlds);
    let count = Math.floor(worldAlivePercent * worldSize * worldSize);
    const available = new Array(worldSize * worldSize)
      .fill(0)
      .map((_, idx) => idx);
    while (count > 0) {
      const idx = Math.floor(Math.random() * available.length);
      const row = Math.floor(available[idx] / worldSize);
      const col = available[idx] % worldSize;
      available.splice(idx, 1);
      worlds[row][col] = true;
      count -= 1;
    }
    setWorld(worlds);
  }, [setWorld, worldSize, worldAlivePercent]);
  const [worldOffset, setWorldOffset] = useState<[number, number]>([0, 0]);

  const willBeAlive = (alivedNearBys: number, origin: boolean) => {
    if (alivedNearBys === 2) return origin;
    else if (alivedNearBys === 3) return true;
    else return false;
  };

  const iter = useCallback(() => {
    setWorld((world) => {
      const get = (r: number, c: number) => {
        const ROWS = world.length;

        while (r < 0 || r >= ROWS) {
          if (boundaryType !== "loop") return boundaryType === "limit-alive";
          else if (r < 0) r += ROWS;
          else if (r >= ROWS) r = c % ROWS;
        }
        const COLS = world[r].length;

        while (c < 0 || c >= COLS) {
          if (boundaryType !== "loop") return boundaryType === "limit-alive";
          else if (c < 0) c += COLS;
          else if (c >= COLS) c = c % COLS;
        }
        return world[r][c];
      };
      for (let row = 0; row < world.length; row++) {
        for (let col = 0; col < world[row].length; col++) {
          const aliveNears = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, 0],
            [1, 0],
            [-1, 1],
            [0, 1],
            [1, 1],
          ]
            .map(([nr, nc]) => get(row + nr, col + nc))
            .filter((v) => v).length;
          world[row][col] = willBeAlive(aliveNears, world[row][col]);
        }
      }
      return [...world];
    });
  }, [setWorld, boundaryType]);

  const [, dragRef, previewRef] = useDrag(
    () => ({
      type: "life-game-move",
      item: "world",
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    []
  );
  const [, dropRef] = useDrop(
    () => ({
      accept: "life-game-move",
      drop(item, monitor) {
        const offset = monitor.getDifferenceFromInitialOffset() || {
          x: 0,
          y: 0,
        };
        setWorldOffset((v) => [v[0] + offset.x, v[1] + offset.y]);
      },
    }),
    [setWorldOffset]
  );
  const { dragging, offset } = useDragLayer((monitor) => ({
    dragging:
      monitor.getItemType() === "life-game-move" && monitor.isDragging(),
    offset: monitor.getDifferenceFromInitialOffset() || { x: 0, y: 0 },
  }));
  // console.log(offset);
  useEffect(() => {
    previewRef(getEmptyImage(), { captureDraggingState: true });
  }, [previewRef]);

  const size = 8 * scale;
  const top = worldOffset[1] + (dragging ? offset.y : 0);
  const left = worldOffset[0] + (dragging ? offset.x : 0);

  useInterval(iter, step, { enabled: auto });
  return (
    <div
      ref={dropRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        ref={dragRef}
        style={{ background: "#FFFFFF", flex: 1, position: "relative" }}
      >
        <div
          style={{
            position: "absolute",
            top,
            left,
            // height: world.length * size,
            // width: world[0].length * size,
            right: 0,
            bottom: 0,
          }}
        >
          {world.map((rowValue, row) =>
            rowValue.map((colValue, col) => (
              <div
                key={`${row}-${col}`}
                style={{
                  position: "absolute",
                  boxSizing: "border-box",
                  background: colValue ? "black" : "white",
                  border: "1px solid rgba(200,200,200,0.4)",
                  width: size,
                  height: size,
                  top: row * size,
                  left: col * size,
                }}
              />
            ))
          )}
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            color: "rgb(150,150,150)",
          }}
        >
          <div>Auto Iter: {auto ? "true" : "false"}</div>
          <div>Boundary: {boundaryType}</div>
          <div>Gap: {step}ms </div>
          <div>Zoom: X{scale}</div>
        </div>
      </div>
      <Row align="middle" gutter={12}>
        <Col>
          <Select
            style={{ width: 140 }}
            options={[
              { value: "loop", label: "Loop Boundary" },
              { value: "limit-dead", label: "Dead Bondary" },
              { value: "limit-alive", label: "Alive boundary" },
            ]}
            value={boundaryType}
            onChange={(e) => {
              setBoundaryType(e as BoundaryType);
            }}
          />
        </Col>
        <Col>
          <Checkbox checked={auto} onChange={(e) => setAuto(e.target.checked)}>
            <Typography.Text>Auto</Typography.Text>
          </Checkbox>
        </Col>
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <Typography.Text>Gap</Typography.Text>
            </Col>
            <Col>
              <Slider
                style={{ width: 200 }}
                step={50}
                min={50}
                max={2000}
                value={step}
                onChange={setStep}
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <Button onClick={iter} disabled={auto}>
            Iter
          </Button>
        </Col>
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <Typography.Text>Zoom</Typography.Text>
            </Col>
            <Col>
              <Slider
                style={{ width: 200 }}
                step={0.1}
                min={0.1}
                max={10}
                value={scale}
                onChange={setScale}
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <Row align="middle">
            <Col>
              <InputNumber
                placeholder="world size"
                value={worldSize}
                onChange={setWorldSize}
              />
            </Col>
            <Col>
              <InputNumber
                placeholder="world size"
                min={0}
                max={1}
                step={0.01}
                value={worldAlivePercent}
                onChange={setWorldAlivePercent}
              />
            </Col>
            <Col>
              <Button onClick={resetWorld}>Reset</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default LifeGame;
