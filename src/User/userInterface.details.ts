import { UserRole } from "./Role.enum";

export interface UserDetails {
    id: string;
    User_name: string;
    email: string;
   role:UserRole[];
  }
  