import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Button, Typography, message, Form, Input } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NAVIGATE_ROUTES } from "../../../shared/constants/routing/routes.constants";
import { useAuthStore } from "../../../shared/store/auth.store";
import { projectService } from "../../../shared/services/project.service";

const { Title } = Typography;

const schema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CreateProjectPage() {
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (!userId) throw new Error("User is not authenticated");
      return projectService.create({ ...data, ownerId: userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      message.success("Project created successfully");
      navigate(NAVIGATE_ROUTES.home());
    },
    onError: () => {
      message.error("Failed to create project");
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Title level={2}>Create New Project</Title>

      <Form
        layout="vertical"
        requiredMark="optional"
        onFinish={handleSubmit(onSubmit)}
      >
        <Form.Item
          label="Title"
          required
          validateStatus={errors.title ? "error" : ""}
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter project title"
                disabled={isSubmitting}
              />
            )}
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
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={4}
                placeholder="Enter project description"
                disabled={isSubmitting}
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Create Project
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => navigate(NAVIGATE_ROUTES.home())}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
