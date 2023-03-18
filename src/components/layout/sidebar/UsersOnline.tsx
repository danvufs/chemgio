// Import necessary modules from various libraries
import { FC } from 'react'
import { Box, Skeleton, Stack, Typography, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'
import { BorderBox } from '../../ui/ThemeBox'
import { useAuth } from '../../providers/useAuth'
import { ThemeOnlineBadge } from '../../ui/ThemeOnlineBadge'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
import { useAppSelector } from '../../../hooks/redux'

// Define a React functional component named `UsersOnline` using the `FC` type from React.
export const UsersOnline: FC = () => {
  const theme = useTheme() // Call useTheme to get the theme object
  const { usersRdb } = useAuth() // Get the `usersRdb` object from the `useAuth` hook

  const { users } = useAppSelector((state) => state.users) // Get the `users` object from the Redux store

  const usersRdbList = Object.values(usersRdb) // Get an array of values from the `usersRdb` object

  // Filter the `usersRdb` array to get only online users
  const onlineUsersList = Object.values(usersRdb).filter(
    (user: any) => user.isOnline === true
  )

  // Render the component
  return (
    <BorderBox sx={{ mt: 2, p: 2 }}>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{
          fontWeight: 'bold', // Added bold style
          color: theme.palette.success.main, // Changed color to green
        }}
      >
        {usersRdbList.length > 0 ? (
          `Online: ${onlineUsersList.length}`
        ) : (
          <Skeleton width={100} />
        )}
      </Typography>

      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {usersRdbList.length > 0 && onlineUsersList.length > 0
          ? onlineUsersList.map((user: any) => (
            <Box key={user.uid} sx={{ width: '55px', mb: 0 }}>
              <Link to={`/profile/${user.uid}`}>
                <ThemeOnlineBadge
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  variant={usersRdb[user.uid]?.isOnline ? 'dot' : undefined}
                >
                  <ThemeAvatar
                    alt={user.displayName}
                    src={users.find((u) => u.uid === user.uid)?.photoURL}
                    sx={{
                      width: '55px',
                      height: '55px',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="h5">{user.emoji}</Typography>
                  </ThemeAvatar>
                </ThemeOnlineBadge>
                <Typography
                  variant="body2"
                  textAlign="center"
                  fontSize="13px"
                >
                  {user.displayName.replace(/ .*/, '').length < 8
                    ? user.displayName.replace(/ .*/, '')
                    : user.displayName.replace(/ .*/, '').slice(0, 7) + '…'}
                </Typography>
              </Link>
            </Box>
          ))
          : [...Array(4).keys()].map((user) => (
            <Box key={user} sx={{ width: '55px', mb: 0 }}>
              <ThemeOnlineBadge
                overlap="circular"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                variant="dot"
              >
                <Skeleton
                  variant="circular"
                  sx={{ width: '55px', height: '55px', mb: 0.5 }}
                />
              </ThemeOnlineBadge>
              <Typography variant="body2" textAlign="center" fontSize="13px">
                <Skeleton />
              </Typography>
            </Box>
          ))}
      </Stack>
    </BorderBox>
  )
}
