export interface User {
  id: number;
  username: string;
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

type TaskResponse = {
  id: number;
  title: string;
  created_at: Date;
  due_at: Date;
  creatorid: number;
  assignees: {
    userId: number,
    taskId: number,
    users: User
  }[];
  creator: User,
  isDone: boolean;
};

export interface Pagination{totalCount: number, pageNumber: number, pageSize: number}

export type TaskField = 'id' | 'title' | 'createdDate' | 'deadline' | 'creator' | 'assignees' | 'completed'