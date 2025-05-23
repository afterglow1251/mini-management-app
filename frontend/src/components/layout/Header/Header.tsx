import { Layout, Button } from "antd";
import { Link } from "react-router";
import { UserMenu } from "./UserMenu";
import { NAVIGATE_ROUTES } from "../../../shared/constants/routing/routes.constants";

const { Header: AntHeader } = Layout;

export function Header() {
  return (
    <AntHeader className="!px-[56px] !bg-[#f9f9f9] !border-b !border-[#e0e0e0] !sticky !top-0 !z-[999]">
      <div className="flex justify-between items-center">
        <Button type="text" className="!p-0 !bg-inherit">
          <Link to={NAVIGATE_ROUTES.home()} className="text-xl font-medium">
            Management App
          </Link>
        </Button>

        <UserMenu />
      </div>
    </AntHeader>
  );
}
