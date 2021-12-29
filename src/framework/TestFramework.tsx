/**
 * Restrict Mode will run reducer twice;
 */

import React from "react";



interface State {
  data: string[];
}

const InitialState: State = { data: [] };

const Framework: React.FC<{}> = () => {
  const [{ data }, dispatch] = React.useReducer(reducer, InitialState);

  return (
    <div>
      {data.map((v) => (<div key={v}>{v}</div>))}
      <button
        onClick={() => {
          dispatch({
            type: "ADD",
            payload: Math.random().toString(),
          });
        }}
      >
        Add
      </button>
    </div>
  );
};

// 启动App
interface ActLaunchApp {
  type: "ADD";
  payload: string;
}

type Action = ActLaunchApp;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      const insId = action.payload;

      // it's not OK!
      // IDEA1: 修改了原有state,导致重复reducer
      state.data = [...state.data, insId];
      const result = { ...state };

      return result;

    // it's OK!
    // return {...state, apps: [...state.apps, insId]};

    default: {
      console.error("unknow action", action);
      return state;
    }
  }
}

export default Framework;
