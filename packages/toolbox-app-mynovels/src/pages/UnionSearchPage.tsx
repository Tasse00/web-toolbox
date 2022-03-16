import useRequest from "@ahooksjs/use-request";
import {
  Alert,
  Button,
  Divider,
  Image,
  Input,
  Modal,
  Skeleton,
  Typography,
} from "antd";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "toolbox-components";
import { useServices } from "../providers/ServiceProvider";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { SyncStatusMap } from "../consts";
import { usePages } from "../hooks";

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

  return (
    <Layout
      bar={
        <div style={{ display: "flex", alignItems: "center" }}>
          <Input.Search
            placeholder="search"
            defaultValue={keyword}
            onSearch={(v) => {
              if (v.length > 0) {
                search(v);
              }
              // setSearchParams({
              //   keyword: v,
              // });
            }}
          />
        </div>
      }
    >
      {!loading && !error && data === undefined && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          {"Input & Search"}
        </div>
      )}

      {!loading && !error && data && data.length === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          {"No result"}
        </div>
      )}
      {!loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          {(data || []).map((candidate) => (
            <div
              style={{
                padding: 8,
                margin: 8,
                backgroundColor: "rgba(220,220,220,0.2)",
                borderRadius: 12,
              }}
              onClick={() => {
                if (candidate.novel) {
                  pages.Novel.go(
                    navigate,
                    {},
                    {
                      novelId: candidate.novel.id.toString(),
                    }
                  );
                }
              }}
            >
              <Image
                width={180}
                height={240}
                placeholder="No Image"
                src={candidate.img_url}
                preview={false}
              />
              <div
                style={{ display: "flex", alignItems: "center", width: 180 }}
              >
                <Typography.Text
                  style={{
                    flex: 1,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    wordBreak: "break-all",
                  }}
                >
                  {candidate.title}
                </Typography.Text>
                <Typography.Text type="secondary">
                  {candidate.author}
                </Typography.Text>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: 180,
                }}
              >
                <Typography.Text type="secondary">
                  {candidate.source}
                </Typography.Text>
                {candidate.novel ? (
                  <Typography.Text type="secondary">
                    {SyncStatusMap[candidate.novel.sync.status]}
                  </Typography.Text>
                ) : (
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => run(candidate.source, candidate.url)}
                  >
                    Sync
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && <Skeleton />}
      {!loading && error && <Alert type="error" message={error.message} />}

      <Modal
        visible={starting}
        maskClosable={false}
        footer={false}
        closable={false}
      >
        Starting to sync novel...
      </Modal>
    </Layout>
  );
};

export default UnionSearchPage;
