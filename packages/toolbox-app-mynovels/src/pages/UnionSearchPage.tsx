import useRequest from "@ahooksjs/use-request";
import { Alert, Image, Input, Skeleton, Typography } from "antd";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "toolbox-components";
import { useServices } from "../providers/ServiceProvider";

const UnionSearchPage: React.FC<{}> = (props) => {
  const go = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchUnion, setServerUrl } = useServices();
  console.log(setServerUrl);
  const keyword = searchParams.get("keyword") || "";
  const { data, loading, error } = useRequest(
    async () => await searchUnion(keyword),
    {
      refreshDeps: [keyword, searchUnion],
    }
  );

  return (
    <Layout
      bar={
        <Input.Search
          placeholder="search"
          defaultValue={keyword}
          onSearch={(v) => {
            setSearchParams({
              keyword: v,
            });
          }}
        />
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
          {(data || []).map((novel) => (
            <div
              style={{
                padding: 8,
                margin: 8,
                backgroundColor: "rgba(220,220,220,0.2)",
                borderRadius: 12,
              }}
            >
              <Image
                width={180}
                height={240}
                placeholder="No Image"
                src={novel.img_url}
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
                  {novel.title}
                </Typography.Text>
                <Typography.Text type="secondary">
                  {novel.author}
                </Typography.Text>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && <Skeleton />}
      {!loading && error && <Alert type="error" message={error.message} />}
      {/* {!loading && (
        <div style={{ margin: 8, paddingLeft: 24, paddingRight: 24 }}>
          <Button
            block
            onClick={() => {
              go({
                pathname: "/search/union-novels",
                search: createSearchParams({
                  keyword,
                }).toString(),
              });
            }}
          >
            Union Search
          </Button>
        </div>
      )} */}
    </Layout>
  );
};

export default UnionSearchPage;
