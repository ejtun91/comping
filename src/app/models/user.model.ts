import { Roles } from "./auth-response.model";

export interface User {
  id?: string;
  username: string;
  firstName: string;
  lastName: string;
  createdTimestamp?: string;
}

export interface UserPayload {
  id?: string;
  username: string;
  email: string;
  enabled?: boolean;
  firstName?: string;
  lastName?: string;
  credentials?: [credentials];
  roleName?: string;
  roles?: Roles[];
  viewRoles?: Roles[];
  emailVerified?: boolean;
}

interface credentials {
  type: string;
  value: string;
}
