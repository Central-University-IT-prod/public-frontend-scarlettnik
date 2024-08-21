"use client";
import { auth } from "@/services/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import Loader from '@/elements/Loader'

const Context = createContext({});

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    const subscribe = auth.onAuthStateChanged((userState) => {
      setUser({ isLogin: userState ? true : false, user: userState });
      setLoading(false);
    });
    return subscribe;
  }, []);

  return (
    <Context.Provider value={{ user, setUser }}>
      {loading && <Loader/>}
      {!loading && children}
    </Context.Provider>
  );
};

export const AuthContext = () => useContext(Context);

export default AuthProvider;
