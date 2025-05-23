import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Button, Typography, Form, Input, message, Empty } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../../../shared/services/project.service";
import { NAVIGATE_ROUTES } from "../../../shared/constants/routing/routes.constants";
import { Spinner } from "../../../shared/components/common/ui/Spinner";

const { Title } = Typography;

const schema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface UpdateProjectPageProps {
  id: number;
}

export function UpdateProjectPage({ id: projectId }: UpdateProjectPageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: project,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectService.getOne(projectId),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (project) {
      reset({ title: project.title, description: project.description });
    }
  }, [project, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) => projectService.update(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      message.success("Project updated successfully");
      navigate(NAVIGATE_ROUTES.projectDetails(projectId));
    },
    onError: () => {
      message.error("Failed to update project");
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  if (isPending) return <Spinner />;
  if (isError || !project)
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Project not found"
      />
    );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Title level={2}>Update Project</Title>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Title"
          validateStatus={errors.title ? "error" : ""}
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          validateStatus={errors.description ? "error" : ""}
          help={errors.description?.message}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input.TextArea {...field} rows={4} />}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Save Changes
          </Button>
          <Button
            className="ml-2"
            onClick={() => navigate(NAVIGATE_ROUTES.projectDetails(projectId))}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
