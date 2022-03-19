import useRequest from "@ahooksjs/use-request";
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  ChevronLeftIcon,
  LinkIcon,
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  IconButton,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "toolbox-components";
import { openNewTab } from "toolbox-utils";
import FlexPanel from "../components/FlexPanel";
import { useNovel } from "../providers/NovelProvider";
import { useServices } from "../providers/ServiceProvider";

const ChapterPage: React.FC<{}> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams({ id: "0" });
  const id = parseInt(searchParams.get("id") || "0");
  const { fetchSyncChapter } = useServices();
  const { data, loading, error } = useRequest(
    async () => {
      return await fetchSyncChapter(id);
    },
    { refreshDeps: [id, fetchSyncChapter] }
  );

  const navigate = useNavigate();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [id]);

  return (
    <Flex h="100%" direction="column">
      <Flex m={2} justify="space-between" align="center">
        <IconButton
          aria-label="Back"
          icon={<ChevronLeftIcon />}
          onClick={() => navigate(-1)}
        />
        <Text
          align="center"
          fontWeight="bold"
          fontSize={"lg"}
          color="black.500"
        >
          {data ? data.title : ""}
        </Text>
        <IconButton
          aria-label="View Source"
          icon={<LinkIcon />}
          disabled={loading}
          onClick={() => {
            if (data) {
              openNewTab({ url: data.url });
            }
          }}
        />
      </Flex>

      <FlexPanel
        ref={ref}
        m={2}
        mt={0}
        direction="column"
        flex={1}
        overflow="auto"
      >
        {loading && (
          <Flex direction="column">
            <Skeleton m={2} h={12} />
            <Skeleton m={2} h={12} />
            <Skeleton m={2} h={12} />
          </Flex>
        )}
        {data &&
          data.synced &&
          data.lines.map((line, idx) => <Text key={idx}>{line}</Text>)}
        {data && !data.synced && (
          <Alert status="info">
            <AlertIcon />
            Chapter is not synced.
          </Alert>
        )}
        {error && (
          <Alert status="error">
            <AlertIcon />
            Failed to fetch chapter.
          </Alert>
        )}
      </FlexPanel>

      <Flex m={2} mt={0} columnGap={2}>
        <IconButton
          flex={1}
          size="sm"
          aria-label="Prev"
          icon={<ArrowBackIcon />}
          disabled={loading || !data || !data.prev_id}
          onClick={() =>
            setSearchParams(
              { id: (data?.prev_id || 0).toString() },
              { replace: true }
            )
          }
        >
          Prev
        </IconButton>
        <IconButton
          flex={1}
          size="sm"
          aria-label="Next"
          icon={<ArrowForwardIcon />}
          disabled={loading || !data || !data.next_id}
          onClick={() =>
            setSearchParams(
              { id: (data?.next_id || 0).toString() },
              { replace: true }
            )
          }
        >
          Next
        </IconButton>
      </Flex>
    </Flex>
  );
};

export default ChapterPage;
