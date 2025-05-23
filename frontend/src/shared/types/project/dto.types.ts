export interface CreateProjectDto {
  title: string;
  description?: string;
  ownerId: number;
}

export interface UpdateProjectDto {
  title?: string;
  description?: string;
}
