import { Button, Popconfirm, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { NAVIGATE_ROUTES } from "../../../shared/constants/routing/routes.constants";

interface ProjectActionsProps {
  projectId: number;
  onDelete: () => void;
}

export function ProjectActions({ projectId, onDelete }: ProjectActionsProps) {
  const navigate = useNavigate();

  return (
    <Space>
      <Button
        icon={<EditOutlined />}
        onClick={() => navigate(NAVIGATE_ROUTES.projectEdit(projectId))}
      >
        Edit
      </Button>

      <Popconfirm
        title="Are you sure you want to delete this project?"
        okText="Yes"
        cancelText="No"
        onConfirm={onDelete}
      >
        <Button danger icon={<DeleteOutlined />}>
          Delete
        </Button>
      </Popconfirm>
    </Space>
  );
}
