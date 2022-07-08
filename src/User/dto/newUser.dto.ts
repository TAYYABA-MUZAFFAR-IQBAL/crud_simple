import { UserRole } from '../Role.enum';

export class NewUserDTO {
  User_name: string;
  email: string;
  password: string;
  role: UserRole;
}
