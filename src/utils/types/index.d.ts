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

type TaskResponse = {
  id: number;
  title: string;
  created_at: Date;
  due_at: Date;
  assignees: {
    userId: number,
    taskId: number,
    users: User
  }[];
  creatorid: User;
  isDone: boolean;
};


export type TaskField = 'id' | 'title' | 'createdDate' | 'deadline' | 'creator' | 'assignees' | 'completed'