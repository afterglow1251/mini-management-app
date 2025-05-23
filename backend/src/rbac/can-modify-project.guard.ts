import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class CanModifyProjectGuard implements CanActivate {
  constructor(private readonly projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user.id;
    const projectId = parseInt(req.params.id, 10);

    const project = await this.projectsService.findOne(projectId, ['owner']);

    const isOwner = project.owner.id === userId;
    if (!isOwner) {
      throw new ForbiddenException(
        'Only project owner can modify this project',
      );
    }

    return true;
  }
}
