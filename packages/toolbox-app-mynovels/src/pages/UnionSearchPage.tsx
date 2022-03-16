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
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "toolbox-components";
import { useServices } from "../providers/ServiceProvider";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { SyncStatusMap } from "../consts";
import { usePages } from "../hooks";

const UnionSearchPage: React.FC<{}> = (props) => {
  const go = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchUnion, startSyncNovel } = useServices();
  const pages = usePages();
  const keyword = searchParams.get("keyword") || "";
  const { data, loading, error } = useRequest(
    async () => await searchUnion(keyword),
    {
      refreshDeps: [keyword, searchUnion],
    }
  );

  const { run, loading: starting } = useRequest(
    async (source: string, url: string) => {
      await startSyncNovel(source, url);
      await new Promise((res) => setTimeout(res, 5000));
      await pages.goSearchSync({ keyword: "" });
    },
    { manual: true }
  );

  return (
    <Layout
      bar={
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => go(-1)} />
          <Input.Search
            placeholder="search"
            defaultValue={keyword}
            onSearch={(v) => {
              setSearchParams({
                keyword: v,
              });
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
                  pages.goReader({ id: candidate.novel.id });
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
