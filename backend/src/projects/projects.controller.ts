import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CanModifyProjectGuard } from 'src/rbac/can-modify-project.guard';
import { TasksService } from 'src/tasks/tasks.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id, [
      'owner',
      'tasks',
      'tasks.assignedTo',
    ]);
  }

  @Patch(':id')
  @UseGuards(CanModifyProjectGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(CanModifyProjectGuard)
  @HttpCode(204)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.delete(id);
  }

  @Get(':id/tasks')
  getTasksForProject(
    @Param('id', ParseIntPipe) projectId: number,
    @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.tasksService.findByProjectId(projectId, order);
  }
}
