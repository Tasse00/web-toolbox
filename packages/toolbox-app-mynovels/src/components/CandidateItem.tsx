import useRequest from "@ahooksjs/use-request";
import { DownloadIcon, ViewIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { usePages } from "../hooks";
import { ExternalSiteNovel, useServices } from "../providers/ServiceProvider";
import { Source } from "./Source";
import { SyncStatus } from "./SyncStatus";

export const CandidateItem: React.FC<{} & ExternalSiteNovel> = ({
  source,
  title,
  author,
  url,
  local,
}) => {
  // title ------------ `source`
  // author ------------ `Sync | status`
  const { startSyncNovel } = useServices();
  const {
    run: startSync,
    data,
    loading: startingSync,
  } = useRequest(
    async () => {
      return await startSyncNovel(source, url);
    },
    {
      refreshDeps: [startSyncNovel, source, url],
      manual: true,
    }
  );
  const navigate = useNavigate();

  const pages = usePages();

  const novel = local || data;
  return (
    <Flex direction="column" gap={3} bg={"gray.50"} p={3} borderRadius="lg">
      <Flex justify="space-between" align="center">
        <Text fontSize="lg">{title}</Text>
        <Source source={source} />
      </Flex>
      <Flex justify="space-between" align="center">
        <Text color="gray.500">{author}</Text>
        {novel ? (
          <IconButton
            aria-label="view"
            icon={<ViewIcon />}
            onClick={() => {
              pages.Novel.go(navigate, { id: novel.id.toString() });
            }}
          />
        ) : (
          <IconButton
            aria-label="sync"
            colorScheme="teal"
            isLoading={startingSync}
            onClick={startSync}
            icon={<DownloadIcon />}
          />
        )}
      </Flex>
    </Flex>
  );
};
