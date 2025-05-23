import { useState } from "react";
import { Button, Card, Space } from "antd";
import { CreateTaskForm } from "./CreateTaskForm";

interface ExpandableTaskFormProps {
  id: number;
  projectId: number;
  onCreated: () => void;
  onRemove: () => void;
}

export function ExpandableTaskForm({
  id,
  projectId,
  onCreated,
  onRemove,
}: ExpandableTaskFormProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card
      title={`New Task #${id}`}
      className="!bg-[#fafafa]"
      extra={
        <Space>
          <Button type="link" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Collapse" : "Expand"}
          </Button>
          <Button type="link" danger onClick={onRemove}>
            Remove
          </Button>
        </Space>
      }
    >
      {expanded ? (
        <CreateTaskForm
          projectId={projectId}
          onSuccess={() => {
            onCreated();
            onRemove();
          }}
        />
      ) : (
        <div className="italic text-[#888]">
          Task creation form is collapsed.
        </div>
      )}
    </Card>
  );
}
