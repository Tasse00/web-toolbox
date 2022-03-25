import useRequest from "@ahooksjs/use-request";
import { Search2Icon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  AspectRatio,
  Box,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "toolbox-components";
import { useI18n } from "toolbox-framework";
import { ListSkeleton } from "../components/ListSkeleton";
import { SyncStatusMap } from "../consts";
import { usePages } from "../hooks";
import { useServices } from "../providers/ServiceProvider";

const LibraryPage: React.FC<{}> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchSync } = useServices();
  const [t] = useI18n();
  const navigate = useNavigate();
  const pages = usePages();
  const keyword = searchParams.get("keyword") || "";
  const { data, loading, error } = useRequest(
    async () => await searchSync(keyword),
    {
      refreshDeps: [keyword, searchSync],
    }
  );
  const [iptVal, setIptVal] = useState(keyword);
  useEffect(() => {
    setIptVal(keyword);
  }, [keyword]);

  return (
    <Layout
      bar={
        <Flex align="center">
          <InputGroup>
            <Input
              placeholder={t("app.mynovels.library.search")}
              value={iptVal}
              borderRadius={0}
              onChange={(e) => setIptVal(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                aria-label="search"
                icon={<Search2Icon />}
                size="sm"
                onClick={() => setSearchParams({ keyword: iptVal })}
              />
            </InputRightElement>
          </InputGroup>
        </Flex>
      }
      contentStyle={{ overflow: "auto" }}
    >
      <Box p={2}>
        {!loading && !error && data === undefined && (
          <Flex justify="center" align="center">
            {t("app.mynovels.library.guide")}
          </Flex>
        )}

        {!loading && !error && data && data.length === 0 && (
          <Flex justify="center" align="center">
            {t("app.mynovels.library.empty")}
          </Flex>
        )}
        {!loading && (
          <Flex wrap="wrap" justifyContent="space-around">
            {(data || []).map((novel) => (
              <Box key={novel.id} w="50%">
                <Box
                  p={2}
                  m={1}
                  bg="gray.100"
                  borderRadius="lg"
                  onClick={() => {
                    pages.Novel.go(navigate, { id: novel.id.toString() });
                  }}
                >
                  <AspectRatio ratio={0.75}>
                    <Image width="full" height="full" src={novel.img} />
                  </AspectRatio>
                  <Flex align="center">
                    <Text flex={1} isTruncated>
                      {novel.title}
                    </Text>
                    <Text color="gray.500" isTruncated>
                      {novel.author}
                    </Text>
                  </Flex>

                  <Flex justify="space-between" align="center">
                    <Text color="gray.500" isTruncated>
                      {novel.source}
                    </Text>
                    <Text color="gray.500" isTruncated>
                      {SyncStatusMap[novel.sync_status]}
                    </Text>
                  </Flex>
                </Box>
              </Box>
            ))}
          </Flex>
        )}

        {loading && <ListSkeleton />}
        {!loading && error && (
          <Alert status="error">
            <AlertIcon /> {error.message}
          </Alert>
        )}
      </Box>
    </Layout>
  );
};

export default LibraryPage;
