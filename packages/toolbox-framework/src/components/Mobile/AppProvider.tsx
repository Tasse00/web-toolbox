import React from "react";
import { AppContext } from "../AppContext";
import { AppRuntime, FrameworkContextValue } from "../Framework";
import AppBox from "./AppBox";

export const AppProvider: React.FC<
  {
    runtime: AppRuntime<any>;
  } & Omit<
    FrameworkContextValue,
    "apps" | "configs" | "launchApp" | "setFrameworkSize"
  >
> = ({
  runtime,
  terminateApp,
  resizeApp,
  moveApp,
  focusApp,
  setAppOpen,
  setAppInsTitle,
  size,
}) => {
  const insId = runtime.insId;

  const terminate = React.useCallback(
    () => terminateApp({ insId }),
    [insId, terminateApp]
  );

  const resize = React.useCallback(
    (opts: { size: [number, number] }) => resizeApp({ insId, size: opts.size }),
    [insId, resizeApp]
  );

  const move = React.useCallback(
    (opts: { position: [number, number] }) =>
      moveApp({ insId, position: opts.position }),
    [insId, moveApp]
  );

  const setOpen = React.useCallback(
    (opts: { open: boolean }) => setAppOpen({ insId, open: opts.open }),
    [insId, setAppOpen]
  );

  const focus = React.useCallback(() => {
    focusApp({ insId });
  }, [insId, focusApp]);

  const setTitle = React.useCallback(
    (opts: { title: string | null }) => {
      setAppInsTitle({ insId, title: opts.title });
    },
    [insId, setAppInsTitle]
  );

  const props = React.useMemo(
    () => ({
      runtime,
      control: {
        terminate,
        resize,
        move,
        setOpen,
        focus,
        setTitle,
      },
      container: {
        width: size[0],
        height: size[1],
      },
    }),
    [runtime, terminate, resize, move, setOpen, focus, setTitle, size]
  );

  return (
    <AppContext.Provider value={props}>
      <AppBox runtime={runtime} />
    </AppContext.Provider>
  );
};
