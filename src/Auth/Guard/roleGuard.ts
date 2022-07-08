import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { hasRoles } from '../Decorators/UserHasRoles';
import { UserRole } from 'src/User/Role.enum';
import { UserService } from '../../User/user.service';
import { UserDetails } from '../../User/userInterface.details';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    //what is required role
    const requireRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    //does the current user making the request have the required role?

    if (!requireRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserService;

    
    const hasRole = (role: UserRole) =>
      !!requireRoles.find((item) => role.indexOf(item) > -1);
    if (user && hasRole(user.role)) {
          return true;
    }
      return;
  }

}
