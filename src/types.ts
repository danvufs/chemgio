// Importing necessary dependencies and components
import { SvgIconTypeMap } from '@mui/material'  // A type definition for SVG icons used in the application
import { OverridableComponent } from '@mui/material/OverridableComponent'  // A component used for creating custom components that can override MUI components

// Defining interface types for various data used in the application
export interface IUser {
  bookmarks: IPost[]
  createdAt: string
  displayName: string
  email?: string
  emoji: string
  friends: IUser[]
  groups: any[]
  images: string[]
  music: any[]
  password?: string
  photoURL: string
  uid: string
  isAuth?: boolean
}

export interface IUserState {
  bookmarks: IPost[] | null
  createdAt: string | null
  displayName: string | null
  email?: string | null
  emoji: string | null
  friends: IUser[] | null
  groups: any[] | null
  images: string[] | null
  music: any[] | null
  password?: string | null
  photoURL: string | null
  uid: string | null
  isAuth?: boolean
}

export interface IGlobalState {
  language: string
  theme: string
}

export interface IUserData {
  displayName: string
  email: string
  password: string
  photoURL: string
}

export interface IPost {
  author: IUser
  createdAt: string
  content: string
  comments: IComment[]
  likes: IUser[]
  bookmarks: string[]
  images: string[]
  views: number
  id: string
}

export interface IComment {
  author: IUser
  content: string
  createdAt: string
  id: string
  likes: IUser[]
  images: string[]
}

export interface IMenuItem {
  link: string
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string }  // An interface for menu items, which includes a link and an icon
}
