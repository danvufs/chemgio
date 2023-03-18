// Import necessary Redux toolkit functions and types
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser, IUserState } from '../../types'

// Define initial state for the user slice
const initialState = {
  bookmarks: null,
  createdAt: null,
  displayName: null,
  emoji: null,
  friends: null,
  groups: null,
  music: null,
  photoURL: null,
  images: null,
  uid: null,
  isAuth: false,
} as IUserState

// Create the user slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set user data from Firebase
    setUser(state, action: PayloadAction<IUser>) {
      state.bookmarks = action.payload.bookmarks
      state.createdAt = action.payload.createdAt
      state.displayName = action.payload.displayName
      state.emoji = action.payload.emoji
      state.friends = action.payload.friends
      state.groups = action.payload.groups
      state.music = action.payload.music
      state.photoURL = action.payload.photoURL
      state.images = action.payload.images
      state.uid = action.payload.uid
      state.isAuth = action.payload.isAuth
    },
    // Remove all user data
    removeUser(state) {
      state.bookmarks = null
      state.createdAt = null
      state.displayName = null
      state.emoji = null
      state.friends = null
      state.groups = null
      state.music = null
      state.photoURL = null
      state.images = null
      state.uid = null
      state.isAuth = false
    },
  },
})

// Export the reducer for the user slice
export default userSlice.reducer
