import React, { useState, useEffect, createContext } from "react";
import { auth, db } from "@/services/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const usersCollection = collection(db, "users");
        const userQuery = query(usersCollection, where("uid", "==", user?.uid));
        const subscribe = onSnapshot(userQuery, (querySnapshot) => {
          setUserData(
            querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }))
          );
        });

        return subscribe;
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
};

export default UserProvider;