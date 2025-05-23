import { Link, useNavigate } from "react-router";
import {
  Button,
  Space,
  Avatar,
  Dropdown,
  Typography,
  type MenuProps,
} from "antd";
import { useAuthStore } from "../../../shared/store/auth.store";
import { authService } from "../../../shared/services/auth.service";
import { userService } from "../../../shared/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { NAVIGATE_ROUTES } from "../../../shared/constants/routing/routes.constants";

const { Text } = Typography;

export function UserMenu() {
  const { isAuthenticated, userId, logout } = useAuthStore();
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ["currentUser", userId],
    queryFn: () => userService.findOne(userId!),
    enabled: !!userId,
  });

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      logout();
      navigate(NAVIGATE_ROUTES.login());
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "user-info",
      label: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Text strong>{user?.name ?? "User"}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {user?.email}
          </Text>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Log out",
      onClick: handleLogout,
    },
  ];

  const avatarContent = user?.name?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <Space size="middle">
      {!isAuthenticated ? (
        <>
          <Button>
            <Link to={NAVIGATE_ROUTES.signup()}>Sign up</Link>
          </Button>
          <Button>
            <Link to={NAVIGATE_ROUTES.login()}>Log in</Link>
          </Button>
        </>
      ) : (
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Avatar
            style={{ cursor: "pointer", backgroundColor: "#1677FF" }}
            size="large"
          >
            {avatarContent}
          </Avatar>
        </Dropdown>
      )}
    </Space>
  );
}
