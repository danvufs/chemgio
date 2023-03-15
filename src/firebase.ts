import { initializeApp } from 'firebase/app';


const apiKey = "AIzaSyDWk_yNvT1UFuAQ3pTiJl3N7bU9_NvlWVo";
const authDomain = "react1-9dc52.firebaseapp.com";
const projectId = "react1-9dc52";
const storageBucket = "react1-9dc52.appspot.com";
const messagingSenderId = "481731914450";
const appId = "1:481731914450:web:e53d8d7a68e49fc0f35b0b";
const measurementId = "G-2F32T5TBTX";
const databaseURL = "https://react1-9dc52-default-rtdb.firebaseio.com"

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
  databaseURL,
}

initializeApp(firebaseConfig)
