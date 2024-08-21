'use client'
import { UserContext } from "@/provider/UserProvider";
import React, { useContext } from "react";
import styles from '@/ui/account.module.css'

const Account = () => {
  const currentUser = useContext(UserContext)
  return (
   <>
  {currentUser ? ( <div className={styles.main}>
    {currentUser[0]?.email}
    <p>Уровень: {currentUser[0]?.level}</p>
    <p>До следующего уровня осталось {5 - currentUser[0]?.progress} отметки</p>
    <p>Сейчас у вас {currentUser[0]?.wallet} у. е., дойдите до следующего уровня чтобы получить  еще 2 чоко-коина</p>
    <p>Ваше максимальное количество привычек: {currentUser[0].maxHabit}</p>
    <p>Максимальное количество групп: {currentUser[0].maxGroup}</p>
   </div>
) : (<p>Сначала авторизуйтесь</p>)}
   </>
  );
};

export default Account;
