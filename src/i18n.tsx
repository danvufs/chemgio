// Import the necessary modules and files
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import store from './store/store'

// Import the translation files for English and Vietnamese
import translationEnAbout from './translation/en/about.json'
import translationEnAuth from './translation/en/auth.json'
import translationEnBookmarks from './translation/en/bookmarks.json'
import translationEnFriends from './translation/en/friends.json'
import translationEnNews from './translation/en/news.json'
import translationEnNotFound from './translation/en/notFound.json'
import translationEnProfile from './translation/en/profile.json'
import translationEnMenu from './translation/en/menu.json'
import translationEnOther from './translation/en/other.json'
import translationEnEmojiPicker from './translation/en/emojiPicker.json'

import translationVnAbout from './translation/vn/about.json'
import translationVnAuth from './translation/vn/auth.json'
import translationVnBookmarks from './translation/vn/bookmarks.json'
import translationVnFriends from './translation/vn/friends.json'
import translationVnNews from './translation/vn/news.json'
import translationVnNotFound from './translation/vn/notFound.json'
import translationVnProfile from './translation/vn/profile.json'
import translationVnMenu from './translation/vn/menu.json'
import translationVnOther from './translation/vn/other.json'
import translationVnEmojiPicker from './translation/vn/emojiPicker.json'

// Define the translation resources for both languages
const resources = {
  en: {
    about: translationEnAbout,
    auth: translationEnAuth,
    bookmarks: translationEnBookmarks,
    friends: translationEnFriends,
    news: translationEnNews,
    notFound: translationEnNotFound,
    profile: translationEnProfile,
    menu: translationEnMenu,
    other: translationEnOther,
    emojiPicker: translationEnEmojiPicker,
  },
  vn: {
    about: translationVnAbout,
    auth: translationVnAuth,
    bookmarks: translationVnBookmarks,
    friends: translationVnFriends,
    news: translationVnNews,
    notFound: translationVnNotFound,
    profile: translationVnProfile,
    menu: translationVnMenu,
    other: translationVnOther,
    emojiPicker: translationVnEmojiPicker,
  },
}

// Define a function to initialize i18next with the current language
export const initI18next = () => {
  const lng = store.getState().global.language

  return i18next.use(initReactI18next).init({
    resources,
    lng,
  })
}
