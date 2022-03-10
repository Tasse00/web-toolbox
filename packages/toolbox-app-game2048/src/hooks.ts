import { useCallback, useReducer } from "react";
import { checkIsLost, COLS, randomGenerate, ROWS } from "./utils";

export type SplitJobs = (blocks: number[][]) => {
  get: (idx: number) => number;
  set: (idx: number, value: number) => void;
  length: number;
}[];

export interface Use2048Options {
  chance4: number;
}
export interface Use2048Result {
  blocks: number[][];
  score: number;
  lost: boolean;
  moveLeft: () => void;
  moveRight: () => void;
  moveUp: () => void;
  moveDown: () => void;
}
export function use2048({ chance4 }: Use2048Options): Use2048Result {
  const [{ blocks, score, lost }, dispatch] = useReducer(reducer, {
    blocks: [
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 2],
    ],
    score: 0,
    lost: false,
    chance4,
  });

  const moveUp = useCallback(() => dispatch({ type: "move-up" }), [dispatch]);
  const moveDown = useCallback(
    () => dispatch({ type: "move-down" }),
    [dispatch]
  );
  const moveLeft = useCallback(
    () => dispatch({ type: "move-left" }),
    [dispatch]
  );
  const moveRight = useCallback(
    () => dispatch({ type: "move-right" }),
    [dispatch]
  );
  return {
    blocks,
    lost,
    score,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
  };
}

interface State {
  blocks: number[][];
  score: number;
  lost: boolean;
  chance4: number;
}

interface ActMoveLeft {
  type: "move-left";
}
interface ActMoveRight {
  type: "move-right";
}
interface ActMoveUp {
  type: "move-up";
}
interface ActMoveDown {
  type: "move-down";
}
interface ActSetChance4 {
  type: "set-chance4";
  payload: number;
}
type Actions =
  | ActMoveLeft
  | ActMoveDown
  | ActMoveRight
  | ActMoveUp
  | ActSetChance4;
function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case "move-down": {
      const nextState = {
        ...state,
        blocks: state.blocks.map((row) => row.map((col) => col)),
      };

      updateState(nextState, (blocks) =>
        Object.keys(new Array(COLS).fill(0)).map((col) => ({
          get: (idx) => blocks[ROWS - idx - 1][parseInt(col)],
          set: (idx, value) => (blocks[ROWS - idx - 1][parseInt(col)] = value),
          length: ROWS,
        }))
      );
      return nextState;
    }
    case "move-up": {
      const nextState = {
        ...state,
        blocks: state.blocks.map((row) => row.map((col) => col)),
      };

      updateState(nextState, (blocks) =>
        Object.keys(new Array(COLS).fill(0)).map((col) => ({
          get: (idx) => blocks[idx][parseInt(col)],
          set: (idx, value) => (blocks[idx][parseInt(col)] = value),
          length: ROWS,
        }))
      );
      return nextState;
    }
    case "move-left": {
      const nextState = {
        ...state,
        blocks: state.blocks.map((row) => row.map((col) => col)),
      };

      updateState(nextState, (blocks) =>
        Object.keys(new Array(ROWS).fill(0)).map((row) => ({
          get: (idx) => blocks[parseInt(row)][idx],
          set: (idx, value) => (blocks[parseInt(row)][idx] = value),
          length: COLS,
        }))
      );
      return nextState;
    }
    case "move-right": {
      const nextState = {
        ...state,
        blocks: state.blocks.map((row) => row.map((col) => col)),
      };

      updateState(nextState, (blocks) =>
        Object.keys(new Array(ROWS).fill(0)).map((row) => ({
          get: (idx) => blocks[parseInt(row)][COLS - idx - 1],
          set: (idx, value) => (blocks[parseInt(row)][COLS - idx - 1] = value),
          length: COLS,
        }))
      );
      return nextState;
    }
    case "set-chance4":
      return { ...state, chance4: action.payload };
    default: {
      console.warn("unknown action: " + JSON.stringify(action));
      return state;
    }
  }
}
const updateState = (state: State, splitJobs: SplitJobs) => {
  splitJobs(state.blocks).forEach(({ get, set, length }) => {
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
        state.score += scoreToAdd;
        set(nearestSameIdx, scoreToAdd);
        set(idx, 0);
        indexUpdated[nearestSameIdx] = true;
      } else if (farestEmptyIdx !== -1) {
        set(farestEmptyIdx, get(idx));
        set(idx, 0);
      }
    }
  });
  randomGenerate(state.blocks, state.chance4);

  if (checkIsLost(state.blocks)) {
    state.lost = true;
  }
};
