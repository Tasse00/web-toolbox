import React, { useContext } from "react";
import { AsyncTaskQueueExecutor } from "../utils/AsyncTaskQueueExecutor";

export interface AsyncTaskQueueContextState {
  executor: AsyncTaskQueueExecutor;
}

export const AsyncTaskQueueContext =
  React.createContext<AsyncTaskQueueContextState>({
    executor: new AsyncTaskQueueExecutor(),
  });

export function useAsyncTaskQueueContextState(): AsyncTaskQueueContextState {
  return useContext(AsyncTaskQueueContext);
}
