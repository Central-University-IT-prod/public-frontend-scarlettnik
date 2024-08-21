import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "secret",
  authDomain: "final-final-prod.firebaseapp.com",
  projectId: "final-final-prod",
  storageBucket: "final-final-prod.appspot.com",
  messagingSenderId: "secret",
  appId: "secret"
};

const app = initializeApp(firebaseConfig);
initializeApp(firebaseConfig);
const messaging = getMessaging();

export const Token = () => {
  return getToken(messaging, {
    vapidKey:
      "BFILSCZ8HPJ6h9I1A10s1mppqj6ytVsM3bKvsU33LwUMR-fyDnBvciSqqGWUlQLAxq6Yrh9Rp44RZ0eTvYp48-M",
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log(currentToken);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const Message = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("onMesage", payload);

      resolve(payload);
    });
  });
};

const db = getFirestore();
export const auth = getAuth(app);
export { db };
