// Import necessary Redux toolkit functions and types
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IPost } from './../../types'

// Define initial state for the bookmarks slice
const initialState = {
  sortBookmarksBy: 'newest',
  bookmarks: [] as IPost[],
}

// Create the bookmarks slice
export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    // Set bookmarks and sort based on current sort order
    setBookmarks(state, action: PayloadAction<IPost[]>) {
      if (state.sortBookmarksBy === 'newest') {
        state.bookmarks = action.payload.sort(
          (a, b) => +b.createdAt - +a.createdAt
        )
      } else if (state.sortBookmarksBy === 'oldest') {
        state.bookmarks = action.payload.sort(
          (a, b) => +a.createdAt - +b.createdAt
        )
      } else if (state.sortBookmarksBy === 'popularity') {
        state.bookmarks = action.payload.sort(
          (a, b) => b.likes.length - a.likes.length
        )
      } else if (state.sortBookmarksBy === 'controversial') {
        state.bookmarks = action.payload.sort(
          (a, b) => b.comments.length - a.comments.length
        )
      }
    },
    // Set sort order to newest and sort bookmarks accordingly
    setBookmarksByNewest(state) {
      state.sortBookmarksBy = 'newest'
      state.bookmarks = state.bookmarks.sort(
        (a, b) => +b.createdAt - +a.createdAt
      )
    },
    // Set sort order to oldest and sort bookmarks accordingly
    setBookmarksByOldest(state) {
      state.sortBookmarksBy = 'oldest'
      state.bookmarks = state.bookmarks.sort(
        (a, b) => +a.createdAt - +b.createdAt
      )
    },
    // Set sort order to popularity and sort bookmarks accordingly
    setBookmarksByPopularity(state) {
      state.sortBookmarksBy = 'popularity'
      state.bookmarks = state.bookmarks.sort(
        (a, b) => b.likes.length - a.likes.length
      )
    },
    // Set sort order to controversial and sort bookmarks accordingly
    setBookmarksByControversial(state) {
      state.sortBookmarksBy = 'controversial'
      state.bookmarks = state.bookmarks.sort(
        (a, b) => b.comments.length - a.comments.length
      )
    },
    // Remove all bookmarks
    removeBookmarks(state) {
      state.bookmarks = []
    },
  },
})

// Export the reducer for the bookmarks slice
export default bookmarksSlice.reducer
