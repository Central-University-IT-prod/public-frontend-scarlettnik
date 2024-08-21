"use client";
import InputField from "@/style/InputField";
import { LOGIN_ROUTE, HOME_ROUTE } from "@/routes";
import useAuthentication from "@/hooks/useAuthentication";
import { db } from "@/services/firebase";
import { registerValidation } from "@/validator/auth";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, doc, setDoc } from "firebase/firestore";
import styles from "@/ui/auth.module.css";
import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";

const Register = () => {
  const router = useRouter();
  useAuthentication();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = registerValidation();

  const submitForm = async (values) => {
    try {
      const { email, password } = values;
      const auth = getAuth();
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const usersCollection = collection(db, "users");
      const userDoc = doc(usersCollection, uid);
      router.push(HOME_ROUTE);
      await setDoc(userDoc, {
        uid,
        email,
        level: 0,
        wallet: 5,
        maxHabit: 10,
        maxGroup: 5,
        maraphones: [],
        groups: [],
        progress: 0
      });
     
      reset();
    } catch (error) {
      setToastMessage("Проверьте правильность данных");
      setToastOpen(true);
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.formData}>
        <div>
          <span>Регистрация</span>
        </div>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className={styles.inputData}>
          <InputField
            register={register}
            error={errors.email}
            type="text"
            placeholder="Enter Your Email Here..."
            name="email"
            label="Email"
          />
          </div>
          <div className={styles.inputData}>
          <InputField
            register={register}
            error={errors.password}
            type="password"
            placeholder="Enter Your Password Here..."
            name="password"
            label="Password"
          />
          </div>
          <div className={styles.inputData}>
          <InputField
            register={register}
            error={errors.cnfPassword}
            type="password"
            placeholder="Enter Your Confirm Password Here..."
            name="cnfPassword"
            label="Confirm Password"
          />
          </div>
          <button className={styles.button}>Регистрация</button>
        </form>
        <div>
          <span>
            Если уже есть аккаунт
            <Link href={LOGIN_ROUTE}>
              <span style={{ color: "#99ff99" }}> Войдите</span>
            </Link>
          </span>
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
    </div>
  );
};

export default Register;
