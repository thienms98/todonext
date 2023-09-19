import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/utils/types";

const initialState:User[] = []

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    initUsers: (state, action: PayloadAction<User[]>) => {
      state.splice(0, state.length)
      state.push(...action.payload);
    }
  }
})

export const {initUsers} = userSlice.actions
export default userSlice.reducer