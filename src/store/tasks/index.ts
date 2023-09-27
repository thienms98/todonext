import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction, SliceCaseReducers} from '@reduxjs/toolkit'
import { Task, User } from '@/utils/types';

const initialState: {
  tasks: Task[]
} = {
  tasks: []
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    initTasks(state, action: PayloadAction<Task[]>){
      state.tasks = action.payload
    },
    createTask(state, action:PayloadAction<{id: number, title:string, deadline: Date, creator:User, assignees: User[]}>) {
      const data = {
        createdDate: new Date(),
        completed: false,
        ...action.payload
      }
      state.tasks = [{...data}, ...state.tasks]
    },
    removeTask(state, action:PayloadAction<{id: number}>){
      const idx = state.tasks.findIndex(task => task.id === action.payload.id);
      if(idx !== -1)
        state.tasks.splice(idx, 1);
    },
    changeState(state, action: PayloadAction<{id: number}>){
      const idx = state.tasks.findIndex(item => item.id === action.payload.id);
      if(idx === -1) return;
      state.tasks[idx].completed = !state.tasks[idx].completed;
    },
    changeTitle(state, action: PayloadAction<{id: number, title:string}>){
      const idx = state.tasks.findIndex(item => item.id === action.payload.id);
      if(idx === -1) return
      state.tasks[idx].title = action.payload.title
    },
    changeAssignees(state, action: PayloadAction<{id: number, assignees: User[]}>){
      const idx = state.tasks.findIndex(item => item.id === action.payload.id);
      if(idx === -1) return;
      state.tasks[idx].assignees = action.payload.assignees
    },
    changeDeadline(state, action: PayloadAction<{id: number, deadline: Date}>){
      const idx = state.tasks.findIndex(item => item.id === action.payload.id);
      if(idx === -1) return;
      state.tasks[idx].deadline = action.payload.deadline
    },
    // revertAction(state){
    //   const {action, payload} = state.lastActions
    //   if(action === 'createTask') tasksSlice.caseReducers.removeTask(state, {payload: {id:payload.id}, type: 'tasks/removeTask'})
    //   if(action === 'removeTask') tasksSlice.caseReducers.removeTask(state, {payload, type: 'tasks/createTask'})
    //   // else tasksSlice.caseReducers[action](state, {payload, type: 'tasks/createTask'})
    // }
  }
})

export const {initTasks, createTask, removeTask, changeState, changeTitle, changeAssignees, changeDeadline} = tasksSlice.actions
export default tasksSlice.reducer