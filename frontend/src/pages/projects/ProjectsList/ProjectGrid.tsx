import { Row, Col, Card, Typography, Button } from "antd";
import { FolderOpenOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { NAVIGATE_ROUTES } from "../../../shared/constants/routing/routes.constants";
import type { Project } from "../../../shared/types/project/project.types";

const { Text, Paragraph } = Typography;

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const navigate = useNavigate();

  return (
    <Row gutter={[24, 24]}>
      {projects.map((project) => (
        <Col xs={24} sm={12} md={8} lg={6} key={project.id}>
          <Card
            hoverable
            title={
              <Text strong ellipsis>
                {project.title}
              </Text>
            }
            actions={[
              <Button
                type="link"
                icon={<FolderOpenOutlined />}
                onClick={() =>
                  navigate(NAVIGATE_ROUTES.projectDetails(project.id))
                }
              >
                View
              </Button>,
            ]}
          >
            <div style={{ minHeight: 80 }}>
              <Paragraph ellipsis={{ rows: 3 }}>
                {project.description || (
                  <span className="text-gray-500">
                    No description provided.
                  </span>
                )}
              </Paragraph>
            </div>
            <Text type="secondary">Tasks: {project.tasks?.length ?? 0}</Text>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
