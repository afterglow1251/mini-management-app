import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    private readonly usersService: UsersService,
  ) {}

  async create(createDto: CreateProjectDto): Promise<Project> {
    const owner = await this.usersService.findOne(createDto.ownerId);

    const project = this.projectRepo.create({
      title: createDto.title,
      description: createDto.description,
      owner,
    });

    return this.projectRepo.save(project);
  }

  findAll(): Promise<Project[]> {
    return this.projectRepo.find({
      relations: ['owner', 'tasks'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number, relations: string[] = []): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations,
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: number, updateDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    const updated = this.projectRepo.merge(project, updateDto);
    return this.projectRepo.save(updated);
  }

  async delete(id: number): Promise<void> {
    const res = await this.projectRepo.delete(id);
    if (!res.affected) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }
}
