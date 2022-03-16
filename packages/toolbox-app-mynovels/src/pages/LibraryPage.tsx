import useRequest from "@ahooksjs/use-request";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Alert, Image, Button, Input, List, Skeleton, Typography } from "antd";
import React from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Layout } from "toolbox-components";
import { SyncStatusMap } from "../consts";
import { usePages } from "../hooks";
import { useServices } from "../providers/ServiceProvider";

const LibraryPage: React.FC<{}> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchSync } = useServices();
  const navigate = useNavigate();
  const pages = usePages();
  const keyword = searchParams.get("keyword") || "";
  const { data, loading, error } = useRequest(
    async () => await searchSync(keyword),
    {
      refreshDeps: [keyword, searchSync],
    }
  );

  return (
    <Layout
      bar={
        <div style={{ display: "flex", alignItems: "center" }}>
          <Input.Search
            placeholder="search"
            defaultValue={keyword}
            onSearch={(keyword) => setSearchParams({ keyword })}
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
          {"No result In Synced Novels, Try 'Union Search'"}
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
          {(data || []).map((novel) => (
            <div
              style={{
                padding: 8,
                margin: 8,
                backgroundColor: "rgba(220,220,220,0.2)",
                borderRadius: 12,
              }}
              onClick={() =>
                // pages.Reader.go(navigate, { id: novel.id.toString() })
                pages.NovelMenu.go(
                  navigate,
                  {},
                  { novelId: novel.id.toString() }
                )
              }
            >
              <Image
                width={180}
                height={240}
                src={novel.img_url}
                preview={false}
              />
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography.Text style={{ flex: 1 }}>
                  {novel.title}
                </Typography.Text>
                <Typography.Text type="secondary">
                  {novel.author}
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
                  {novel.source}
                </Typography.Text>
                <Typography.Text type="secondary">
                  {SyncStatusMap[novel.sync.status]}
                </Typography.Text>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && <Skeleton />}
      {!loading && error && <Alert type="error" message={error.message} />}
    </Layout>
  );
};

export default LibraryPage;
