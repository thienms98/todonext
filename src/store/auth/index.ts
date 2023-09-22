import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

export interface Info {
  id?: number,
  username?: string;
  name?: string;
  image?: string;
  accessToken?: string;
  refreshToken?: string;
}

const initialState:Info = {};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveInfo (state, action:PayloadAction<Info>) {
      return action.payload
    }
  }
})

export const {saveInfo} = authSlice.actions
export default authSlice.reducer