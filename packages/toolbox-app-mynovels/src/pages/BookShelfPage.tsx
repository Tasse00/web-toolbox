import { Input } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "toolbox-components";

const BookShelfPage: React.FC<{}> = (props) => {
  // const go = useNavigate();

  return (
    <Layout>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Coming soon
      </div>
    </Layout>
  );
};

export default BookShelfPage;
