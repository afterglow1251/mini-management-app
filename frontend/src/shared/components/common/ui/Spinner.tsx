import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export function Spinner() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-70 z-50">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </div>
  );
}
