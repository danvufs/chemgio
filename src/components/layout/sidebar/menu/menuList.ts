// Import all the icons from the `@mui/icons-material` library
import * as Icons from '@mui/icons-material'

// Import the `IMenuItem` type from the `../../../../types` module
import { IMenuItem } from '../../../../types'

// Define an array of menu items, each with a link and an icon
export const menu: IMenuItem[] = [
  {
    link: '/',
    icon: Icons.Article, // Use the `Article` icon from `@mui/icons-material`
  },
  // {
  //   link: '/messenger',
  //   icon: Icons.Forum,
  // },
  {
    link: '/friends',
    icon: Icons.Group, // Use the `Group` icon from `@mui/icons-material`
  },
  // {
  //   link: '/groups',
  //   icon: Icons.Groups,
  // },
  // {
  //   link: '/photos',
  //   icon: Icons.Photo,
  // },
  // {
  //   link: '/music',
  //   icon: Icons.MusicNote,
  // },
]
