import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { NAVIGATE_ROUTES } from "../../../shared/constants/routing/routes.constants";
import { projectService } from "../../../shared/services/project.service";
import { Button, Typography, message, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Spinner } from "../../../shared/components/common/ui/Spinner";
import { ProjectGrid } from "./ProjectGrid";
import type { Project } from "../../../shared/types/project/project.types";

const { Title } = Typography;

export function ProjectsList() {
  const navigate = useNavigate();

  const {
    data: projects,
    isPending,
    isError,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => projectService.getAll(),
  });

  useEffect(() => {
    if (isError) {
      message.error("Failed to load projects");
    }
  }, [isError]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <Title level={2} className="!mb-0">
          Projects
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(NAVIGATE_ROUTES.createProject())}
        >
          New Project
        </Button>
      </div>

      {isPending ? (
        <Spinner />
      ) : projects?.length ? (
        <ProjectGrid projects={projects} />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No projects found"
        />
      )}
    </div>
  );
}
