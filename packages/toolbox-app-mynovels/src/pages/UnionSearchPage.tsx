import useRequest from "@ahooksjs/use-request";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "toolbox-components";
import { useServices } from "../providers/ServiceProvider";
import { usePages } from "../hooks";
import { CandidateItem } from "../components/CandidateItem";
import { ListSkeleton } from "../components/ListSkeleton";
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { useI18n } from "toolbox-framework";

const UnionSearchPage: React.FC<{}> = (props) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  // const autoSearch = (searchParams.get("autoSearch") || "true") === "true";

  const { searchUnion, startSyncNovel } = useServices();
  const pages = usePages();

  const {
    data,
    loading,
    error,
    run: search,
  } = useRequest(async (kv) => await searchUnion(kv), {
    manual: true,
    refreshDeps: [searchUnion],
  });

  const { run, loading: starting } = useRequest(
    async (source: string, url: string) => {
      await startSyncNovel(source, url);
      await new Promise((res) => setTimeout(res, 5000));
      await pages.TabLibrary.go(navigate);
    },
    { manual: true }
  );

  useEffect(() => {
    if (keyword.length > 0) {
      search(keyword);
    }
  }, []);

  const [iptVal, setIptVal] = useState(keyword);
  useEffect(() => {
    setIptVal(keyword);
  }, [keyword]);
  const [t] = useI18n();
  return (
    <Layout
      bar={
        <Flex align="center">
          <InputGroup>
            <Input
              placeholder={t("app.mynovels.union.search")}
              value={iptVal}
              borderRadius={0}
              onChange={(e) => setIptVal(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                aria-label="search"
                icon={<Search2Icon />}
                size="sm"
                onClick={() => {
                  if (iptVal.trim().length > 0) {
                    search(iptVal.trim());
                  }
                }}
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
            {t("app.mynovels.union.guide")}
          </Flex>
        )}

        {!loading && !error && data && data.length === 0 && (
          <Flex justify="center" align="center">
            {t("app.mynovels.union.empty")}
          </Flex>
        )}
        {!loading && (
          <Flex direction="column" align="stretch" gap={2} p={2}>
            {(data || []).map((candidate) => (
              <CandidateItem key={candidate.url} {...candidate} />
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

export default UnionSearchPage;
