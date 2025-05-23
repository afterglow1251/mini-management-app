import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  List,
  Select,
  Button,
  Typography,
  Popconfirm,
  message,
  Space,
  Input,
  Empty,
} from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { taskService } from "../../shared/services/task.service";
import { userService } from "../../shared/services/user.service";
import { useAuthStore } from "../../shared/store/auth.store";
import { TASK_STATUS_OPTIONS } from "../../shared/constants/routing/task/task.constants";
import type { Project } from "../../shared/types/project/project.types";
import { mapUsersToOptions } from "../../shared/utils/user/selectOptions.utils";
import type { EditedTask } from "../../shared/types/task/edit-task.types";

const { Text } = Typography;

interface TaskListProps {
  project: Project;
  onTaskUpdated: () => void;
}

export function TaskList({ project, onTaskUpdated }: TaskListProps) {
  const { userId } = useAuthStore();
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<EditedTask>({});
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.findAll(),
  });

  const userOptions = mapUsersToOptions(users);

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: EditedTask }) =>
      taskService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", project.id] });
      onTaskUpdated();
      setEditingTaskId(null);
      message.success("Task updated");
    },
    onError: () => message.error("Failed to update task"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => taskService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", project.id] });
      onTaskUpdated();
      message.success("Task deleted");
    },
    onError: () => message.error("Failed to delete task"),
  });

  return (
    <List
      dataSource={project.tasks}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No tasks yet"
          />
        ),
      }}
      renderItem={(task) => {
        const isEditing = editingTaskId === task.id;
        const isOwner = project.owner.id === userId;
        const isAssigned = task.assignedTo?.id === userId;
        const canEdit = isOwner || isAssigned;
        const canDelete = isOwner;

        return (
          <List.Item key={task.id}>
            <Card
              title={
                isEditing ? (
                  <div className="mr-10">
                    <Input
                      defaultValue={task.title}
                      onChange={(e) =>
                        setEditedTask((prev: EditedTask) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                ) : (
                  task.title
                )
              }
              style={{ width: "100%" }}
              extra={
                canEdit || canDelete ? (
                  <Space>
                    {isEditing ? (
                      <>
                        <Button
                          icon={<CloseOutlined />}
                          onClick={() => setEditingTaskId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          icon={<SaveOutlined />}
                          onClick={() =>
                            updateMutation.mutate({
                              id: task.id,
                              dto: editedTask,
                            })
                          }
                        >
                          Save
                        </Button>
                      </>
                    ) : (
                      <>
                        {canEdit && (
                          <Button
                            icon={<EditOutlined />}
                            onClick={() => {
                              setEditingTaskId(task.id);
                              setEditedTask({
                                title: task.title,
                                description: task.description,
                                status: task.status,
                                assignedToId: task.assignedTo?.id ?? null,
                              });
                            }}
                          >
                            Edit
                          </Button>
                        )}
                        {canDelete && (
                          <Popconfirm
                            title="Delete this task?"
                            onConfirm={() => deleteMutation.mutate(task.id)}
                          >
                            <Button danger>Delete</Button>
                          </Popconfirm>
                        )}
                      </>
                    )}
                  </Space>
                ) : null
              }
            >
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <div>
                  <Text strong>Status:</Text>{" "}
                  {isEditing ? (
                    <Select
                      defaultValue={task.status}
                      style={{ width: 150 }}
                      onChange={(value) =>
                        setEditedTask((prev: EditedTask) => ({
                          ...prev,
                          status: value,
                        }))
                      }
                      options={TASK_STATUS_OPTIONS}
                    />
                  ) : (
                    TASK_STATUS_OPTIONS.find((s) => s.value === task.status)
                      ?.label || task.status
                  )}
                </div>

                <div>
                  <Text strong>Assigned to:</Text>{" "}
                  {isEditing ? (
                    <Select
                      defaultValue={task.assignedTo?.id}
                      options={userOptions}
                      style={{ width: 200 }}
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      onChange={(value) =>
                        setEditedTask((prev: EditedTask) => ({
                          ...prev,
                          assignedToId: value ?? null,
                        }))
                      }
                    />
                  ) : (
                    task.assignedTo?.name || (
                      <Text type="secondary">Unassigned</Text>
                    )
                  )}
                </div>

                {isEditing ? (
                  <Input.TextArea
                    defaultValue={task.description}
                    rows={3}
                    onChange={(e) =>
                      setEditedTask((prev: EditedTask) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                ) : (
                  task.description && (
                    <div>
                      <Text strong>Description:</Text> {task.description}
                    </div>
                  )
                )}
              </Space>
            </Card>
          </List.Item>
        );
      }}
    />
  );
}
