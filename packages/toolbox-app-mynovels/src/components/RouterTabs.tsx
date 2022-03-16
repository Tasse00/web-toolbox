import {
  Box,
  Button,
  Center,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabProps,
  Tabs,
  Tag,
  useMultiStyleConfig,
  useTab,
} from "@chakra-ui/react";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout } from "toolbox-components";
import { usePages } from "../hooks";

export interface RouterTabsProps {
  tabs: { key?: string; path: string; text: string; selectText?: string }[];
}

const RouterTabs: React.FC<RouterTabsProps> = (props) => {
  const { pathname } = useLocation();
  const go = useNavigate();
  const pages = usePages();
  return (
    <Layout
      style={{ height: "100%", width: "100%" }}
      barPosition="bottom"
      bar={
        <Flex
          justify="space-around"
          borderTop={"1px solid rgba(220,220,220,0.5)"}
          pt={1}
          pb={1}
        >
          {props.tabs.map((tab) => {
            return (
              <Center
                onClick={() => go({ pathname: tab.path })}
                bg={pathname === tab.path ? "gray.200" : "gray.50"}
                borderRadius={12}
                h={16}
                w={16}
                key={tab.key === undefined ? tab.path : tab.key}
              >
                {tab.text}
              </Center>
            );
          })}
        </Flex>
      }
    >
      <Outlet />
    </Layout>
  );
};

export default RouterTabs;
