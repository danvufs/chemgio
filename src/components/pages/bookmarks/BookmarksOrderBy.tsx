// Importing necessary modules
import { FC } from 'react'
import { Chip, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  ExpandLess,
  ExpandMore,
  FavoriteBorder,
  Group,
} from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { bookmarksSlice } from '../../../store/reducers/BookmarksSlice'
// Creating a functional component named "BookmarksOrderBy"
export const BookmarksOrderBy: FC = () => {
  // Initializing i18n translation hook
  const { t } = useTranslation(['other'])
  // Accessing the sortBookmarksBy state variable from Redux store
  const { sortBookmarksBy } = useAppSelector((state) => state.bookmarks)
  // Extracting Redux actions for setting bookmarks by newest, oldest, popularity, and controversial
  const {
    setBookmarksByNewest,
    setBookmarksByOldest,
    setBookmarksByPopularity,
    setBookmarksByControversial,
  } = bookmarksSlice.actions
  // Initializing Redux dispatch hook
  const dispatch = useAppDispatch()
  // Creating event handlers for sorting bookmarks by newest, oldest, popularity, and controversial
  const handleSortBookmarksByNewest = () => {
    dispatch(setBookmarksByNewest())
  }

  const handleSortBookmarksByOldest = () => {
    dispatch(setBookmarksByOldest())
  }

  const handleSortBookmarksByPopularity = () => {
    dispatch(setBookmarksByPopularity())
  }

  const handleSortBookmarksByControversial = () => {
    dispatch(setBookmarksByControversial())
  }
  // Rendering the component with Stack, Typography, and Chip components
  return (
    <Stack
      alignItems="center"
      direction="row"
      sx={{ ml: 2, mb: 2, flexWrap: 'wrap', gap: 2 }}
    >
      <Typography>{t('title5')}</Typography>
      <Chip
        label={t('title6')}
        icon={<ExpandMore />}
        color={sortBookmarksBy === 'newest' ? 'primary' : 'default'}
        onClick={handleSortBookmarksByNewest}
      />
      <Chip
        label={t('title7')}
        icon={<ExpandLess />}
        color={sortBookmarksBy === 'oldest' ? 'primary' : 'default'}
        onClick={handleSortBookmarksByOldest}
      />
      <Chip
        label={t('title8')}
        icon={<FavoriteBorder sx={{ pl: 0.6 }} />}
        color={sortBookmarksBy === 'popularity' ? 'primary' : 'default'}
        onClick={handleSortBookmarksByPopularity}
      />
      <Chip
        label={t('title9')}
        icon={<Group sx={{ pl: 0.6 }} />}
        color={sortBookmarksBy === 'controversial' ? 'primary' : 'default'}
        onClick={handleSortBookmarksByControversial}
      />
    </Stack>
  )
}
