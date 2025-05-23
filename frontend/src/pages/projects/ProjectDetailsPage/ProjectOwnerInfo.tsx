import { Dropdown, Space, Typography } from "antd";
import { UserOutlined, CheckCircleOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import type { Project } from "../../../shared/types/project/project.types";
import type { User } from "../../../shared/types/user/user.types";

interface ProjectOwnerInfoProps {
  owner: Pick<Project["owner"], "id" | "name" | "email">;
  currentUserId: User["id"] | null;
}

export function ProjectOwnerInfo({
  owner,
  currentUserId,
}: ProjectOwnerInfoProps) {
  const items: MenuProps["items"] = [
    {
      key: "owner-email",
      label: owner.email,
    },
  ];

  return (
    <Dropdown menu={{ items }}>
      <Space className="text-gray-500 cursor-pointer">
        <UserOutlined />
        <Typography.Text className="!text-gray-500">
          {owner.name}
        </Typography.Text>
        {owner.id === currentUserId && (
          <CheckCircleOutlined style={{ color: "#52c41a" }} />
        )}
      </Space>
    </Dropdown>
  );
}
