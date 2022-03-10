import { SettingOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Input, Skeleton } from "antd";
import React, { useState } from "react";
import { useAppConfig } from "toolbox-framework";

const Settings: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const {
    value: identity,
    update: updateIdentity,
    loading: loadingIdentity,
  } = useAppConfig("identity", "");

  const {
    value: signalingServerUrl,
    update: updateSignalingServerUrl,
    loading: loadingSignalingServerUrl,
  } = useAppConfig("signalingServerUrl", "");

  const [form] = Form.useForm();

  const [canSave, setCanSave] = useState(false);

  return (
    <Drawer
      title={<SettingOutlined />}
      headerStyle={{ padding: 12 }}
      extra={
        <Button
          size="small"
          type="link"
          disabled={!canSave}
          onClick={() => {
            const data: any = form.getFieldsValue();
            updateIdentity(data.identity);
            updateSignalingServerUrl(data.signalingServerUrl);
          }}
        >
          Save
        </Button>
      }
      getContainer={false}
      placement="right"
      visible={visible}
      closable={false}
      maskClosable
      onClose={() => onClose()}
      style={{ position: "absolute" }}
    >
      {loadingIdentity || loadingSignalingServerUrl ? (
        <Skeleton />
      ) : (
        <Form
          form={form}
          requiredMark={false}
          layout="vertical"
          initialValues={{ identity, signalingServerUrl }}
          onValuesChange={() => {
            const v = form.getFieldsValue();
            const canSave =
              (v.identity !== identity ||
                v.signalingServerUrl !== signalingServerUrl) &&
              v.identity &&
              v.signalingServerUrl;
            setCanSave(canSave);
          }}
        >
          <Form.Item
            shouldUpdate
            label="Identification"
            name="identity"
            rules={[{ required: true }]}
          >
            <Input placeholder="This Device ID" />
          </Form.Item>

          <Form.Item
            shouldUpdate
            label="Signaling Server Url"
            name="signalingServerUrl"
          >
            <Input placeholder="https://example.com/clipboard/SID" />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default Settings;
