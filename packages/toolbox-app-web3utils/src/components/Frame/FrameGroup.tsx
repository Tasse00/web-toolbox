import React from "react";
import { Layout } from "toolbox-components";
import Frame from "./Frame";
import FrameTabs from "./FrameTabs";

const FrameGroup: React.FC<{
  initialFrames?: FrameConfig[];
}> = ({ initialFrames = [] }) => {
  const [{ frames, currFrameId }, dispatch] = React.useReducer(reducer, {
    frames: initialFrames,
    currFrameId: initialFrames.length > 0 ? initialFrames[0].id : "",
  });

  const switchFrame = React.useCallback(
    (id: string) => dispatch({ type: "SWITCH_FRAME", payload: { id } }),
    [dispatch]
  );

  const createFrame = React.useCallback(
    (
      config: {
        id?: string;
        title: string;
        component: React.ReactElement;
        closable?: boolean;
      },
      autoSwith?: boolean
    ) => dispatch({ type: "CREATE_FRAME", payload: { config, autoSwith } }),
    [dispatch]
  );

  const closeFrame = React.useCallback(
    (id: string) => dispatch({ type: "CLOSE_FRAME", payload: { id } }),
    [dispatch]
  );

  const setFrameTitle = React.useCallback(
    (id: string, title: string) =>
      dispatch({ type: "SET_FRAME_TITLE", payload: { id, title } }),
    [dispatch]
  );

  const currFrame = React.useMemo(() => {
    return frames.find((f) => f.id === currFrameId) || null;
  }, [frames, currFrameId]);

  return (
    <FrameGroupContext.Provider
      value={{
        frames,
        currFrame,
        switchFrame,
        closeFrame,
        createFrame,
        setFrameTitle,
      }}
    >
      <Layout style={{ width: "100%", height: "100%" }} bar={<FrameTabs />}>
        <div style={{ display: "flex", minHeight: "100%" }}>
          {frames.map((frame) => (
            <div
              key={frame.id}
              style={{
                width: currFrameId === frame.id ? "100%" : 0,
                overflow: "hidden",
              }}
            >
              <Frame config={frame} />
            </div>
          ))}
        </div>
      </Layout>
    </FrameGroupContext.Provider>
  );
};

export interface FrameGroupContextValue {
  // 切换当前的Frame
  switchFrame: (id: string) => void;
  // 创建Frame
  createFrame: (
    frameConfig: {
      id?: string;
      title: string;
      component: React.ReactElement;
      closable?: boolean;
    },
    autoSwith?: boolean
  ) => void;
  // 关闭Frame
  closeFrame: (id: string) => void;
  setFrameTitle: (id: string, title: string) => void;
  // 所有的Frame
  frames: FrameConfig[];
  currFrame: FrameConfig | null;
}
export const FrameGroupContext = React.createContext<FrameGroupContextValue>({
  switchFrame: () => {},
  createFrame: () => {},
  closeFrame: () => {},
  setFrameTitle: () => {},
  frames: [],
  currFrame: null,
});

export interface FrameConfig {
  id: string;
  title: string;
  closable?: boolean;
  component: React.ReactElement;
}

function generateFrameId(): string {
  return Math.random().toString();
}

interface State {
  frames: FrameConfig[];
  currFrameId: string;
}

interface ActCreateFrame {
  type: "CREATE_FRAME";
  payload: {
    config: {
      id?: string;
      title: string;
      component: React.ReactElement;
      closable?: boolean;
    };
    autoSwith?: boolean;
  };
}
interface ActCloseFrame {
  type: "CLOSE_FRAME";
  payload: {
    id: string;
  };
}

interface ActSetFrameTitle {
  type: "SET_FRAME_TITLE";
  payload: {
    id: string;
    title: string;
  };
}

interface ActSwitchFrame {
  type: "SWITCH_FRAME";
  payload: {
    id: string;
  };
}

type Action =
  | ActCreateFrame
  | ActCloseFrame
  | ActSetFrameTitle
  | ActSwitchFrame;

function reducer(state: State, action: Action): State {
  const { frames, currFrameId } = state;
  switch (action.type) {
    case "CLOSE_FRAME": {
      const idx = frames.findIndex((f) => f.id === action.payload.id);

      if (idx > -1) {
        if (currFrameId === frames[idx].id) {
          if (idx < frames.length - 1) {
            state.currFrameId = frames[idx + 1].id;
          } else if (idx > 0) {
            state.currFrameId = frames[idx - 1].id;
          } else {
            state.currFrameId = "";
          }
        }
        frames.splice(idx, 1);
      }
      return {
        ...state,
        frames: [...frames],
      };
    }
    case "CREATE_FRAME": {
      const id = action.payload.config.id || generateFrameId();
      return {
        ...state,
        frames: [...frames, { ...action.payload.config, id }],
        currFrameId: action.payload.autoSwith ? id : state.currFrameId,
      };
    }
    case "SET_FRAME_TITLE": {
      const idx = frames.findIndex((f) => f.id === action.payload.id);
      if (idx > -1) {
        frames[idx] = {
          ...frames[idx],
          title: action.payload.title,
        };
        return {
          ...state,
          frames: [...frames],
        };
      }
      return state;
    }
    case "SWITCH_FRAME": {
      return {
        ...state,
        currFrameId: action.payload.id,
      };
    }
  }
}

export default FrameGroup;
