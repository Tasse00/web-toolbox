import useRequest from "@ahooksjs/use-request";
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  ChevronLeftIcon,
  LinkIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Skeleton,
  Text,
  useBoolean,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppConfig } from "toolbox-framework";
import { openNewTab } from "toolbox-utils";
import { ChapterControl } from "../components/ChapterControl";
import { ColorPicker } from "../components/ColorPicker";
import { FontSizePicker } from "../components/FontSizePicker";
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

  const [fullscreen, setFullscreen] = useState(false);
  const transDur = "0.2s";

  const prevDisabled = loading || !data || !data.prev_id;
  const nextDisabled = loading || !data || !data.next_id;
  const onPrev = () =>
    setSearchParams({ id: (data?.prev_id || 0).toString() }, { replace: true });
  const onNext = () =>
    setSearchParams({ id: (data?.next_id || 0).toString() }, { replace: true });

  const [settingsVis, setSettingsVis] = useBoolean(false);

  const { value: fontColor, update: setFontColor } = useAppConfig(
    "reader.fontColor",
    "black"
  );

  const { value: bgColor, update: setBgColor } = useAppConfig(
    "reader.bgColor",
    "white"
  );

  const { value: fontSize, update: setFontSize } = useAppConfig(
    "reader.fontSize",
    "lg"
  );

  return (
    <Flex h="100%" direction="column">
      <Flex
        justify="space-between"
        align="center"
        h={fullscreen ? 0 : 10}
        m={fullscreen ? 0 : 2}
        overflow="hidden"
        transitionProperty="all"
        transitionDuration={transDur}
      >
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
          isTruncated={true}
        >
          {data ? data.title : ""}
        </Text>

        <IconButton
          aria-label="reader settings"
          icon={<SettingsIcon />}
          onClick={setSettingsVis.on}
        />
      </Flex>

      <Box
        ref={ref}
        px={2}
        bg={bgColor}
        transitionProperty="all"
        transitionDuration={transDur}
        flex={1}
        overflow="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "0px",
          },
          "&::-webkit-scrollbar-track": {
            width: "0px",
          },
        }}
        onClick={() => setFullscreen((v) => !v)}
      >
        {loading && (
          <Flex direction="column">
            <Skeleton m={2} h={12} />
            <Skeleton m={2} h={12} />
            <Skeleton m={2} h={12} />
          </Flex>
        )}
        {!loading &&
          data &&
          data.synced &&
          data.lines.map((line, idx) => (
            <Text fontSize={fontSize} color={fontColor} key={idx}>
              {line}
            </Text>
          ))}
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

        {!error && !loading && (
          <ChapterControl
            transitionProperty="all"
            transitionDuration={transDur}
            my={!fullscreen ? 0 : 2}
            h={!fullscreen ? 0 : 10}
            prevDisabled={prevDisabled}
            nextDisabled={nextDisabled}
            onPrev={onPrev}
            onNext={onNext}
          />
        )}
      </Box>

      <ChapterControl
        transitionProperty="all"
        transitionDuration={transDur}
        m={fullscreen ? 0 : 2}
        h={fullscreen ? 0 : 10}
        prevDisabled={prevDisabled}
        nextDisabled={nextDisabled}
        onPrev={onPrev}
        onNext={onNext}
      />

      <Drawer
        isOpen={settingsVis}
        placement="bottom"
        onClose={setSettingsVis.off}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody maxH={80} overflow="auto">
            <VStack gap={2} m={2} align="stretch">
              <Flex justify="space-between" align="center">
                <Text>View Source</Text>
                <IconButton
                  aria-label="View Source"
                  icon={<LinkIcon />}
                  disabled={loading}
                  onClick={() => data && openNewTab({ url: data.url })}
                />
              </Flex>

              <Flex justify="space-between" align="center">
                <Text>Font Color</Text>
                <ColorPicker value={fontColor} onChange={setFontColor} />
              </Flex>

              <Flex justify="space-between" align="center">
                <Text>Background</Text>
                <ColorPicker value={bgColor} onChange={setBgColor} />
              </Flex>

              <Flex justify="space-between" align="center">
                <Text>Font Size</Text>
                <FontSizePicker value={fontSize} onChange={setFontSize} />
              </Flex>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default ChapterPage;
