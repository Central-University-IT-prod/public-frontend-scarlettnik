"use client";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { AuthContext } from "@/provider/AuthProvider";
import styles from "@/ui/shop.module.css";
import { UserContext } from "@/provider/UserProvider";
import { useContext, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

export default function Shop() {
  const { user } = AuthContext();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const currentUser = useContext(UserContext);
  const userDocReference = doc(db, "users", user?.user?.uid);
  const wallet = currentUser[0]?.wallet
  const updateMaxGroup = async () => {
    const userDoc = await getDoc(userDocReference);
    const userData = userDoc.data();
    const newMaxGroup = userData.maxGroup + 3;
    const newWallet = userData.wallet - 3;
    await updateDoc(userDocReference, {
      ...userData,
      maxGroup: newMaxGroup,
      wallet: newWallet,
    });

    setToastMessage("Вы увеличили максимальное количество групп");
    setToastOpen(true);
  };

  const updateMaxHabbit = async () => {
    const userDoc = await getDoc(userDocReference);
    const userData = userDoc.data();
    const newMaxHabit = userData.maxHabit + 5;
    const newWallet = userData.wallet - 3;
    await updateDoc(userDocReference, {
      ...userData,
      maxHabit: newMaxHabit,
      wallet: newWallet,
    });

    setToastMessage("Вы увеличили максимальное количество привычек");
    setToastOpen(true);
  };

  const addTheme = async () => {
    const userDoc = await getDoc(userDocReference);
    const userData = userDoc.data();
    const newWallet = userData.wallet - 5;
    await updateDoc(userDocReference, {
      ...userData,
      customTheme: true,
      wallet: newWallet,
    });

    setToastMessage("Ваша тема изменена");
    setToastOpen(true);
  };

  return (
    <>
      <div className={styles.cardList}>
        <div className={styles.card}>
          Увеличение максимального количества групп на 3
          <button
            onClick={updateMaxGroup}
            className={styles.buyButton}
            disabled={wallet - 3 <= 0}
          >
            {wallet - 3 > 0 ? "Купить за 3" : "Недостаточно средств"}
          </button>
        </div>
        <div className={styles.card}>
          Увеличение максимального количества привычек на 5
          <button
            onClick={updateMaxHabbit}
            className={styles.buyButton}
            disabled={wallet - 3 <= 0}
          >
            {wallet - 3 > 0 ? "Купить за 5" : "Недостаточно средств"}
          </button>
        </div>
        <div className={styles.card}>
          Изменение стилей на главном экране
          <button
            onClick={addTheme}
            className={styles.buyButton}
            disabled={wallet - 1000 <= 0 || currentUser[0]?.customTheme}

          >
            {currentUser[0]?.customTheme ? "Уже куплено" : wallet - 1000 > 0 ? "Купить за 1000" : "Недостаточно средств"}
          </button>
        </div>
      </div>
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          sx={{ width: "100%", maxWidth: 400 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
  
    </>
  );
}
