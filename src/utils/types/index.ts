export interface User {
  id: number;
  name: string;
  image: string;
}

export interface Task {
  id: number;
  title: string;
  createdDate: Date;
  deadline: Date;
  creator: User;
  assignees: User[];
  completed: boolean;
}