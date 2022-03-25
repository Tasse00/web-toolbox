import {
  Box,
  Button,
  ChakraProvider,
  Divider,
  Flex,
  Text,
} from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
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

  const [fullHeight, setFullHeight] = useState(window.innerHeight);
  // 问题：移动端 100vh 会包行工具栏
  // 解决：通过innerHeight设置，并监听scroll事件来更新高度
  useEffect(() => {
    const setHeight = () => setFullHeight(window.innerHeight);
    document.addEventListener("scroll", setHeight);
    return () => document.removeEventListener("scroll", setHeight);
  }, []);

  return (
    <ChakraProvider>
      <Box w="full" h={fullHeight}>
        {!openedApp && (
          <Box w="full" h="full" overflow="auto">
            {apps.length > 0 && (
              <>
                <Text>Running</Text>
                <Divider />
                <Flex direction="column" align="stretch">
                  {apps.map((app) => (
                    <Flex
                      key={app.insId}
                      justify="space-between"
                      align="center"
                      borderRadius="lg"
                      borderColor="gray.200"
                      borderWidth={1}
                      p={2}
                      m={2}
                    >
                      <Box>{app.title || app.config.title}</Box>
                      <Button
                        onClick={() =>
                          setAppOpen({
                            insId: app.insId,
                            open: true,
                          })
                        }
                      >
                        Switch
                      </Button>
                    </Flex>
                  ))}
                </Flex>
              </>
            )}
            <Text>Open</Text>
            <Flex direction="column" align="stretch">
              {configs.map((conf) => (
                <Flex
                  key={conf.appId}
                  justify="space-between"
                  align="center"
                  borderRadius="lg"
                  borderColor="gray.200"
                  borderWidth={1}
                  p={2}
                  m={2}
                >
                  <Box>{conf.title}</Box>
                  <Button onClick={() => onLaunch(conf)}>Launch</Button>
                </Flex>
              ))}
            </Flex>
          </Box>
        )}

        {elems}
        <GlobalControl />
      </Box>
    </ChakraProvider>
  );
};
