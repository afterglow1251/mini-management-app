import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Empty, Form, Input, Select, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../../../shared/services/task.service";
import { userService } from "../../../shared/services/user.service";
import type { User } from "../../../shared/types/user/user.types";
import { Spinner } from "../../../shared/components/common/ui/Spinner";
import { useEffect } from "react";
import { mapUsersToOptions } from "../../../shared/utils/user/selectOptions.utils";

const schema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
  assignedToId: z.number().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateTaskFormProps {
  projectId: number;
  onSuccess: () => void;
}

export function CreateTaskForm({ projectId, onSuccess }: CreateTaskFormProps) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const {
    data: users,
    isPending,
    isError,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => userService.findAll(),
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      taskService.create({ ...data, projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      message.success("Task created successfully");
      reset();
      onSuccess();
    },
    onError: () => {
      message.error("Failed to create task");
    },
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  useEffect(() => {
    if (isError) {
      message.error("Failed to load users");
    }
  }, [isError]);

  if (isPending) return <Spinner />;
  if (isError || !users) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Failed to load users"
      />
    );
  }

  const userOptions = mapUsersToOptions(users);

  return (
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
          render={({ field }) => <Input.TextArea {...field} rows={3} />}
        />
      </Form.Item>

      <Form.Item
        label="Assign to"
        validateStatus={errors.assignedToId ? "error" : ""}
        help={errors.assignedToId?.message}
      >
        <Controller
          name="assignedToId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={userOptions}
              placeholder="Select user"
              onChange={(value) => field.onChange(value)}
              allowClear
              showSearch
              optionFilterProp="label"
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
          Create Task
        </Button>
      </Form.Item>
    </Form>
  );
}
