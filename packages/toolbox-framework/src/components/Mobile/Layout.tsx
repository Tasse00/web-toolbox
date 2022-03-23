import { Box, ChakraProvider } from "@chakra-ui/react";
import React, { useCallback, useContext } from "react";
import { useCachedArrayRender } from "../../common/hooks/render";
import AppLaunchItem from "../AppLaunchItem";
import { AppConfig, FrameworkContext } from "../Framework";
import { AppProvider } from "./AppProvider";
import GlobalControl from "./GlobalControl";

interface Props {}

export const Mobile: React.FC<Props> = (props) => {
  const {
    apps,
    configs,
    launchApp,
    terminateApp,
    resizeApp,
    moveApp,
    setAppInsTitle,
    setAppOpen,
    focusApp,
    size,
  } = useContext(FrameworkContext);

  const openedApp = apps.find((app) => app.open);

  const zIndexTop = Math.max(0, ...apps.map((app) => app.order));

  const onLaunch = useCallback(
    (config: AppConfig) => {
      setTimeout(() => {
        launchApp({
          appId: config.appId,
          props: { ...config.defaultProps },
          insId: Math.random().toString(),
        });
      }, 100);
    },
    [launchApp]
  );

  const elems = useCachedArrayRender(
    AppProvider,
    apps.map((app) => ({
      key: app.insId,
      props: {
        runtime: app,
        terminateApp,
        resizeApp,
        setAppOpen,
        moveApp,
        focusApp,
        setAppInsTitle,
        size,
      },
    }))
  );

  return (
    <ChakraProvider>
      <Box w="100vw" h="100vh">
        {elems}
        {/* {openedApp ? (
          elems
        ) : (
          <Box zIndex={zIndexTop}>
            {configs.map((conf) => (
              <AppLaunchItem
                key={conf.appId}
                config={conf}
                style={{
                  border: "2px solid rgb(100,100,100, 0.5)",
                }}
                onLaunch={() => onLaunch(conf)}
              />
            ))}
          </Box>
        )} */}
        <GlobalControl />
      </Box>
    </ChakraProvider>
  );
};
