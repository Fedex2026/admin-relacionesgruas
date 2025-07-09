import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAtkKLHmfhEZ9VxLDSrovEetkB4pvD_C0U",
  authDomain: "relaciongruasmetro.firebaseapp.com",
  projectId: "relaciongruasmetro",
  storageBucket: "relaciongruasmetro.firebasestorage.app",
  messagingSenderId: "541322291168",
  appId: "1:541322291168:web:f7a1e0336faf28245e2d85"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);