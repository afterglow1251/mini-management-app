import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Button, Card, Typography, message, Space, Divider, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { NAVIGATE_ROUTES } from "../../../shared/constants/routing/routes.constants";
import { projectService } from "../../../shared/services/project.service";
import { Spinner } from "../../../shared/components/common/ui/Spinner";
import { TaskList } from "../../tasks/TasksList";
import { useAuthStore } from "../../../shared/store/auth.store";
import { ProjectOwnerInfo } from "./ProjectOwnerInfo";
import { ProjectActions } from "./ProjectActions";
import { ExpandableTaskForm } from "../../tasks/forms/ExpandableTaskForm";

const { Title, Paragraph } = Typography;

interface ProjectDetailsPageProps {
  id: number;
}

export function ProjectDetailsPage({ id: projectId }: ProjectDetailsPageProps) {
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  const [taskForms, setTaskForms] = useState<number[]>([]);
  const [formIdCounter, setFormIdCounter] = useState(1);
  const queryClient = useQueryClient();

  const {
    data: project,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectService.getOne(projectId),
  });

  const mutation = useMutation({
    mutationFn: () => projectService.delete(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
      message.success("Project deleted successfully");
      navigate(NAVIGATE_ROUTES.home());
    },
    onError: () => {
      message.error("Failed to delete project");
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  const handleAddTaskForm = () => {
    setTaskForms((prev) => [...prev, formIdCounter]);
    setFormIdCounter((prev) => prev + 1);
  };

  const handleRemoveForm = (id: number) => {
    setTaskForms((prev) => prev.filter((formId) => formId !== id));
  };

  useEffect(() => {
    if (isError) {
      message.error("Failed to load project details");
    }
  }, [isError]);

  if (isPending) return <Spinner />;
  if (!project)
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Project not found"
      />
    );

  const isOwner = userId === project.owner.id;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Card
          type="inner"
          title={
            <ProjectOwnerInfo owner={project.owner} currentUserId={userId} />
          }
          extra={
            isOwner && (
              <ProjectActions projectId={project.id} onDelete={handleDelete} />
            )
          }
        >
          <Title level={2}>{project.title}</Title>
          <Paragraph>
            {project.description || "No description provided."}
          </Paragraph>
        </Card>

        <Divider orientation="left">Tasks</Divider>

        {isOwner && (
          <>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddTaskForm}
            >
              Add Task
            </Button>

            {taskForms.map((id) => (
              <ExpandableTaskForm
                key={id}
                id={id}
                projectId={projectId}
                onCreated={refetch}
                onRemove={() => handleRemoveForm(id)}
              />
            ))}
          </>
        )}

        <TaskList project={project} onTaskUpdated={refetch} />
      </Space>
    </div>
  );
}
