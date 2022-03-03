import React, { useCallback, useContext, useMemo, useState } from "react";

export interface ViewerContextState {
  // collapsed: boolean;
  collapseDepth: number;
  expandDepth: number;
  asyncRender: boolean;
}

export const ViewerContext = React.createContext<ViewerContextState>({
  collapseDepth: 9999999,
  expandDepth: 9999999,
  asyncRender: true,
});

export function useViewerContext(): {
  value: ViewerContextState;

  // setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  collapseDeeperThan: (n: number) => void;
  expandShallowerThan: (n: number) => void;
  setAsyncRender: React.Dispatch<React.SetStateAction<boolean>>;
} {
  const [collapseDepth, setCollapseDepth] = useState(9999999);
  const [expandDepth, setExpandDepth] = useState(9999999);
  const [asyncRender, setAsyncRender] = useState(true);

  const value = useMemo(
    () => ({ collapseDepth, expandDepth, asyncRender }),
    [expandDepth, collapseDepth, asyncRender]
  );
  const collapseDeeperThan = useCallback(
    (depth: number) => {
      if (expandDepth > depth) {
        setExpandDepth(depth);
      }
      setCollapseDepth(depth);
    },
    [expandDepth]
  );
  const expandShallowerThan = useCallback(
    (depth: number) => {
      if (collapseDepth < depth) {
        setCollapseDepth(depth);
      }
      setExpandDepth(depth);
    },
    [collapseDepth]
  );
  return {
    value,
    collapseDeeperThan,
    expandShallowerThan,
    setAsyncRender,
    // setCollapsed,
  };
}

export function useViewerContextState(): ViewerContextState {
  return useContext(ViewerContext);
}
