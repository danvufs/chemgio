// Import necessary modules from various libraries
import { FC } from 'react'
import { menu } from './menuList'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Badge,
  Box,
} from '@mui/material'
import { BorderBox } from '../../../ui/ThemeBox'
import { useNavigate } from 'react-router-dom'
import {
  BookmarkBorder,
  InfoOutlined,
  Logout,
  Person,
} from '@mui/icons-material'
import { useAuth } from '../../../providers/useAuth'
import { signOut } from 'firebase/auth'
import { useTranslation } from 'react-i18next'
import {
  ref,
  onValue,
  onDisconnect,
  set,
  serverTimestamp,
} from 'firebase/database'
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux'
import { userSlice } from '../../../../store/reducers/UserSlice'
import { usersSlice } from '../../../../store/reducers/UsersSlice'
import { postsSlice } from '../../../../store/reducers/PostsSlice'
import { bookmarksSlice } from '../../../../store/reducers/BookmarksSlice'

// Define a React functional component named `Menu` using the `FC` type from React.
export const Menu: FC = () => {
  // Use `useTranslation` hook to access the `t` function for localization
  const { t } = useTranslation(['menu'])
  // Use `useAuth` hook to access Firebase authentication and real-time database
  const { ga, rdb } = useAuth()
  // Use `useNavigate` hook to handle navigation within the application
  const navigate = useNavigate()

  // Use `useAppSelector` hook to access the `uid` and `bookmarks` states from the Redux store
  const { uid, bookmarks } = useAppSelector((state) => state.user)
  // Use `useAppDispatch` hook to dispatch actions to update the Redux store
  const { removeUser } = userSlice.actions
  const { removeUsers } = usersSlice.actions
  const { removePosts } = postsSlice.actions
  const { removeBookmarks } = bookmarksSlice.actions
  const dispatch = useAppDispatch()
  // Define a `handleLogout` function that logs out the current user
  const handleLogout = () => {
    // Update the user's status to "offline" in the Firebase database
    const isOnlineRef = ref(rdb, `users/${uid}/isOnline`)
    const lastOnlineRef = ref(rdb, `users/${uid}/lastOnline`)
    const connectedRef = ref(rdb, '.info/connected')

    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        set(isOnlineRef, false)
        set(lastOnlineRef, serverTimestamp())

        onDisconnect(lastOnlineRef).set(serverTimestamp())
      }
    })

    // Sign out the user using Firebase authentication
    signOut(ga)
    // Reset the Redux store by dispatching several actions
    dispatch(removeUser())
    dispatch(removeUsers())
    dispatch(removePosts())
    dispatch(removeBookmarks())
    // Navigate to the home page
    navigate('/')
  }

  // Render the navigation menu
  return (
    <BorderBox>
      <nav>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/profile/${uid}`)}>
              <ListItemIcon sx={{ mr: -2 }}>
                <Person color="primary" />
              </ListItemIcon>
              <ListItemText primary={t('title10')} />
            </ListItemButton>
          </ListItem>
          {menu.map((item, index) => (
            <ListItem key={`menu${index}`} disablePadding>
              <ListItemButton onClick={() => navigate(item.link)}>
                <ListItemIcon sx={{ mr: -2 }}>
                  <item.icon color="primary" />
                </ListItemIcon>
                <ListItemText primary={t(`title${index}`)} />
              </ListItemButton>
            </ListItem>
          ))}
          <Box
            sx={{ height: '48px', cursor: 'pointer' }}
            onClick={() => navigate('/bookmarks')}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ mr: -2 }}>
                  <BookmarkBorder color="primary" />
                </ListItemIcon>
                <ListItemText primary={t('title6')} />
              </ListItemButton>
            </ListItem>
            <Badge
              color="primary"
              badgeContent={bookmarks?.length}
              max={99}
              sx={{
                position: 'relative',
                top: '-25px',
                left: '245px',
                display: { md: 'none', lg: 'inline' },
              }}
            />
          </Box>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/about')}>
              <ListItemIcon sx={{ mr: -2 }}>
                <InfoOutlined color="primary" />
              </ListItemIcon>
              <ListItemText primary={t('title7')} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ mr: -2 }}>
                <Logout color="primary" />
              </ListItemIcon>
              <ListItemText primary={t('title8')} />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </BorderBox>
  )
}
