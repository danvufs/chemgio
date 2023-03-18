// Import necessary Redux toolkit functions and types
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IPost } from './../../types'

// Define initial state for the posts slice
const initialState = {
  sortPostsBy: 'newest',
  posts: [] as IPost[],
}

// Create the posts slice
export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Set posts and sort based on current sort order
    setPosts(state, action: PayloadAction<IPost[]>) {
      if (state.sortPostsBy === 'newest') {
        state.posts = action.payload.sort((a, b) => +b.createdAt - +a.createdAt)
      } else if (state.sortPostsBy === 'oldest') {
        state.posts = action.payload.sort((a, b) => +a.createdAt - +b.createdAt)
      } else if (state.sortPostsBy === 'popularity') {
        state.posts = action.payload.sort(
          (a, b) => b.likes.length - a.likes.length
        )
      } else if (state.sortPostsBy === 'controversial') {
        state.posts = action.payload.sort(
          (a, b) => b.comments.length - a.comments.length
        )
      }
    },
    // Set sort order to newest and sort posts accordingly
    setPostsByNewest(state) {
      state.sortPostsBy = 'newest'
      state.posts = state.posts.sort((a, b) => +b.createdAt - +a.createdAt)
    },
    // Set sort order to oldest and sort posts accordingly
    setPostsByOldest(state) {
      state.sortPostsBy = 'oldest'
      state.posts = state.posts.sort((a, b) => +a.createdAt - +b.createdAt)
    },
    // Set sort order to popularity and sort posts accordingly
    setPostsByPopularity(state) {
      state.sortPostsBy = 'popularity'
      state.posts = state.posts.sort((a, b) => b.likes.length - a.likes.length)
    },
    // Set sort order to controversial and sort posts accordingly
    setPostsByControversial(state) {
      state.sortPostsBy = 'controversial'
      state.posts = state.posts.sort(
        (a, b) => b.comments.length - a.comments.length
      )
    },
    // Remove all posts
    removePosts(state) {
      state.posts = []
    },
  },
})

// Export the reducer for the posts slice
export default postsSlice.reducer
