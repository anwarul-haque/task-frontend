export enum Role {
    EMPLOYEE = 'Employee',
    TEAM_LEAD = 'Team Lead',
    MANAGER = 'Manager'
}

export interface User {
  _id?: string;
  username: string;
  email: string;
  role: Role;
  password?: string;
  teamLead?: { _id: string; username: string } | null;
  createdAt?: string;
  updatedAt?: string;
}