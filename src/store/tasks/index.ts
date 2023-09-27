import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction, SliceCaseReducers} from '@reduxjs/toolkit'
import { Task, User } from '@/utils/types';

const placeholderImg: string =
    'https://www.dovercourt.org/wp-content/uploads/2019/11/610-6104451_image-placeholder-png-user-profile-placeholder-image-png-286x300.jpg';


const initialState: {
  tasks: Task[],
  lastActions: {
    action: string,
    payload: any
  },
} = {
  tasks: [],
  lastActions: {
    action: '',
    payload: {}
  }
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
      };
      state.tasks = [{...data}, ...state.tasks]
      state.lastActions = {
        action: 'createTask',
        payload: data
      }
    },
    removeTask(state, action:PayloadAction<{id: number}>){
      const idx = state.tasks.findIndex(task => task.id === action.payload.id);
      if(idx !== -1){ 
        state.lastActions = {
          action: 'removeTask',
          payload: state.tasks[idx]
        }
        state.tasks.splice(idx, 1);
      }
    },
    changeState(state, action: PayloadAction<{id: number}>){
      const idx = state.tasks.findIndex(item => item.id === action.payload.id);
      if(idx === -1) return
      state.tasks[idx].completed = !state.tasks[idx].completed;
      state.lastActions = {
        action: 'changeState',
        payload: state.tasks[idx]
      }
    },
    changeTitle(state, action: PayloadAction<{id: number, title:string}>){
      const idx = state.tasks.findIndex(item => item.id === action.payload.id);
      if(idx === -1) return
      state.tasks[idx].title = action.payload.title
      state.lastActions = {
        action: 'changeTitle',
        payload: state.tasks[idx]
      }
    },
    changeAssignees(state, action: PayloadAction<{id: number, assignees: User[]}>){
      const idx = state.tasks.findIndex(item => item.id === action.payload.id);
      if(idx === -1) return
      state.lastActions = {
        action: 'changeAssignees',
        payload: state.tasks[idx]
      }
      state.tasks[idx].assignees = action.payload.assignees
    },
    changeDeadline(state, action: PayloadAction<{id: number, deadline: Date}>){
      const idx = state.tasks.findIndex(item => item.id === action.payload.id);
      if(idx === -1) return
      state.tasks[idx].deadline = action.payload.deadline
      state.lastActions = {
        action: 'changeDeadline',
        payload: state.tasks[idx]
      }
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