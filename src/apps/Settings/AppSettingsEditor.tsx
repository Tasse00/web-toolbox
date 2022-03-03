import { Button, Col, Row, Typography, Skeleton, Alert } from "antd";
import React, { useContext, useMemo, useState } from "react";
import ReactJson from "react-json-view";
import { usePersistent } from "../../common/providers/persistent/context";
import { FrameworkContext } from "../../framework/Framework";

interface Props {
  appId: string;
}

const AppSettingsEditor: React.FC<Props> = ({ appId }) => {
  const { loading, value, update } = usePersistent<any>(appId);
  const { configs } = useContext(FrameworkContext);

  const config = useMemo(
    () => configs.find((conf) => conf.appId === appId),
    [configs, appId]
  );

  const [editingValue, setEditingValue] = useState<any>(undefined);

  return (
    <>
      {loading && <Skeleton />}
      {!loading && value === undefined && (
        <Alert
          type="error"
          message={`Settings for "${appId}"" is undefined`}
          action={
            <Button size="small" onClick={() => update(undefined)}>
              Clear
            </Button>
          }
        />
      )}
      {!loading && config === undefined && (
        <Alert
          type="error"
          message={`Config for "${appId}"" not found `}
          action={
            <Button size="small" onClick={() => update(undefined)}>
              Clear
            </Button>
          }
        />
      )}
      {!loading && value && config && (
        <Row>
          <Col span={24}>
            <Row justify="space-between" align="middle">
              <Col>
                <Typography.Text strong>{config.title}</Typography.Text>
              </Col>
              <Col>
                <Button
                  size="small"
                  disabled={
                    editingValue === undefined ||
                    JSON.stringify(editingValue) === JSON.stringify(value)
                  }
                  onClick={() => update(editingValue)}
                >
                  Update
                </Button>
              </Col>
            </Row>
          </Col>
          <Col>
            <ReactJson
              src={value || editingValue}
              onEdit={(v: any) => {
                setEditingValue(v.updated_src);
              }}
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default AppSettingsEditor;
