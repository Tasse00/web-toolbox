import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  List,
  ListItem,
  Skeleton,
  Spacer,
  Tag,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { openNewTab } from "toolbox-utils";
import { usePages } from "../hooks";
import { ChevronLeftIcon, DownloadIcon, RepeatIcon } from "@chakra-ui/icons";
import { SyncStatus } from "../components/SyncStatus";
import FlexPanel from "../components/FlexPanel";
import { SyncStatusEnum, useServices } from "../providers/ServiceProvider";
import useRequest from "@ahooksjs/use-request";

// Novel[meta+status]、Chapter[mete+raw]
// Chapter 翻页应该按照 Chapter[meta] 顺序，未获取的要提示
// 服务端同步任务
const NovelPage: React.FC<{}> = () => {
  const [searchParams] = useSearchParams({ id: "0" });
  const id = parseInt(searchParams.get("id") || "0");
  const { fetchSyncNovel, startSyncNovel } = useServices();
  const { data, loading, error, run } = useRequest(
    async () => {
      return await fetchSyncNovel(id);
    },
    { refreshDeps: [id, fetchSyncNovel] }
  );

  const pages = usePages();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState("");

  const { run: startSync, loading: startingSync } = useRequest(
    async () => {
      if (data) {
        await startSyncNovel(data.source, data.url);
        await run();
      }
    },
    {
      refreshDeps: [id, data, startSyncNovel, run],
      manual: true,
    }
  );

  return (
    <Flex h="100%" direction="column">
      <Flex m={2} justify="space-between">
        <IconButton
          aria-label="Back"
          icon={<ChevronLeftIcon />}
          onClick={() => navigate(-1)}
        />
        <HStack>
          <IconButton
            aria-label="sync"
            isLoading={startingSync}
            onClick={startSync}
            icon={<DownloadIcon />}
          />
          <IconButton
            isLoading={loading}
            aria-label="refresh"
            icon={<RepeatIcon />}
            onClick={run}
          />
        </HStack>
      </Flex>

      <FlexPanel m={2} mt={0} align="stretch">
        {loading && <Skeleton width="100%" h={16} />}
        {!loading && data && (
          <>
            <Image width={90} height={120} src={data.img} />
            <Flex flex={1} direction="column">
              <Flex>
                <Flex direction="column">
                  <Text align="left" fontWeight="bold">
                    {data.title}
                  </Text>

                  <Text align="left" color="gray.500" isTruncated>
                    {data.author}
                  </Text>
                </Flex>
                <Spacer />
                <Box>
                  <Tag colorScheme="cyan">{data.source}</Tag>
                </Box>
              </Flex>

              <Spacer />

              <Flex justify="space-between" align="center" wrap="wrap">
                <SyncStatus novel={data} />
                <Button size="sm" onClick={() => openNewTab({ url: data.url })}>
                  View Source
                </Button>
              </Flex>
            </Flex>
          </>
        )}

        {!loading && error && (
          <Center h="full" w="full">
            <Text color="gray.500">something is wrong.</Text>
          </Center>
        )}
      </FlexPanel>

      <Flex m={2} mt={0} justify="center" align="center" columnGap={2}>
        <InputGroup size="sm">
          <Input
            disabled={!!(loading || error)}
            textAlign="center"
            placeholder="Search in menu 🔍"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </InputGroup>
      </Flex>

      <FlexPanel
        m={2}
        mt={0}
        p={0}
        direction="column"
        align="stretch"
        flex={1}
        overflow="hidden"
      >
        {loading && (
          <Flex direction="column">
            <Skeleton m={2} h={12} />
            <Skeleton m={2} h={12} />
            <Skeleton m={2} h={12} />
          </Flex>
        )}
        {!loading && data && (
          <List w="100%" overflow="auto">
            {data.chapters
              .filter((meta) => meta.title.includes(searchVal))
              .map((meta) => (
                <ListItem
                  key={meta.id}
                  p={3}
                  _hover={{ bg: "gray.50", cursor: "pointer" }}
                  _notFirst={{ borderTopColor: "grey.200", borderTopWidth: 1 }}
                  onClick={() => {
                    if (meta.id) {
                      pages.Chapter.go(navigate, { id: `${meta.id}` });
                    }
                  }}
                >
                  <Flex w="100%" justify="space-between">
                    <Text
                      color={meta.synced ? "black" : "gray.400"}
                      isTruncated
                    >
                      {meta.title}
                    </Text>
                    {!meta.synced && (
                      <Text whiteSpace="nowrap">
                        {data?.sync_status === SyncStatusEnum.Syncing
                          ? "Syncing"
                          : "Not Synced"}
                      </Text>
                    )}
                  </Flex>
                </ListItem>
              ))}
          </List>
        )}
        {!loading && error && (
          <Center h="full" w="full">
            <Text color="gray.500">something is wrong.</Text>
          </Center>
        )}
      </FlexPanel>
    </Flex>
  );
};

export default NovelPage;
