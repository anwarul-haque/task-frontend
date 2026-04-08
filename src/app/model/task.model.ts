export interface AssignedUser {
  _id: string;
  username: string;
  email:string;
  role: string;
  teamLead?:{
    _id: string;
    username: string;
    email:string;
    role: string;
  }
}

export interface Task {
    _id?: string;
    title: string;
    description?: string;
    status: string;

    createdBy?: AssignedUser;
    assignedTo?: AssignedUser;

    createdAt?: string;
    updatedAt?: string;
  }