// Import necessary Redux toolkit functions and types
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '../../types'

// Define initial state for the users slice
const initialState = {
  users: [] as IUser[],
}

// Create the users slice
export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Set array of users
    setUsers(state, action: PayloadAction<IUser[]>) {
      state.users = action.payload
    },
    // Remove all users
    removeUsers(state) {
      state.users = []
    },
  },
})

// Export the reducer for the users slice
export default usersSlice.reducer
