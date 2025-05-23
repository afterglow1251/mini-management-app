import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
  ) {}

  async create(createDto: CreateTaskDto): Promise<Task> {
    const project = await this.projectsService.findOne(createDto.projectId);

    const assignedTo = createDto.assignedToId
      ? await this.usersService.findOne(createDto.assignedToId)
      : null;

    const task = this.taskRepository.create({
      title: createDto.title,
      description: createDto.description,
      status: createDto.status,
      project,
      assignedTo,
    });

    return this.taskRepository.save(task);
  }

  findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      relations: ['project.owner', 'assignedTo'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number, relations: string[] = []): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations,
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: number, updateDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (updateDto.assignedToId !== undefined) {
      task.assignedTo =
        updateDto.assignedToId === null
          ? null
          : await this.usersService.findOne(updateDto.assignedToId);
    }

    Object.assign(task, updateDto);
    return this.taskRepository.save(task);
  }

  async delete(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async findByProjectId(projectId: number, order: 'asc' | 'desc') {
    return this.taskRepository.find({
      where: { project: { id: projectId } },
      order: { id: order.toUpperCase() as 'ASC' | 'DESC' },
      relations: ['assignedTo'],
    });
  }
}
