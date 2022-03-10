import { Button, Col, Input, Row, List, Card, Typography } from "antd";
import React from "react";
import {
  ArrowUpOutlined,
  CopyOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useCachedState } from "../../hooks/cache";
import { copyToClipboard } from "../../utils/copy";
import { Layout } from "toolbox-components";

import theme from "../../theme";

const StoreKey = "notebook.notes";

interface Note {
  id: string;
  label: string;
  value: string;
}

const Notebook: React.FC<{}> = (props) => {
  const [expanded, setExpanded] = React.useState(false);
  const [notes, setNotes] = useCachedState<Note[]>(StoreKey, []);

  const [newLabel, setNewLabel] = React.useState("");
  const [newValue, setNewValue] = React.useState("");
  const [searchKey, setSearchKey] = React.useState("");

  const addNew = () => {
    const label = newLabel.trim();
    const value = newValue.trim();
    if (label && value) {
      setNotes([
        {
          id: Math.random().toString(),
          label,
          value,
        },
        ...notes,
      ]);
      setNewLabel("");
      setNewValue("");
    }
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };
  return (
    <Card
      className={theme.notebook}
      bodyStyle={{ padding: 8 }}
      style={{ opacity: expanded ? 1 : undefined }}
    >
      <div>
        <Row wrap={false}>
          <Col>
            <Input
              placeholder="label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
          </Col>
          <Col>
            <Input
              placeholder="value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onPressEnter={addNew}
            />
          </Col>
          <Col>
            <Button onClick={addNew}>Save</Button>
          </Col>
          <Col>
            <Button
              type="text"
              icon={
                <ArrowUpOutlined
                  style={{
                    transition: "all 0.3s",
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              }
              onClick={() => setExpanded(!expanded)}
            />
          </Col>
        </Row>
      </div>
      <div
        className={theme.notelist}
        style={{ height: expanded ? 400 : undefined, overflow: "hidden" }}
      >
        <Layout
          style={{ width: "100%", height: "100%" }}
          bar={
            <Input
              placeholder="filter"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              allowClear
              style={{ marginTop: 8 }}
            />
          }
        >
          <List
            style={{ overflow: "auto" }}
            dataSource={notes.filter((note) => note.label.includes(searchKey))}
            renderItem={(note) => (
              <List.Item
                extra={
                  <Button.Group>
                    <Button
                      icon={<CopyOutlined />}
                      type="text"
                      onClick={() => copyToClipboard(note.value)}
                    />
                    <Button
                      icon={<DeleteOutlined style={{ color: "red" }} />}
                      type="text"
                      onClick={() => removeNote(note.id)}
                    />
                  </Button.Group>
                }
              >
                <List.Item.Meta
                  title={
                    <Typography.Text ellipsis>{note.label}</Typography.Text>
                  }
                  description={
                    <Typography.Text ellipsis type="secondary">
                      {note.value}
                    </Typography.Text>
                  }
                />
              </List.Item>
            )}
          />
        </Layout>
      </div>
    </Card>
  );
};

export default Notebook;
