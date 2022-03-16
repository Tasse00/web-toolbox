import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Skeleton,
  Spacer,
  Stack,
  Tag,
  Text,
  typography,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { MenuViewer } from "../components/MenuViewer";
import { usePages } from "../hooks";
import { useNovel } from "../providers/NovelProvider";
import { ChevronLeftIcon, DownloadIcon, RepeatIcon } from "@chakra-ui/icons";
import { SyncStatus } from "../components/SyncStatus";

const NovelMenuPage: React.FC<{}> = (props) => {
  const { info, read } = useNovel();
  const pages = usePages();
  const navigate = useNavigate();

  return (
    <Box h="100%">
      <Flex m={2} justify="space-between">
        <IconButton
          aria-label="Back"
          icon={<ChevronLeftIcon />}
          onClick={() => navigate(-1)}
        />
        <HStack>
          <IconButton aria-label="sync" icon={<DownloadIcon />} />
          <IconButton aria-label="refresh" icon={<RepeatIcon />} />
        </HStack>
      </Flex>
      {info.data ? (
        <Box m={2} mt={0}>
          <Flex gap={4} p={4} bg="gray.100" borderRadius={6} align="stretch">
            <Image width={90} height={120} src={info.data.img_url} />
            <Flex flex={1} direction="column">
              <Flex>
                <Flex direction="column">
                  <Text align="left" fontWeight="bold">
                    {info.data.title}
                  </Text>

                  <Text align="left" color="gray.500" isTruncated>
                    {info.data.author}
                  </Text>
                </Flex>
                <Spacer />
                <Box>
                  <Tag colorScheme="cyan">{info.data.source}</Tag>
                </Box>
              </Flex>
              <Spacer />

              <Flex
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <SyncStatus sync={info.data.sync} />
                <Button size="small">View Source</Button>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      ) : (
        <Skeleton h={16} />
      )}
    </Box>
  );
};

export default NovelMenuPage;
