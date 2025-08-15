import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNELCnR0Ko947UR_hNlBsDOaF3ZkneWyc",
  authDomain: "skillforge-55d72.firebaseapp.com",
  projectId: "skillforge-55d72",
  storageBucket: "skillforge-55d72.appspot.com",
  messagingSenderId: "160238337803",
  appId: "1:160238337803:web:6c345f5afc78b0d3186c0e",
  measurementId: "G-3BL0Y5EJ16"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
