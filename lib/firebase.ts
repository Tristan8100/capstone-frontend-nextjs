// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXUPuznP3PABBwx32TksTyK0JqEHj_Mgc",
  authDomain: "btechlink-66e2d.firebaseapp.com",
  projectId: "btechlink-66e2d",
  storageBucket: "btechlink-66e2d.firebasestorage.app",
  messagingSenderId: "291876624685",
  appId: "1:291876624685:web:c439b9e055c42357f39ba4",
  measurementId: "G-2KYK4LH6M1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getFirestore(app);
// Analytics only works in the browser
export let analytics: ReturnType<typeof getAnalytics> | null = null;

if (typeof window !== "undefined") {
  isSupported().then((ok) => {
    if (ok) {
      analytics = getAnalytics(app);
    }
  });
}