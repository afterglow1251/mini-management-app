import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class CanModifyTaskGuard implements CanActivate {
  constructor(private readonly tasksService: TasksService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user.id;
    const taskId = parseInt(req.params.id, 10);

    const task = await this.tasksService.findOne(taskId, [
      'project.owner',
      'assignedTo',
    ]);

    const isOwner = task.project.owner.id === userId;
    const isAssigned = task.assignedTo?.id === userId;

    if (!isOwner && !isAssigned) {
      throw new ForbiddenException(
        'Only the project owner or the assigned user can modify tasks',
      );
    }

    return true;
  }
}
